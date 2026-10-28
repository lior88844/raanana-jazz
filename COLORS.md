# Raanana World Jazz Music Festival – colours

This is the single source of truth for the festival's colours: the website, social posts, billboards and print.
If a colour changes, change it here first, then in the website stylesheet (the `:root` block at the top of
`assets/site.css` inside the site folder) and in the design files.

Last updated: 28 October 2026.

---

## The palette

Eight colours. Seven come from the 2026 palette (the same set as the W2 billboard); the yellow is the festival
yellow we have used since the start and kept on purpose.

| Swatch | Name (EN) | שם | HEX | RGB | What it is for |
|---|---|---|---|---|---|
| 🟧 | **Terracotta** | טרקוטה | `#DB5230` | 219, 82, 48 | The festival colour. Big fields of colour: the home hero, page headers, coloured bands. |
| 🟨 | **Yellow** | צהוב | `#F7CE46` | 247, 206, 70 | The accent. Main buttons, the dates on the hero, countdown numbers, highlights on dark. |
| 🩷 | **Pink** | ורוד | `#F5B2BA` | 245, 178, 186 | Soft panels and tags: the announcement strip, "free entry" and "for families" tags, the dates panel on the billboard. |
| 🟦 | **Blue** | תכלת | `#52C8E3` | 82, 200, 227 | Secondary accent: brush swashes, family tags, Saturday's colour in the line-up. |
| 🟪 | **Mauve** | מוב | `#9F8688` | 159, 134, 136 | Background shapes and blobs (billboard), Thursday's colour in the line-up. |
| 🟫 | **Maroon** | בורדו | `#622617` | 98, 38, 23 | Deep field for small text (the website footer), small red text on white, alternative skin tone in the illustrations. |
| ⬛ | **Brown** | חום כהה | `#3A1A14` | 58, 26, 20 | The "black" of the festival. All text, dark strips (top bar, countdown), the פסטיבל / רעננה lettering, JAZZ. on light grounds. |
| ⬜ | **White** | לבן | `#FFFFFF` | 255, 255, 255 | The ground. Page background (with the paper texture), the logo on terracotta. |

**There is no pure black and no grey in the brand.** Where you would reach for black, use Brown `#3A1A14`.
Where you would reach for grey, use Mauve `#9F8688` or a transparent Brown.

---

## Where each colour goes

### Website

| Element | Colour |
|---|---|
| Page background | White, with the paper texture (`images/paper.png`, multiplied in) |
| Body text, headings | Brown |
| Home hero, page headers, coloured bands | Terracotta, text in White (bold) |
| Hero dates "10–12" | Yellow (DEC 2026 in White) |
| פסטיבל / רעננה lettering, dark logo | Brown |
| WORLD. JAZZ. MUSIC. logo on terracotta | White |
| Main buttons | Yellow, text in Brown |
| Secondary buttons / text links | Underline in Terracotta (on light) or Yellow (on terracotta) |
| Top bar, countdown strip, partners section | Brown, text in White, highlights in Yellow |
| Countdown numbers | Yellow |
| Announcement strip at the top | Pink, text in Brown |
| "Free entry" / "For families" tags | Pink / Blue, text in Brown |
| Footer | Maroon, text in White, headings in Yellow |
| Small red text on white (labels, notes) | Maroon |
| Line-up day colours | Thursday Mauve · Friday Pink · Saturday Blue (all with Brown text) |

### Posters, billboards, social posts

- **Default ground:** Terracotta, or White with Mauve and Pink shapes (the W2 billboard look).
- **Logo:** WORLD. and MUSIC. in Terracotta and JAZZ. in Brown on a white ground, or the whole logo White on Terracotta.
- **Dates and details:** on a Pink panel, in Brown, with the year in Terracotta and a Blue brush swash.
- **Illustrations:** clothes and shapes in Blue, Pink, White and Brown; skin and brass in a warm orange
  (`#F25F28` on the W2 billboard, slightly brighter than Terracotta), or Maroon as the alternative skin tone.

---

## Readability: which colours work together

Contrast ratio of text colour (columns) on background colour (rows). Calculated with the WCAG formula.

| on ↓ / text → | Terracotta | Yellow | Pink | Blue | Mauve | Maroon | Brown | White |
|---|---|---|---|---|---|---|---|---|
| **Terracotta** | — | 2.6 | 2.3 | 2.0 | 1.2 | 2.9 | 3.9 | 4.0 |
| **Yellow** | 2.6 | — | 1.2 | 1.3 | 2.2 | 7.7 | 10.4 | 1.5 |
| **Pink** | 2.3 | 1.2 | — | 1.1 | 1.9 | 6.6 | 8.9 | 1.8 |
| **Blue** | 2.0 | 1.3 | 1.1 | — | 1.7 | 5.9 | 8.0 | 2.0 |
| **Mauve** | 1.2 | 2.2 | 1.9 | 1.7 | — | 3.4 | 4.7 | 3.4 |
| **Maroon** | 2.9 | 7.7 | 6.6 | 5.9 | 3.4 | — | 1.4 | 11.6 |
| **Brown** | 3.9 | 10.4 | 8.9 | 8.0 | 4.7 | 1.4 | — | 15.7 |
| **White** | 4.0 | 1.5 | 1.8 | 2.0 | 3.4 | 11.6 | 15.7 | — |

**How to read it:** normal text needs **4.5** or more. Large text (24px and up, or 19px and up in bold) and
icons need **3** or more. Below 3 is decoration only.

### Safe pairs for any text size (4.5+)
- Brown on White, Yellow, Pink, Blue or Mauve
- White on Brown or Maroon
- Maroon on White, Yellow, Pink or Blue

### Large or bold text only (3 – 4.5)
- **White on Terracotta (4.0)** – the festival's main pairing. On the website every piece of text that sits on
  terracotta is bold or large for this reason. Small print never goes on terracotta: that is why the footer is Maroon.
- Brown on Terracotta (3.9)
- White or Maroon on Mauve (3.4)

### Decorative only (below 3)
- **Yellow on Terracotta (2.6)** – used for the big hero dates because they are huge display type and the pairing is
  part of the festival's identity. Never use it for anything smaller than a headline.
- Pink, Blue or Mauve on Terracotta; White on Yellow, Pink or Blue; any light colour on another light colour.

---

## Rules

1. **Brown, not black.** Every "black" is `#3A1A14`.
2. **One accent per area.** Yellow is the action colour; don't put a yellow button next to a pink one.
3. **Terracotta is for fields, not for small text.** Small red text on white is Maroon.
4. **Light on light is decoration.** Pink, Blue, Yellow and Mauve never carry text against each other or against White.
5. **Keep the paper texture.** Flat white or flat terracotta looks digital; the site multiplies `paper.png` into every
   coloured surface, and print files use a gouache/paper texture layer.
6. **Print:** these are screen (RGB) values. Ask the printer for a proof before a billboard run; Terracotta, Pink and
   Blue can shift in CMYK.

---

## History

- **2025:** navy `#202C45` and the Toronto-style site, then the Instagram palette: terracotta `#C9473A`,
  yellow `#F7CE46`, sky `#75BBCD`, charcoal `#1C1B1D`, cream `#FBF6EE`.
- **28 October 2026:** the 2026 palette above (terracotta `#DB5230`, maroon, pink, blue `#52C8E3`, mauve, brown,
  white), with the yellow `#F7CE46` kept as the accent.
