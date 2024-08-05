import changeExtension from "@/utils/changeExtension";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

export default async function getThumbnails(file: File, ffmpeg: FFmpeg, progressCallback?: (progress: number) => void): Promise<Uint8Array> {
	await mutex.waitForUnlock();
	const release = await mutex.acquire();
	try {
		console.log("Starting to load thumbnail...");
		ffmpeg.on("log", ({ message }) => {
			console.log(message);
		});
		ffmpeg.on("progress", ({ progress }) => {
			console.log(progress);
			progressCallback?.(progress);
		});

		if (!ffmpeg.loaded) throw new Error("FFmpeg not loaded");
		if (!file) throw new Error("No file provided");

		const timestamp = Date.now();
		const inputFileName = `thumbnail-input-${timestamp}-${file.name}`;
		const outputFileName = changeExtension(`thumbnail-output-${timestamp}-${file.name}`, "jpg");

		console.log("Writing file");
		const fileData = new Uint8Array(await file.arrayBuffer());
		await ffmpeg.writeFile(inputFileName, fileData);

		console.log("Executing command to convert thumbnail");
		await ffmpeg.exec(["-y", "-i", inputFileName, "-vf", "scale=800:800:force_original_aspect_ratio=decrease", "-frames:v", "1", "-update", "true", "-threads", "0", outputFileName]);

		console.log("Reading thumbnail");
		const data = await ffmpeg.readFile(outputFileName);

		console.log("Cleaning up");
		await ffmpeg.deleteFile(inputFileName);
		await ffmpeg.deleteFile(outputFileName);

		return data as Uint8Array;
	} catch (error) {
		console.error("Error generating thumbnail:", error);
		throw error;
	} finally {
		release();
	}
}
