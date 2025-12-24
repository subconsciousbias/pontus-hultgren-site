# Pontus Hultgren Website Documentation

## Overview
Christmas gift website for Pontus Hultgren (Swedish VGM orchestrator/composer)
- **Domain**: pontushultgren.com
- **Location**: `L:\03_Projects\PontusHultgren`
- **Stack**: Astro 5 + Tailwind CSS 4 + View Transitions API
- **Theme**: Dark + elegant orchestral (deep blues/purples, gold accents)

## Dev Commands
```bash
cd "L:\03_Projects\PontusHultgren"
npm run dev      # Start dev server at http://localhost:4321
npm run build    # Build static site to /dist
```

## Site Structure
```
pontushultgren.com/
├── /              # Home - Hero, featured YouTube videos, stats
├── /music         # Spotify embed, album grid, streaming links
├── /videos        # YouTube embeds, channel info, categories
├── /about         # Bio, influences, stats
└── /support       # Patreon CTA
```

## File Structure
```
L:\03_Projects\PontusHultgren\
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # Base layout (nav, footer, meta tags)
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── music.astro        # Music/discography
│   │   ├── videos.astro       # YouTube gallery
│   │   ├── about.astro        # Bio page
│   │   └── support.astro      # Patreon page
│   └── styles/
│       └── global.css         # Design system + custom CSS
├── public/
│   ├── profile.png            # Profile photo (circular)
│   ├── banner.jpeg            # OG/Twitter social banner
│   ├── youtube-banner.jpg     # YouTube banner image
│   ├── logo.jpg               # Logo
│   └── favicon.svg            # Favicon
└── dist/                      # Built static site
```

## Design System (global.css)

### Colors
```css
--color-bg-primary: #0a0a12      /* Near black with blue tint */
--color-bg-secondary: #12121f    /* Dark purple-blue */
--color-bg-tertiary: #1a1a2e     /* Lighter dark for gradients */
--color-accent-gold: #d4af37     /* Orchestral gold */
--color-accent-gold-light: #f0d77c
--color-accent-blue: #4a6fa5     /* Muted blue */
--color-text-primary: #f5f5f5    /* Off-white */
--color-text-secondary: #a0a0a0  /* Muted gray */
--color-text-muted: #6b6b6b      /* Very muted */
```

### Typography
- **Headings**: Playfair Display (Google Fonts) - elegant serif
- **Body**: Inter (Google Fonts) - clean sans
- **Mono**: JetBrains Mono - for stats/numbers

### Custom Classes
- `.gold-glow` - Gold text shadow effect
- `.gold-glow-hover` - Gold glow on hover
- `.btn-primary` - Gold gradient button
- `.btn-secondary` - Gold outline button
- `.card` - Dark card with hover effects
- `.gradient-hero` - Radial gradient background
- `.stat-item` - Animated stat counter
- `.social-icon` - Footer social icons with hover

## Page Details

### Homepage (index.astro)
- Hero section with profile image, name "PONTUS HULTGREN", tagline
- Stats ribbon: 31K+ YouTube, 34K+ Spotify listeners, 238 Patrons
- Featured Music: 2 YouTube embeds (FF5, FFX orchestral)
- Popular Works: FF, Dark Souls, Chrono Trigger cards
- Support CTA

### Music Page (music.astro)
- Spotify artist embed (full widget)
- Discography grid: MOGZART, Chrono Trigger, FF6, FF8, Cornucopia OST, Mega Man 2
- Streaming platform links: Spotify, Apple Music, TIDAL, SoundCloud

### Videos Page (videos.astro)
- 2 YouTube video embeds
- Channel stats and subscribe CTA
- Category cards: FF, Dark Souls, Nintendo, Sci-Fi

### About Page (about.astro)
- Profile photo + bio text
- Musical influences: Uematsu, Mitsuda, Williams, Morricone
- Stats: 14+ albums, 18M+ views, 34K listeners, Started 2011

### Support Page (support.astro)
- Patreon CTA with patron count
- Benefit tiers explanation
- Platform links grid

## External Links & Embeds

### YouTube Videos (work without login)
- FF5 Clash on Big Bridge: `NyncAG8flno`
- FFX Enemy Attack: `WdFym7z9ukI`

### Spotify
- Artist ID: `2hQXaxC4wndS2XXILcF3db`
- Chrono Trigger Album: `0xo3KEZ5k8dDaQ0refhVnY`

### Social Links
- YouTube: youtube.com/@PontusHultgren
- Spotify: open.spotify.com/artist/2hQXaxC4wndS2XXILcF3db
- Patreon: patreon.com/pontuscomposer
- Twitter: twitter.com/PontusComposer
- Apple Music: music.apple.com/us/artist/pontus-hultgren/991467382
- TIDAL: tidal.com/browse/artist/14035179
- SoundCloud: soundcloud.com/pontushultgren

## Layout.astro Structure
```
<!doctype html>
<html>
  <head>
    - Meta tags (description, OG, Twitter)
    - Google Fonts (Inter, Playfair Display)
    - Favicon
    - View Transition meta
  </head>
  <body>
    <nav> - Fixed top nav with logo + links + mobile menu
    <main> - Page content via <slot />
    <footer> - Copyright + social icons
    <script> - Mobile menu toggle
  </body>
</html>
```

## Notes
- YouTube embeds used instead of Spotify for Featured Music (plays without login)
- Spotify embeds require login for full playback
- Static site - deploy to Cloudflare Pages, Netlify, or Vercel
- View Transitions API provides smooth page transitions
