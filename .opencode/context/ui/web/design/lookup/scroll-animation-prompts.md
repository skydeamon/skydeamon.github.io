<!-- Context: ui/web/design/lookup/scroll-animation-prompts| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Lookup: Scroll Animation Image Generation Prompts

**Purpose**: AI prompts for generating start/end frames and video sequences for scrollytelling.

**Workflow**: Start frame → End frame → Video interpolation → Frame extraction

## Start Frame Prompts

### Product Hero Shot
```
Ultra-premium product photography of [PRODUCT NAME] placed on a matte black 
surface, minimalistic studio photoshoot. Deep black background (#050505) with 
subtle gradient falloff, soft rim lighting outlining edges, controlled 
reflections on smooth textures. Cinematic lighting, high contrast, luxury tech 
aesthetic, sharp focus, shallow depth of field. No clutter, no text, no logos 
emphasized. Shot with professional DSLR, 85mm lens, f/1.8, ultra-high 
resolution, photorealistic, Apple-level product shoot, dramatic mood, modern 
and elegant.
```

**Variables**: Replace [PRODUCT NAME] with your product. Output: starting position, fully assembled, hero angle.

### Variations by Product Type

| Product Type | Additional Details |
|--------------|-------------------|
| **Headphones** | "over-ear headphones with leather cushions and metal headband" |
| **Smartphone** | "smartphone with edge-to-edge OLED display, aluminum frame" |
| **Watch** | "luxury smartwatch with titanium case and sapphire crystal" |
| **Laptop** | "thin laptop with aluminum unibody, open at 45 degrees" |
| **Camera** | "mirrorless camera with prime lens attached, side profile" |

## End Frame Prompts

### Exploded Technical View
```
Exploded technical diagram view of [PRODUCT NAME], every component precisely 
separated and floating in perfect alignment, suspended in mid-air against deep 
black studio background (#050505). Visible internal structure including 
[INTERNAL COMPONENTS], all parts evenly spaced showing assembly order. 
Hyper-realistic product visualization, ultra-sharp focus, studio rim lighting 
identical to hero shot, soft highlights tracing each component, controlled 
reflections on matte and metal surfaces. Cinematic lighting, high contrast, 
luxury engineering aesthetic, no labels, no annotations, no text. 
Photorealistic, ultra-high resolution, Apple-style industrial design render, 
dramatic and clean.
```

**Variables**: [PRODUCT NAME] = your product; [INTERNAL COMPONENTS] = specific parts to show.

### Internal Components by Product

| Product | Internal Components Examples |
|---------|------------------------------|
| **Headphones** | "copper wiring, titanium drivers, magnets, circuit boards, padding layers, metal frame" |
| **Smartphone** | "battery, logic board, cameras, OLED panel, antenna bands, frame" |
| **Watch** | "watch movement, gears, battery, sensors, display, crown mechanism" |
| **Laptop** | "keyboard assembly, trackpad, battery cells, logic board, cooling fans, display panel" |
| **Camera** | "sensor, shutter mechanism, lens elements, mirror assembly, circuit boards" |

## Video Interpolation Prompts

### For Runway/Pika
```
Smoothly transition from fully assembled [PRODUCT] to exploded view. 
Components separate slowly and precisely, maintaining perfect alignment. 
Camera stays locked, product rotates slightly clockwise. Cinematic motion, 
professional product animation, 4-5 seconds duration, 30fps.
```

**Settings**: Duration 4-5s; FPS 30 (yields 120-150 frames); camera static or slow orbit; motion smooth/controlled.

## Frame Extraction

### Using ffmpeg
```bash
# Extract as WebP (best for web)
ffmpeg -i animation.mp4 -vf fps=30 frame_%04d.webp

# Extract as PNG (higher quality, larger)
ffmpeg -i animation.mp4 -vf fps=30 frame_%04d.png
```

### Using ezgif.com
Upload MP4 → "Video to GIF" → "Split to frames" → select WebP → download ZIP → rename `frame_0001.webp`, etc.

## Background Color Matching

**CRITICAL**: Page background MUST match image background exactly.

| Color Code | Usage |
|------------|-------|
| `#050505` | Pure black with slight lift (recommended) |
| `#0a0a0a` | Slightly lighter, less harsh |
| `#000000` | True black (only if images are true black) |
| `#1a1a1a` | Dark gray (for lighter renders) |

**Pro tip**: Use eyedropper tool on first frame background, use exact hex in CSS.

## Alternative Animation Styles

- **Rotation (360° spin)**: Start front view → end front view after 360° rotation. Prompt: "Rotate product 360 degrees on turntable, maintain lighting"
- **Zoom In (feature reveal)**: Start full product → end close-up of key feature. Prompt: "Smooth camera push-in focusing on [FEATURE], maintain focus"
- **Morph (color/style change)**: Start color A → end color B. Prompt: "Seamlessly morph product color from [A] to [B], maintain form"

## Quality Settings

- **Resolution**: 1920x1080 minimum (4K for high-DPI)
- **Format**: WebP (compression) or PNG (quality)
- **Frame count**: 90-150 frames (3-5 seconds at 30fps)
- **Total size**: Target <50MB for all frames combined

**Optimization**: Use WebP (70% smaller than PNG); compress quality 85-90; resize to max 2000px width; consistent aspect ratio (16:9 or 1:1).

## Testing Checklist

- [ ] Background color matches exactly (no visible edges)
- [ ] All frames same dimensions
- [ ] Smooth motion (no jumps between frames)
- [ ] Consistent lighting across sequence
- [ ] File names sequential (`frame_0001` to `frame_0120`)
- [ ] Total file size reasonable (<50MB)

**Related**: `ui/web/design/guides/building-scrollytelling-pages.md`, `ui/web/design/examples/scrollytelling-headphone.md`