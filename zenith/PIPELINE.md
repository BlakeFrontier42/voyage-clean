# Zenith production pipeline (target: 2 videos/day, under $50/month)

| Step | Tool | Who | When |
|---|---|---|---|
| 1. Script | Claude + the episode JSON format | Claude drafts, Blake approves | Weekly batch (14 scripts) |
| 2. Voice | ElevenLabs (designed voice, saved once) | Blake | Weekly batch: paste each `*-narration.txt`, export MP3 + word timestamps |
| 3. Lip-sync | One lip-sync tool on the Z5 close-up clip | Blake | Only the hook + sign-off lines (~15 s per episode) |
| 4. Render | `engine/render.js --audio voice.mp3` | Claude or Blake | Weekly batch |
| 5. Post | Instagram, TikTok, YouTube Shorts schedulers (free) | Blake | Schedule 14 posts per week |

## One-time assets (Render Brief v0.3)
- Lab plates A–C, Zenith stills Z1–Z5, motion clips Z1–Z5, the Lumen close-up, 10 destination plates.
- Generate with Nano Banana (images) and Veo / Kling / Runway (image-to-video). Pay once in effort; reuse forever.

## Budget guide (check current prices before subscribing)
- Voice: ~$5–22/month depending on minutes (2 × 1 min/day ≈ 60 min/month).
- Lip-sync: ~$10–25/month, kept low by syncing only close-up lines.
- Images/video: Gemini (already have) or a free tier.
Upgrade order once the channel earns: full-episode lip-sync → more motion clips → custom music.

## Accuracy gate (every episode)
Every on-screen number or claim needs a `source` line or a Campus course. No fake equations in any art. Speculation is labeled as such.
