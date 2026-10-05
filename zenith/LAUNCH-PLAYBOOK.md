# Zenith Launch Playbook — from nothing to posted
You have: **ChatGPT** and **Claude**. Everything else below starts free. Plans and limits change often, so check each tool's current pricing page before paying.

## Money plan
| When | Spend | Why |
|---|---|---|
| Week 1 | **$0** | Accounts, images, and test clips on free tiers |
| Before the first public post | **~$5/mo, ElevenLabs Starter** | Free voice plans don't include commercial rights. You need them once you monetize. |
| When free video credits run out | **~$10/mo**, one video tool (Kling, or whatever your ChatGPT plan includes) | More shots per week |
| Once the channel earns | Upgrade voice, add lip-sync volume | Speed and polish |

---

## PHASE 1 — Claim the brand (Day 1, about 1 hour, $0)
1. **Pick the handle.** First choice `@prof.zenith`; backups `@professorzenith`, `@zenith.teaches`. Check that the same handle is free on Instagram, TikTok, and YouTube before creating any of them.
2. **Create a dedicated Google account** for the channel (keeps it separate from your personal email).
3. **Create the accounts** with that email:
   - **YouTube:** create a channel (Brand Account) named *Professor Zenith*.
   - **Instagram:** new account, then Settings → switch to a **Professional (Creator)** account. That unlocks scheduling and analytics.
   - **TikTok:** new account, then switch to a **Business** or **Creator** account in settings.
4. **Profile picture:** crop `assets/zenith-portrait.jpg` to his face (same image everywhere).
5. **Bio (same everywhere):**
   > Professor Kael Zenith, Concordance. Real science, taught by someone from your future. New lessons weekly. Class is in session. 🌌
6. **Link in bio:** The Frontier Path. Your dashboard link is private right now, so either open its Share menu to "anyone with the link," or I can publish a public version.

## PHASE 2 — Lock the voice (Day 1–2, $0 to test)
1. Sign up at **ElevenLabs** (free).
2. Open **Voice Design** and paste the voice spec from `CHARACTER-BIBLE.md`.
3. Generate candidates with: *"Tea. A habit we never managed to quit. Today: one experiment."*
4. Save the best as **"Professor Zenith."** Write down its settings and never change them.
5. Download the test line and send it to me to check.
6. **Before the first public post:** upgrade to **Starter (~$5)** for commercial rights.

## PHASE 3 — Build the world (Day 2–3, $0)
Use **Gemini (Nano Banana)** first; use **ChatGPT image generation** as backup or for variations.
1. Create a folder: `Zenith/Refs` with `zenith-portrait.jpg` and `zenith-fullbody.jpg`.
2. For every image: attach both references, then paste the **Identity Block** (`RENDER-BRIEF.md`) + the **style block** (`FILM-BIBLE.md`) + the description.
3. Generate the **location library** from `RENDER-BRIEF-v0.3.md`: Lab Plates A–C, the Lumen close-up, the Helix Gate. Save the winners to `Zenith/Refs/locations/`.
4. **Check every image:** same face (violet skin, gold star eyes, silver hair, helix embroidery) and **no fake text**. Regenerate anything with garbled writing.

## PHASE 4 — Shoot the pilot (Days 3–10, mostly free credits)
Work from `episodes/ep003-double-slit-film.md`. Make one folder per episode:
```
Zenith/ep003/  frames/  clips/  voice/  synced/
```
1. **Voice first:** in ElevenLabs, generate each 🎙 line and narration line separately. Save as `voice/S01.mp3`, `voice/S03.mp3`, and so on. Line lengths set shot lengths.
2. **Key frames:** for each shot, generate the still (references + Identity Block + style block + the shot's key-frame text). Save as `frames/S01.png`. Reuse each location's best frame as the starting image for other shots there.
3. **Animate:** pick **one** video tool and stick with it:
   - **Kling** (free daily credits on signup): Image to Video, upload the frame, paste the shot's motion prompt + "smooth continuous camera motion, no cuts, no text."
   - **Your ChatGPT plan:** if it includes video generation (Sora), use the same frame and prompt.
   - Keep each clip 5–8 s; save as `clips/S01.mp4`. Mute any audio the tool generates.
4. **Lip-sync the 🎙 shots only:** Kling's **Lip Sync** (upload the clip + the matching MP3). Save as `synced/S01.mp4`.
5. **Start small:** do S1–S3 + T1 first (about 22 s) and send them to me before shooting the rest. That catches problems early.
6. **Daily limits:** free credits run out fast. Spread the pilot across a week, or buy one month of the video tool (~$10) to finish it in a weekend.

## PHASE 5 — Finish the film (about 2–3 hours, $0)
**Editor:** **CapCut** desktop (free) or **DaVinci Resolve** (free, more powerful). Project: 1080×1920, 30 fps.
1. **Lay the picture:** drop clips in shot order (S1, S2, S3, T1…), using the `synced/` version for talking shots.
2. **Lay the voice:** put each MP3 under its shot; trim clips to fit the lines.
3. **My overlay pack:** for each episode I render the extras (faint Lumen HUD, simulations like the double-slit monitor, floating labels) on a **pure green background**, plus a **sound-effects pack** (gate whoosh, ticks, chime, arrival swell). Place each overlay above its shot and apply **Chroma Key** (pick the green). Set the HUD to about 20–30% opacity.
4. **Captions:** CapCut's **Auto captions**, then fix any wrong words. Style: bold sans-serif, white, keywords in gold, kept in the middle third (above the app buttons).
5. **Source lines:** add each scene's source as small text near the bottom where the shot list says so.
6. **Mix:** voice around -14 to -12 LUFS loudness (CapCut's "normalize loudness" works), SFX under it, music (optional) very low. Use music only from libraries that allow use on all three platforms.
7. **Export:** 1080×1920, 30 fps, H.264, high bitrate. Name it `ep003-master.mp4`.
8. **Cut-downs:** duplicate the project 3 times and keep one act each (40–60 s), each ending with a caption like "Full lesson on my profile."
9. **Alternative:** if you'd rather I assemble everything, upload the episode folder to Google Drive. I can try pulling it into my session and sending back the finished master.

## PHASE 6 — Quality check (15 min)
- [ ] Every on-screen number matches the shot list's sources
- [ ] No garbled text anywhere in the footage
- [ ] Zenith looks the same in every shot; lips match the words
- [ ] Voice level is steady; nothing clips
- [ ] The sign-off is word for word
- [ ] Captions sit above the bottom app buttons

## PHASE 7 — Post (30 min)
1. **AI disclosure (required):** all three platforms ask you to label realistic AI-generated content. Turn on YouTube's "altered or synthetic content" setting, TikTok's "AI-generated content" label, and Instagram's AI label when uploading. Also say it in the bio or caption ("AI-animated character; real science").
2. **Title / first caption line (the hook):** *"The universe hates being watched (and it's not a joke)."*
3. **Caption template:**
   ```
   [hook]
   One experiment holds the heart of quantum mechanics. Professor Zenith takes you from a slow-motion particle range to Feynman-level depth.
   Learn it free: MIT 8.04 · The Feynman Lectures, Vol. III
   Full path: The Frontier Path (link in bio)
   AI-animated character. Real science, real sources.
   #physics #quantum #science #learnontiktok #stem
   ```
4. **Upload the full 3-minute episode** to YouTube (Shorts accepts up to 3 minutes; it can also go up as a regular video), Instagram (Reel), and TikTok.
5. **Thumbnail / cover:** pick the most dramatic frame (the gate opening, the stripes on the CRT).
6. **Pinned comment:** the free course links, the sources, and the episode's pop-quiz question ("Answer in the replies").
7. **Schedule the cut-downs:**
   - YouTube Studio → Schedule
   - Instagram → Meta Business Suite (free) → Planner
   - TikTok → web upload → Schedule
8. **First hour after posting:** reply to every comment. Early engagement helps distribution.

## PHASE 8 — The weekly rhythm (once the pilot is out)
| Day | Task | Who |
|---|---|---|
| Sun | Approve the next 2 shot lists | You (I write them ahead) |
| Mon | Voice for both episodes | You |
| Tue–Wed | Key frames + animation | You |
| Thu | Lip-sync + edit in CapCut with my overlay pack | You |
| Fri | QC, schedule 2 films + 6–8 cut-downs for the next week | You |
| Daily | Reply to comments for 10 minutes | You |
Roughly 8–10 hours a week once the reference pack is built.

## PHASE 9 — Growth and money (what to watch)
- **Track weekly:** views per post, average watch time, follows per post, comments. Double down on the sectors that hold attention.
- **Programs to aim for** (check each platform's current rules): YouTube Partner Program (subscriber and watch-time or Shorts-view thresholds), TikTok's Creator Rewards (rewards videos over one minute, which fits 3-minute episodes), and Instagram's creator programs.
- **Earlier money:** Patreon or YouTube memberships for full-length lectures, affiliate links for real science kits (a laser double-slit kit for the home-experiment episode), and later, sponsorships from education companies.
- **Reinvest in order:** voice minutes → video credits → lip-sync on every talking shot → longer YouTube lectures.

## Your first 7 days, as a checklist
- [ ] Day 1: handles claimed on all three platforms; Google account; bios and picture set
- [ ] Day 1–2: ElevenLabs voice designed and saved; test line sent to me
- [ ] Day 2–3: lab plates, Lumen close-up, and Helix Gate frames generated
- [ ] Day 3–5: ep003 S1–S3 + T1 voiced, framed, animated, lip-synced, sent to me
- [ ] Day 5–7: I send the overlay pack and SFX; rest of the pilot shoots
