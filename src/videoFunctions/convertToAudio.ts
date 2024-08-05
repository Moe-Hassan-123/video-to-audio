import { FFmpeg } from "@ffmpeg/ffmpeg";

// the command we run:
// ffmpeg -ss 00:00:01.00 -i input.mp4 -vf 'scale=320:320:force_original_aspect_ratio=decrease' -vframes 1 output.jpg
export default async (ffmpeg: FFmpeg, file: File) => {};
