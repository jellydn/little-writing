# Character Templates

Stroke path templates for the handwriting tracing app. Each JSON file defines how a character is drawn within a `100×100` viewBox.

## Directory Structure

```
characters/
├── uppercase/   # A-Z (26 files)
├── lowercase/   # a-z (26 files)
└── numbers/     # 0-9 (10 files)
```

## JSON Schema

```jsonc
{
  "character": "A",            // The character itself
  "category": "uppercase",     // uppercase | lowercase | number
  "displayName": "A",          // Human-readable name (e.g. "Bee", "Zero")
  "bounds": {
    "width": 100,
    "height": 100,
    "viewBox": "0 0 100 100"
  },
  "strokes": [
    {
      "id": 1,                 // Stroke order (1-based)
      "path": "M 50 20 L 20 80", // SVG path data
      "startPoint": { "x": 50, "y": 20 },
      "endPoint": { "x": 20, "y": 80 },
      "guidePoints": [         // Sample points along the path for tracing
        { "x": 50, "y": 20 },
        { "x": 40, "y": 40 },
        { "x": 30, "y": 60 },
        { "x": 20, "y": 80 }
      ]
    }
  ],
  "totalStrokes": 1
}
```

## Coordinate System

- **Origin**: top-left `(0, 0)`
- **ViewBox**: `0 0 100 100`
- **Uppercase**: typically spans y `20–80`
- **Lowercase**: x-height range y `40–80`, ascenders up to y `20`, descenders down to y `95`
- **Numbers**: typically spans y `15–85`

## Path Commands

Standard SVG path commands are used:

| Command | Description | Example |
|---------|-------------|---------|
| `M x y` | Move to | `M 50 20` |
| `L x y` | Line to | `L 80 80` |
| `Q cx cy x y` | Quadratic curve | `Q 75 15 75 35` |
| `A rx ry rot large-arc sweep x y` | Arc | `A 30 30 0 1 1 50 80` |

## Guide Points

Each stroke contains `guidePoints` — sampled positions along the path at regular intervals. These are used for:

- Rendering tracing dots for children to follow
- Validating user strokes against the template
- Providing directional guidance during tracing

## Stroke Order

Strokes are numbered by `id` in the pedagogically correct writing order. Children trace stroke 1 first, then stroke 2, etc.
