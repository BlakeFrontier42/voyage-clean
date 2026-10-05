# Zenith Production Guide — short-film quality on a small budget

## The honest math first
A 3-minute film is about 30–35 shots. That's real production, not a daily slideshow. The sustainable rhythm on about $50/month:
- **2 full films a week** (the 3-minute episode on YouTube, Instagram Reels, and TikTok; all three accept 3-minute videos).
- **Daily posting from those films:** each film is cut into 3–4 vertical clips (one act each, 40–60 s) that run on the days between films. Every day gets a post, and each clip points to the full episode.
- Scale to more films per week once the channel earns.

## The toolkit (check current prices and plan limits before paying)
| Job | Tool | Plan | Approx. cost |
|---|---|---|---|
| Key frames (stills) | Gemini (Nano Banana) | what you have | $0 to ~$20 |
| Animation (image-to-video) | **Veo** via a Google AI plan, or **Kling** | the plan that includes video generation | ~$10–20 |
| Zenith's voice | **ElevenLabs** | Starter (about 10 three-minute episodes of narration a month), Creator if needed | ~$5–22 |
| Lip-sync (talking shots only) | **Kling Lip Sync**, Hedra, or sync.so | free tier or entry plan | $0 to ~$10 |
| HUD, simulations, captions, SFX, final cut | the Zenith engine (this repo) | — | $0 |
| Music (optional) | YouTube Audio Library or Pixabay Music | free; check each track's license per platform | $0 |
| Scheduling | YouTube Studio, Meta Business Suite, TikTok scheduler | free | $0 |
**Target total:** about $35–50/month. Pick *one* animation tool to start; don't pay for both Veo and Kling.

---

## One-time setup (about one weekend)

### Step 1 — Lock Zenith's voice (ElevenLabs)
1. Open **Voice Design** and paste the voice spec from `CHARACTER-BIBLE.md`.
2. Generate 3–4 candidates with this test line: *"You early humans found an experiment so strange that Feynman said it holds the heart of quantum mechanics."*
3. Save the best one as **"Professor Zenith."** Note its settings (stability about 40–50%, similarity about 75%, a little style exaggeration). Never change them after this.
4. Send me the test line, and I'll check it against the character.

### Step 2 — Build the reference pack (Gemini / Nano Banana)
1. Make a folder **`Zenith Refs`** containing `zenith-portrait.jpg` and `zenith-fullbody.jpg`.
2. For every image you generate, attach both reference images and start the prompt with the **Identity Block** (`RENDER-BRIEF.md`) plus the **style block** (`FILM-BIBLE.md`).
3. Generate the **location library** once from `RENDER-BRIEF-v0.3.md`: the lab (Plates A–C), the Lumen close-up, and the Helix Gate. Save the winners in `Zenith Refs/locations/`.
4. Rule: no readable text in any image. If a generation has fake writing, regenerate it or ask Nano Banana to "remove all text."

### Step 3 — Set up the footage folders
On your computer (and later in the repo), keep one folder per episode:
```
zenith/footage/ep003/
  frames/   S01.png  S02.png  T1.png …
  clips/    S01.mp4  S02.mp4  T1.mp4 …
  voice/    S01.mp3  S03.mp3 …      (one file per line)
  synced/   S01.mp4  S03.mp4 …      (lip-synced talking shots)
```
Consistent names let the engine assemble everything automatically.

---

## Per episode (the assembly line, about 6–10 hours of your time)

### Step 4 — Script approval (Claude → you, 15 min)
I write the shot list (like `episodes/ep003-double-slit-film.md`): every shot has a key-frame prompt, a motion prompt, the line, and overlays, with all facts sourced. You approve or request changes.

### Step 5 — Voice first (ElevenLabs, 30 min)
1. Generate each line separately in the Professor Zenith voice and download as `S01.mp3`, `S03.mp3`, and so on.
2. Listen once; regenerate any line with odd emphasis.
3. Why first: each line's length sets how long its shot needs to be.

### Step 6 — Key frames (Nano Banana, 2–3 hours)
1. For each shot: attach the two reference images, paste Identity Block + style block + the shot's **key-frame** description.
2. Generate 2–4 options and keep the best as `frames/S01.png`.
3. Check every frame for **face consistency** (violet skin, gold star eyes, silver hair, helix embroidery) and **no text**.
4. Reuse a location's best frame as the starting image for other shots in that location; it keeps the world consistent.

### Step 7 — Animate (Veo or Kling, 2–4 hours, spread over a few days if your plan has daily limits)
1. Upload `frames/S01.png` as the start image.
2. Prompt = the shot's **motion** description + the style block + "smooth continuous camera motion, no cuts, no text."
3. Length: match the line (most shots are 5–8 s).
4. For talking shots, add "speaking naturally, mouth moving" so the lip-sync tool has something to work with. Mute or discard any audio the tool generates; Zenith's voice comes only from ElevenLabs.
5. Save as `clips/S01.mp4`. Do 2 versions of hero shots (the gate, the transitions) and keep the best.

### Step 8 — Lip-sync (talking shots only, 1 hour)
1. In the lip-sync tool, upload `clips/S01.mp4` + `voice/S01.mp3`.
2. Download as `synced/S01.mp4`.
3. Only the 🎙 shots need this, which keeps costs low.

### Step 9 — Finish (the engine, run by me)
Send me the episode folder. The engine:
- lays the clips in order with the voice,
- adds the faint Lumen HUD, composited simulations (like the double-slit screen), and floating 3D labels,
- adds captions, sound design, and source lines,
- exports the **3-minute master** plus **3–4 vertical cut-downs**.

### Step 10 — Quality check (you, 15 min)
- [ ] Every number on screen matches the script's sources
- [ ] No garbled text anywhere in the footage
- [ ] Zenith looks the same in every shot
- [ ] Lips match the words; voice level is steady
- [ ] The sign-off is word for word

### Step 11 — Publish
1. **Full episode:** YouTube (as a Short under 3 minutes, or a regular video), Instagram Reel, TikTok.
2. **Cut-downs:** schedule one per day between films.
3. **Caption template:** hook line → "Learn it free: [course]" → "Full path: The Frontier Path" → 3–5 relevant hashtags.
4. **Pinned comment:** the free course links and that episode's pop-quiz answer.

---

## The first two weeks
| Day | Do |
|---|---|
| 1–2 | Step 1 (voice) and Step 2 (reference pack + lab locations) |
| 3–5 | Ep003 pilot: Steps 5–8 for shots S1–S3 + T1 first, send them to me, and I'll build the film-mode finishing engine around real footage |
| 6–10 | Finish the remaining ep003 shots |
| 11–14 | Publish ep003 + cut-downs; start the next episode (008, the black hole photo), whose shot list I'll have ready |
