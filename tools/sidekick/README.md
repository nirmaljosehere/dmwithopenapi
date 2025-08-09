# Sidekick Library Setup

This directory contains the configuration and block examples for the AEM Sidekick Library.

## Structure

```
tools/sidekick/
├── README.md          # This file
├── library.csv        # Library configuration (maps to Excel helix-blocks sheet)
├── library.html       # Library loader page
├── config.json        # Sidekick configuration
└── blocks/            # Block example documents
    ├── cards.html
    ├── columns.html
    ├── hero.html
    ├── video.html
    ├── embed.html
    ├── header.html
    ├── footer.html
    ├── fragment.html
    └── hotspot.html
```

## How to Use

1. **Publish the library configuration**: Ensure the `library.csv` file and all block example files are published
2. **Install AEM Sidekick**: Install the AEM Sidekick browser extension
3. **Access the library**: In your content authoring environment, the sidekick should show a "Library" button
4. **Browse blocks**: Click the Library button to browse available block components with live previews

## Block Examples

Each HTML file in the `blocks/` directory demonstrates different variations of the corresponding block component:

- **Cards**: Basic cards, text-only cards, featured cards
- **Columns**: Two-column, three-column, image and text layouts
- **Hero**: Basic hero, background hero, centered hero
- **Video**: Basic video embeds with custom posters
- **Embed**: External content and social media embeds
- **Header**: Site navigation and branding
- **Footer**: Multi-column footer with links
- **Fragment**: Reusable content references
- **Hotspot**: Interactive image hotspots

## Library Metadata

Each block example includes library metadata that provides:
- Custom names and descriptions
- Search tags for better discoverability
- Styling configuration options

## Next Steps

1. Preview and publish the block example documents
2. Preview and publish the library.csv configuration
3. Test the sidekick library in your authoring environment
4. Customize block examples to match your design system

For more information, see the [AEM Sidekick Library documentation](https://www.aem.live/docs/sidekick-library). 