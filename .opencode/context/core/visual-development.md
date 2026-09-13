<!-- Context: core/visual-development| Priority: high | Version: 1.0 | Updated: 2026-09-11 -->
# Visual Development Context

**Purpose**: Visual content creation, UI design, image generation, and diagram creation

---

## Quick Routes

| Task Type | Context File | Tools |
|-----------|-------------|-------|
| **Generate image/diagram** | This file | tool:gemini |
| **Edit existing image** | This file | tool:gemini |
| **UI mockup (static)** | This file | tool:gemini |
| **Interactive UI design** | `workflows/design-iteration-overview.md` | - |
| **Design system** | `ui/web/foundations/design-systems.md` | - |
| **UI standards** | `ui/web/foundations/overview.md` | - |

---

## Image Specialist Capabilities

Uses Gemini Nano Banana AI for:
- ✅ Generate images from text descriptions
- ✅ Edit existing images
- ✅ Create diagrams (architecture, flowcharts)
- ✅ Design mockups (UI, wireframes)
- ✅ Generate graphics (social media, marketing)

### When to Delegate

**Keywords**: "create image", "diagram", "mockup", "graphic", "edit image", "screenshot", "visual"

**Common Use Cases**: Architecture diagrams, UI mockups, social media graphics, documentation images, presentations, marketing assets

### Invocation

```javascript
task(
  subagent_type="Image Specialist",
  description="[Brief 3-5 word description]",
  prompt="Context to load: .opencode/context/core/visual-development.md
          
          Task: [Detailed visual requirement]
          
          Requirements:
          - Style: [modern, minimalist, professional]
          - Dimensions: [Width x Height]
          - Key Elements: [what must be included]
          - Colors: [color scheme]
          - Format: [PNG, JPG, SVG]
          
          Output: [deliverable location]"
)
```

---

## Decision Tree: Image Specialist vs Design Iteration

```
User needs visual content
    ↓
Is it interactive/responsive HTML/CSS?
  YES → design-iteration-overview.md workflow
  NO  → Static visual asset?
          YES → Image Specialist (diagrams, mockups, graphics)
          NO  → Clarify requirements
```

| Need | Use |
|------|-----|
| **Interactive dashboard** | design-iteration-overview.md |
| **Dashboard mockup (static)** | Image Specialist |
| **Architecture diagram** | Image Specialist |
| **Social media graphic** | Image Specialist |
| **Working HTML prototype** | design-iteration-overview.md |

---

## Tools & Dependencies

**Required**: `tool:gemini` (Gemini Nano Banana AI)
- Requires `GEMINI_API_KEY` environment variable
- Get API key: https://makersuite.google.com/app/apikey
- Capabilities: Text-to-Image, Image-to-Image, Image Analysis, PNG/JPG/WebP, up to 2048x2048

---

## Best Practices

✅ Be specific about dimensions/format · ✅ Describe visual style clearly · ✅ Specify colors with hex codes · ✅ Include key elements · ✅ Mention intended use case

❌ Vague descriptions ("make it nice") · ❌ Forget dimensions · ❌ Skip color specs · ❌ Omit output location

---

## Quality Checklist

Before delegating: user request clear, static image appropriate, requirements gathered (style, dimensions, colors, elements), output format/location specified, prompt prepared.

After receiving: image meets requirements, dimensions/format correct, style matches, key elements included, saved to location, user satisfied.

---

## Related Context

- **UI Design Workflow**: `core/workflows/design-iteration-overview.md`
- **Design Systems**: `ui/web/foundations/design-systems.md`
- **UI Styling**: `ui/web/foundations/overview.md`
- **Animation**: `ui/web/animation-basics.md`, `ui/web/animation-advanced.md`