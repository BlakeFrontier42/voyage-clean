# Zenith Prompt Kit — copy, paste, generate

**How image/video tools work:** they only understand *what things look like*. Paste lore and they ignore it, or worse, write words into the image. So every prompt is built from **visual blocks**:

> **[Identity] + [Style] + [Location] + what happens in this shot + [Negative]**, with both reference images attached.

---

## Block 1 — Identity (any shot with Zenith)
```
Professor Kael Zenith, an ancient and wise post-human scholar from humanity's far future. Deep royal-violet skin with realistic texture, subtle pores and natural subsurface glow; faint luminous cyan constellation-like veins trace his temples, cheekbones and neck. Appears about 70 but timeless: high cheekbones, elegant age lines around the eyes, strong jaw, clean-shaven, a calm knowing half-smile with a hint of sarcasm. Molten-gold irises with a tiny four-point star in each pupil. Long silver-white hair swept back and tied low. Layered long scholar's robe-coat in deep navy and charcoal with a high structured collar and fine gold double-helix embroidery down the front. A thin ring of cyan light orbits behind his head like a scientific instrument.
```

## Block 2 — Style (every image and every video)
```
Cinematic short film, stylized photoreal 3D, anamorphic lens, shallow depth of field, soft volumetric light, film grain, vertical 9:16.
```
For video tools, add: `smooth continuous camera motion, no cuts.`

## Block 3 — Locations (pick the one for the shot)
**The Helix Institute (his lab):**
```
Inside the Helix Institute, a breathtaking futuristic research sanctuary: a tall curved glass wall looking out on a starfield with a violet nebula and two moons, warm wood floors, living green walls and hanging gardens, a thin indoor waterfall feeding a reflecting pool, a circular central platform with a soft cyan glow, floating blank holographic panels.
```
**The Concordance look (any Concordance technology or place):**
```
Concordance technology: elegant living materials, glass and warm wood, gold double-helix motifs, soft violet and cyan light, effortless floating forms, nothing militaristic, no uniforms, no insignia.
```
**The Lumen (his multi-tool):**
```
The Lumen: a slim, pen-sized instrument of brushed gold and dark titanium, about 18 cm long, with three thin rings orbiting its tip, projecting a small swirling holographic galaxy of violet and cyan light.
```
**The Helix Gate (travel):**
```
A single vertical line of violet light in mid-air unfolds into a tall rectangular doorway of light with crackling cyan edges; through it, a shimmering view of [DESTINATION].
```

## Block 4 — Negative (paste where the tool has a negative-prompt box; otherwise add "without any text")
```
text, letters, words, equations, numbers, labels, logos, watermark, beard, grey alien, cartoon, anime, extra fingers, deformed hands, Star Wars, Star Trek, Jedi, lightsaber
```

---

## Example: shot S1 of the pilot
Attach `zenith-portrait.jpg` + `zenith-fullbody.jpg`, then paste:
```
[Block 1 Identity]
[Block 2 Style]
[Block 3 Helix Institute]
He stands at the tall glass wall holding a delicate glass teacup, half-turned toward camera with a skeptical smirk, the violet nebula glowing behind him. Medium shot.
Without any text.
```
Video tool (with that image as the start frame):
```
Slow dolly-in from medium to medium-close; he lowers the teacup and turns fully to camera. [Block 2 Style] smooth continuous camera motion, no cuts.
```

---

## Set it up once: a Gemini Gem or a ChatGPT Project
Saves you from pasting the blocks every time. Create one, paste this as its instructions, and upload both reference images (plus Plate A once you have it) as its files:
```
You are the art director for "Professor Zenith," a cinematic science series.
For every image I request:
1. Always use the attached reference images to keep Professor Zenith's face, skin, eyes, hair, and robe identical.
2. Always include these visual rules: [paste Block 1], [paste Block 2].
3. When I say "the lab," use: [paste the Helix Institute block].
4. When I say "the Lumen" or "the gate," use those blocks: [paste them].
5. Never put readable text, letters, numbers, equations, logos, or watermarks in any image.
6. Vertical 9:16 unless I say otherwise.
Then I'll just describe the shot, e.g. "S1: at the glass wall with a teacup, skeptical smirk, medium shot."
```
Even with a Gem, paste Block 1 again if his face starts drifting. Explicit text in the prompt always wins.

## What the World Bible is for
`WORLD-BIBLE.md` (the Concordance, its values, the secret reveal) is for **writing**: Claude uses it for scripts, and you can give it to ChatGPT if you brainstorm there. Never paste it into image or video tools, and keep the reveal out of any shared tool setup.
