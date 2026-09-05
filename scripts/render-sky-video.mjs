import { spawnSync } from "node:child_process";

// A seamless 16-second camera move over Vellum's original generated artwork.
// This is a still-derived motion loop, not independently animated 3D objects.
const output = "public/brand/vellum-sky-loop.mp4";
const filter = "scale=3344:1882,zoompan=z='1.025+0.065*(1-cos(2*PI*on/384))/2':x='iw/2-iw/zoom/2+12*sin(2*PI*on/384)':y='ih/2-ih/zoom/2+8*sin(2*PI*on/384)':d=384:s=1600x900:fps=24,format=yuv420p";
const result = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", "public/brand/vellum-sky-hero.webp", "-vf", filter, "-frames:v", "384", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-movflags", "+faststart", "-an", output], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
