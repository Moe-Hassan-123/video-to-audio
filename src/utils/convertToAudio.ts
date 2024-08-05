import changeExtension from "@/utils/changeExtension";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

export default async function convertToAudio(file: File, ffmpeg: FFmpeg, progressCallback?: (progress: number) => void): Promise<Uint8Array> {
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
		const outputFileName = changeExtension(`thumbnail-output-${timestamp}-${file.name}`, "mp3");

		console.log("Writing file");
		const fileData = new Uint8Array(await file.arrayBuffer());
		await ffmpeg.writeFile(inputFileName, fileData);

		console.log("Executing command to convert thumbnail");
		await ffmpeg.exec(["-i", inputFileName, "-vn", "-ac", "1", "-b:a", "128k", outputFileName]);

		console.log("Reading output audio file");
		const data = await ffmpeg.readFile(outputFileName);

		console.log("Cleaning up");
		await ffmpeg.deleteFile(inputFileName);
		await ffmpeg.deleteFile(outputFileName);

		return data as Uint8Array;
	} catch (error) {
		console.error("Error converting to audio:", error);
		throw error;
	} finally {
		release();
	}
}
