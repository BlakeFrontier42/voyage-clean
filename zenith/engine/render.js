// Usage: node render.js ../scripts/ep001-linear-algebra.json [--audio voice.mp3] [--fps 30] [--preview]
// Writes ../out/<id>.mp4, <id>.srt, <id>-narration.txt (paste into the voice tool).
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');

const args = process.argv.slice(2), opt = n => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : null; };
const epPath = path.resolve(args[0]), EP = JSON.parse(fs.readFileSync(epPath, 'utf8'));
const FPS = +(opt('fps') || 30), PREVIEW = args.includes('--preview'), AUDIO = opt('audio');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const OUT = path.resolve(__dirname, '../out'); fs.mkdirSync(OUT, { recursive: true });

// ── timeline: estimated speech timing (replace with real word timestamps once the voice exists) ──
const SENT_PAUSE = 0.24, LEAD = 0.2, TAIL = 0.4;
const tl = { scenes: [], captions: [], words: [] };
let t = 0;
EP.scenes.forEach(sc => {
  const start = t; t += LEAD;
  const toks = sc.say.replace(/\{([^|}]+)\|[^}]+\}/g, (m, w) => w.replace(/\s+/g, '\u00a0')).split(/\s+/).filter(Boolean);
  let chunk = [], cStart = t;
  toks.forEach((tok, i) => {
    const clean = tok.replace(/\*/g, ''), dur = Math.max(0.17, clean.length / 17 + 0.07);
    tl.words.push({ start: t, end: t + dur, w: clean });
    t += dur; chunk.push(tok);
    const endSent = /[.?!]$/.test(clean), soft = /[,:;]$/.test(clean);
    if (endSent) t += SENT_PAUSE;
    const next = toks[i + 1] ? toks[i + 1].replace(/\*/g, '') : '', weak = /^(a|an|the|of|to|for|and|or|that|it|in|with|is|are|you'll|your)$/i.test(clean);
    const nextEnds = /[.?!]$/.test(next) && chunk.length < 4;
    if ((chunk.length >= 3 && !weak && !nextEnds) || chunk.length >= 5 || endSent || soft || i === toks.length - 1) {
      let text = chunk.join(' ');
      const opens = (text.match(/\*/g) || []).length; if (opens % 2) text = text.replace(/\*/g, '');
      tl.captions.push({ start: cStart, end: t, text }); chunk = []; cStart = t;
    }
  });
  t += TAIL; tl.scenes.push({ start, end: t });
});
const DURATION = t;

// ── outputs for the voice + captions workflow ──
const srtTime = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
fs.writeFileSync(path.join(OUT, EP.id + '.srt'), tl.captions.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text.replace(/\*/g, '')}\n`).join('\n'));
fs.writeFileSync(path.join(OUT, EP.id + '-narration.txt'), EP.scenes.map(s => s.say.replace(/\{[^|}]+\|([^}]+)\}/g, '$1').replace(/\*/g, '')).join('\n\n') + '\n');

// ── motion / lip-sync clips → cached frame sequences ──
const { execFileSync } = require('child_process');
if (EP.media && EP.media.labClip) {
  const clip = path.resolve(path.dirname(epPath), EP.media.labClip), name = path.basename(clip).replace(/\W+/g, '_');
  const dir = path.join(__dirname, '_cache', name);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); execFileSync(FFMPEG, ['-v', 'error', '-i', clip, '-vf', `fps=${FPS}`, '-q:v', '3', path.join(dir, '%05d.jpg')]); }
  EP.media.labFrames = { dir: '_cache/' + name, count: fs.readdirSync(dir).length, fps: FPS };
}
if (EP.media && EP.media.lab) EP.media.lab = path.relative(__dirname, path.resolve(path.dirname(epPath), EP.media.lab));
EP.scenes.forEach(sc => { if (sc.dest && /\.(jpe?g|png|webp)$/i.test(sc.dest)) sc.dest = path.relative(__dirname, path.resolve(path.dirname(epPath), sc.dest)); });

// ── sound design: synthesized SFX track, timed to the same math the frames use ──
const PLACES = ['Helix Institute', 'Earth Orbit', 'Inside a Cell', 'Quantum Realm', 'Black Hole', 'Fusion Core', 'The Human Brain', 'Mars Greenhouse', 'Global Markets'];
const easeIO = x => x < 0 ? 0 : x > 1 ? 1 : x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const wheelPos = (p, from, to) => { const q = Math.max(0, Math.min(1, (p - .12) / .55)), base = from + (to - from) * easeIO(q); return base + (q >= 1 ? Math.sin((p - .67) * 30) * Math.exp(-(p - .67) * 18) * .18 : 0); };
const SR = 44100, sfx = new Float32Array(Math.ceil((DURATION + 1) * SR));
const add = (t0, len, fn) => { const s0 = Math.floor(t0 * SR); for (let i = 0; i < len * SR && s0 + i < sfx.length; i++) sfx[s0 + i] += fn(i / SR); };
let seed = 3; const noise = () => (seed = (seed * 16807) % 2147483647) / 1073741823.5 - 1;
EP.scenes.forEach((sc, si) => {
  const st = tl.scenes[si], dur = st.end - st.start;
  if (sc.mode === 'lumen') {
    add(st.start, dur, x => (Math.sin(2 * Math.PI * 82 * x) + .5 * Math.sin(2 * Math.PI * 164 * x)) * .045 * (1 + .3 * Math.sin(x * 6)) * Math.min(1, x * 3, (dur - x) * 3));
    const to = PLACES.indexOf(sc.target), from = sc.from != null ? sc.from : (to + 5) % PLACES.length;
    let last = null;
    for (let f = 0; f <= dur * FPS; f++) { const p = f / FPS / dur, r = Math.round(wheelPos(p, from + PLACES.length * 2, to + PLACES.length * 3));
      if (last !== null && r !== last) add(st.start + f / FPS, .05, x => Math.sin(2 * Math.PI * 2300 * x) * Math.exp(-x * 120) * .22); last = r; }
    add(st.start + dur * .7, 1.2, x => (Math.sin(2 * Math.PI * 880 * x) + Math.sin(2 * Math.PI * 1320 * x) * (x > .09 ? 1 : 0)) * Math.exp(-x * 4) * .16);
    let lp = 0; add(st.end - .95, 1.1, x => { const k = Math.min(1, x / .95), a = .02 + k * k * .5; lp += a * (noise() - lp); return lp * Math.pow(k, 1.5) * (x > .95 ? Math.exp(-(x - .95) * 30) : 1) * 0.9; });
  }
  if (sc.travel) { let lp2 = 0; add(st.start, 1, x => { lp2 += .08 * (noise() - lp2); return (Math.sin(2 * Math.PI * (120 - 60 * x) * x) * .25 + lp2 * 1.2) * Math.exp(-x * 3.2); }); }
});
for (let i = 0; i < sfx.length; i++) sfx[i] = Math.tanh(sfx[i] * 1.2) * .7;
const sfxPath = path.join(OUT, EP.id + '-sfx.wav');
{ const buf = Buffer.alloc(44 + sfx.length * 2); buf.write('RIFF', 0); buf.writeUInt32LE(36 + sfx.length * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(sfx.length * 2, 40);
  for (let i = 0; i < sfx.length; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sfx[i] * 32767))), 44 + i * 2); fs.writeFileSync(sfxPath, buf); }

// ── build the frame page ──
let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
  .replace('__EPISODE__', JSON.stringify(EP)).replace('__TIMELINE__', JSON.stringify(tl))
  .replace('PORTRAIT', '../assets/zenith-portrait.jpg').replace('HANDLE', EP.handle || '@prof.zenith');
const framePage = path.join(__dirname, '_frame.html'); fs.writeFileSync(framePage, html);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + framePage); await page.evaluate(() => document.fonts.ready);
  if (PREVIEW) {
    const marks = tl.scenes.map(s => s.start + (s.end - s.start) * 0.7);
    for (let i = 0; i < marks.length; i++) { await page.evaluate(x => setT(x), marks[i]); await page.screenshot({ path: path.join(OUT, `${EP.id}-preview-${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 }); }
    console.log(`preview: ${marks.length} stills, est. duration ${DURATION.toFixed(1)}s`); await browser.close(); return;
  }
  const outFile = path.join(OUT, EP.id + '.mp4');
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
  ffArgs.push('-i', sfxPath);
  if (AUDIO) ffArgs.push('-i', AUDIO, '-filter_complex', '[1:a]volume=0.7[s];[2:a][s]amix=inputs=2:duration=longest:normalize=0[a]', '-map', '0:v', '-map', '[a]');
  else ffArgs.push('-map', '0:v', '-map', '1:a');
  ffArgs.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', outFile);
  const ff = spawn(FFMPEG, ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.ceil(DURATION * FPS);
  for (let f = 0; f < N; f++) {
    await page.evaluate(x => setT(x), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (FPS * 5) === 0) process.stdout.write(`\r${Math.round(100 * f / N)}% `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  console.log(`\nwrote ${outFile} (${DURATION.toFixed(1)}s, ${N} frames)`);
})();
