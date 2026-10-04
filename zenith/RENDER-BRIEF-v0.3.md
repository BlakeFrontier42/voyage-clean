# Render Brief v0.3 — The Helix Institute, the Lumen, and the Motion Library

Character is locked from v0.2 (`assets/zenith-portrait.jpg`, `assets/zenith-fullbody.jpg`). Keep pasting the **Identity Block** from `RENDER-BRIEF.md` into every prompt that shows him.

**Rule for every image:** no readable text, equations, or labels in the art. Fake math destroys credibility, and the engine overlays real, sourced equations as holograms.
Add to every negative prompt: `text, letters, equations, numbers, labels, logos, watermark`.

---

## 1. The Lumen (signature multi-tool)
> The Lumen: a slim, pen-sized instrument of brushed gold and dark titanium, about 18 cm long, with three thin rings orbiting its tip. From the tip it projects a small swirling holographic galaxy of violet and cyan light. Elegant, ancient, clearly advanced technology. Product-shot close-up on a dark background, studio lighting, stylized-realistic 3D render, 4K.

**What it does in the story:** a pointer, a hologram projector, a portal (it takes the class to star systems, the quantum realm, inside a living cell), and, rarely, a shield of unimaginable power. It's never used as a weapon against people. Zenith protects; he doesn't conquer.

## 2. The Helix Institute lab (background plates)
The lab is Zenith's corner of the Helix Institute, the "ultimate oasis": glass, warm wood, living plants, water, and the cosmos outside.

**Plate A, wide (the main shot):**
> Interior of a breathtaking futuristic research sanctuary called the Helix Institute. A tall curved glass wall looks out on a starfield with a violet nebula and two moons. Warm wood floors, living green walls and hanging gardens, a thin indoor waterfall feeding a reflecting pool. A circular central platform with a soft cyan glow. Floating blank holographic panels (no text). Cinematic wide shot, eye level, symmetrical, stylized-realistic 3D render, volumetric light, 9:16 vertical composition, empty of people.

**Plate B, close (talking-head background):**
> Same Helix Institute interior, closer framing: soft-focus hanging gardens and the glass wall with the nebula behind, warm practical lights, shallow depth of field. 9:16 vertical, empty of people, no text.

**Plate C, workbench:**
> A long workbench of wood and glass in the Helix Institute with softly glowing blank holographic screens, a small potted plant, scientific instruments without labels, the waterfall softly blurred behind. 9:16 vertical, empty of people, no text.

## 3. Zenith in the lab (full body, for animation)
Generate these as stills first (Nano Banana), then animate each one (Section 4). Use Plate A as the setting so the clips drop straight into the lab.
- **Z1 Idle:** `[Identity Block] Standing full body on the central platform of the Helix Institute (as in Plate A), relaxed posture, the Lumen in his right hand at his side, calm half-smile, looking at camera. 9:16 vertical, static camera, no text.`
- **Z2 Explaining:** `… left hand raised mid-gesture as if explaining, the Lumen held loosely, engaged expression.`
- **Z3 Pointing:** `… pointing the Lumen up and to his left at a floating blank holographic panel, glancing toward it.`
- **Z4 Travel:** `… raising the Lumen overhead; a swirling portal of violet and cyan light opens above it, illuminating his face.`
- **Z5 Close-up talk:** `[Identity Block] Chest-up, centered, Plate B background, looking directly into the camera, mouth relaxed and closed, neutral friendly expression. 9:16 vertical.` (This is the frame the lip-sync tool animates.)

## 4. The motion library (animate once, reuse forever)
Animate each Z still with image-to-video (Veo in Gemini, Kling, or Runway). 6–8 seconds each, **static camera**, no cuts.
| Clip | Prompt for the video tool |
|---|---|
| Z1 idle loop | Subtle breathing, slight weight shift, blinks, halo ring slowly rotating, gentle light flicker. Static camera. |
| Z2 explain | Natural explaining hand gestures, slight head movements, speaking expression. Static camera. |
| Z3 point | Raises the Lumen toward the panel and holds the point, small nod. Static camera. |
| Z4 travel | Lifts the Lumen overhead, portal light swirls and grows, bright flash at the end. Static camera. |
| Z5 talk base | Looks at camera, subtle head motion and blinks, mouth mostly still (lip-sync is added per episode). Static camera. |

Download each as MP4 and send them to me; the engine converts and loops them.

## 5. Travel destinations (one image each, reused across episodes)
All 9:16 vertical, cinematic, stylized-realistic, no text:
1. **Earth orbit:** Earth's curved horizon from low orbit, thin blue atmosphere, a space station in the distance, sunlight on the clouds.
2. **Solar system:** the Sun and planets in a dramatic composition, orbits suggested by faint light trails.
3. **Black hole:** a glowing accretion disk bending light around a black hole, stars lensed around it.
4. **Quantum realm:** an abstract luminous field of probability clouds, glowing particles, and wave interference patterns in violet and cyan.
5. **Inside a cell:** inside a living cell with organelles, membranes, mitochondria, and protein strands, soft bioluminescent light.
6. **DNA close-up:** a vast glowing DNA double helix spiraling through a dark biological space.
7. **Inside the brain:** neurons firing with electric pulses along branching dendrites.
8. **Fusion core:** inside a tokamak-style chamber with a glowing magnetically confined plasma ring.
9. **Mars greenhouse:** a pressurized greenhouse dome on Mars with crops under grow lights and a red landscape outside.
10. **Market floor of the future:** an abstract data space of flowing price charts as light streams, without numbers or text.

---

## 6. Performance clips for the Lumen sequence (the episode's spine)
These match the engine's scene order: lab hook → Lumen out → travel → lesson → Lumen home → sign-off. Generate each as a still first (Identity Block + Plate A setting, character in the **left third** of a 9:16 frame so holograms fit on the right), then animate 6–8 s with a **static camera**.

| Clip | Engine scene | Action prompt for the video tool |
|---|---|---|
| P1 Walk & talk | lab hook | Walks slowly from left to center across the lab platform while talking, open-hand gestures, glances at the camera. |
| P2 Draw the Lumen | `lumen` (first 2 s) | Reaches inside his robe-coat and draws out the slim golden Lumen, holding it up at chest height and looking at it. |
| P3 Tune the Lumen | `lumen` (middle) | Rotates the Lumen's rings with thumb and fingers, eyes tracking a hologram floating above it, small focused frown. |
| P4 "Here we go" | `lumen` (end) | Smiles, raises the Lumen, and makes a pinch-out gesture with his free hand toward the camera as light floods the frame. |
| P5 Lesson gestures | `explain` close-up | Chest-up, explaining with both hands (counting on fingers, shaping a curve in the air), animated face. |
| P6 Return | lab arrival | Steps out of a fading swirl of violet light onto the lab platform, straightens his coat, slight smirk. |
| P7 Sign-off | `signoff` | Looks at the camera, points the Lumen like a teacher's pointer, small nod, turns to walk away. |

**Workflow:** the engine plays P2→P3→P4 in order across the `lumen` scene and draws the destination wheel over the hologram area. Lip-sync is applied to P1, P5, and P7 (the talking shots), which keeps lip-sync minutes low.
