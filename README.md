
# QA Loop Video (4s Seamless)

Storyboard implemented:
- 0.0–1.0s — Gradient Sphere Zoom & Rotation (color fidelity & resolution)
- 1.0–2.0s — Black + 8pt serif white text gliding across center (edge sharpness & motion)
- 2.0–3.0s — Checker/Grid + concentric Ripple (compression & spatial distortion)
- 3.0–4.0s — Reverse Sphere back to start (seamless loop)

## Usage
- Open `index.html`
- Controls: Pause / Fit to Window / Set 4K / Record 4s WebM
- Recording uses MediaRecorder (WebM/VP9). To convert to MP4:
  ```bash
  ffmpeg -i qa-loop-4s.webm -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p qa-loop-4s.mp4
  ```
- Adjust exact text size in JS `drawOverlay()` if you need strict 8pt at your master resolution.
