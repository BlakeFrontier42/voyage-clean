# Zenith render engine

Turns an episode script (`../scripts/*.json`) into a finished 1080×1920 video with Professor Kael Zenith, chapter titles, animated diagrams, timed captions, and a source line.

```bash
npm i -g playwright            # Chromium is used to draw every frame
pip install imageio-ffmpeg     # or any ffmpeg on PATH
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())") \
  node render.js ../scripts/ep001-linear-algebra.json            # full video → ../out/ep001.mp4
node render.js ../scripts/ep001-linear-algebra.json --preview    # one still per scene
node render.js ../scripts/ep001-linear-algebra.json --audio voice.mp3   # with the real voiceover
```

Each render also writes `<id>-narration.txt` (paste into the voice tool) and `<id>.srt`.

## Script format
- `say`: narration. `*word*` highlights a caption keyword. `{written|spoken}` shows one thing on screen and says another (`{MIT 18.06|MIT eighteen oh six}`).
- `visual.type`: `nn`, `statement`, `vector`, `matmul`, `nudge`, `cards`, `scale`, `cta`, `signoff`.
- `source`: the honesty line under the captions.

Timing is estimated from the words until real voice audio exists; then captions should be re-timed from the voice tool's word timestamps.
