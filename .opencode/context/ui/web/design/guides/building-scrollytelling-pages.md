<!-- Context: ui/web/design/guides/building-scrollytelling-pages| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->

# Guide: Building Scrollytelling Pages

**Purpose**: Step-by-step implementation of scroll-linked image sequence animations.

## Prerequisites

- Next.js 14+ project with App Router
- Framer Motion installed (`npm i framer-motion`)
- Tailwind CSS configured
- Image sequence ready (60-240 WebP frames)

## Steps

### 1. Generate Image Sequences
Create start/end frames with AI tools, then interpolate with video tools (Runway, Pika).

**Start frame prompt**: "Ultra-premium product photography of [product] on matte black surface, minimalistic studio shoot, deep black background with subtle gradient, soft rim lighting, cinematic, high contrast, luxury aesthetic, sharp focus, no clutter, DSLR 85mm f/1.8, photorealistic"

**End frame prompt**: "Exploded technical diagram of same [product], every component separated and floating in alignment, against deep black studio background, visible internal structure, hyper-realistic, studio rim lighting, cinematic, high contrast, no labels, photorealistic"

**Export frames**:
```bash
ffmpeg -i animation.mp4 -vf fps=30 frame_%04d.webp
```

### 2. Project Structure
```
app/
├── page.tsx                    # Main landing page
├── components/
│   └── HeadphoneScroll.tsx    # Scroll animation component
└── globals.css                 # Dark theme, Inter font
public/
└── frames/
    ├── frame_0001.webp        # 120+ frames
    └── ...
```

### 3. Setup globals.css
```css
@layer base {
  body {
    @apply bg-[#050505] text-white antialiased;
    font-family: 'Inter', -apple-system, sans-serif;
  }
}
```

### 4. Create Scroll Component
**Key patterns**: container with `h-[400vh]` for long scroll; canvas with `sticky top-0` stays fixed; `useScroll` tracks progress (0-1); `useTransform` maps progress to frame index; `useEffect` preloads all images.

```tsx
const { scrollYProgress } = useScroll({ target: containerRef })
const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 119])
```

### 5. Implement Preloader
Always preload images before starting animation:
```tsx
useEffect(() => {
  const promises = Array.from({ length: 120 }, (_, i) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`
      img.onload = () => resolve(img)
    })
  })
  Promise.all(promises).then(setImages).then(() => setLoading(false))
}, [])
```

### 6. Canvas Rendering
Draw current frame to canvas on every scroll update:
```tsx
useEffect(() => {
  if (!canvasRef.current || !images.length) return
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.drawImage(images[Math.round(currentFrame)],
    (canvas.width - img.width) / 2,
    (canvas.height - img.height) / 2)
}, [currentFrame, images])
```

### 7. Add Text Overlays
Fade text in/out at specific scroll positions:
```tsx
<motion.div
  style={{ opacity: useTransform(scrollYProgress, [0.25, 0.30, 0.35], [0, 1, 0]) }}
  className="absolute left-20 text-4xl font-bold"
>Precision Engineering.</motion.div>
```

### 8. Match Backgrounds
**CRITICAL**: Page background MUST match image background exactly. Use eyedropper tool on first frame, set exact hex in globals.css. Test: image edges should be invisible.

### 9. Optimize Performance
Add `style={{ willChange: 'transform' }}` to canvas; throttle redraws with `requestAnimationFrame` on mobile.

### 10. Add Loading State
Show spinner while frames load:
```tsx
{loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
    <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-white rounded-full" />
  </div>
)}
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Images not loading | Check file paths match exactly; verify frames exist; check console for 404s |
| Stuttering animation | Ensure preload complete; use WebP; check canvas size |
| Visible image edges | Background colors don't match exactly; use eyedropper not guessing |
| Mobile performance | Reduce frame count; debounce with rAF; consider disabling on small screens |

## Testing Checklist

- [ ] All frames load without 404s
- [ ] Animation smooth from 0-100% scroll
- [ ] Text fades in/out at correct positions
- [ ] Background seamlessly blends with images
- [ ] Loading spinner shows before animation
- [ ] Works on mobile (or gracefully disabled)
- [ ] No console errors

**Related**: `ui/web/design/examples/scrollytelling-headphone.md`, `ui/web/design/lookup/scroll-animation-prompts.md`