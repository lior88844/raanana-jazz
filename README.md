# Raanana Jazz Festival

Website for פסטיבל הג׳אז רעננה – served at https://raananajazzfestival.com via GitHub Pages.

## Pages
| Page | File |
|---|---|
| Home | `index.html` |
| Line-up (all shows + ticket links) | `lineup.html` |
| Past editions – 2025 artists | `festival-2025.html` |
| Venue – the four stages + map | `venue.html` |
| About | `about.html` |
| Workshops | `workshops.html` |
| Media / press downloads | `media.html` |
| Tickets & passes | `tickets.html` |
| Contact | `contact.html` |

## Editing
- **Content** (shows, times, ticket links, teachers, photos, partners, contact email): `assets/data.js`. Every page reads from it.
- **Menu, header, footer**: `assets/site.js`.
- **Design**: `assets/site.css`.
- **Page text/layout**: `build_pages.py` holds each page's markup; run `python3 build_pages.py` to regenerate the HTML files.
- Images live in `images/`.
