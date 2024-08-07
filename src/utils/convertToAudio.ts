import changeExtension from "@/utils/changeExtension";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Mutex } from "async-mutex";
import { toast } from "react-toastify";

const mutex = new Mutex();

export default async function convertToAudio(file: File, ffmpeg: FFmpeg, targetExtension: string, progressCallback?: (progress: number) => void): Promise<Uint8Array> {
	await mutex.waitForUnlock();
	const release = await mutex.acquire();
	try {
		console.debug("Starting to convert to audio...");
		ffmpeg.on("log", ({ message }) => {
			console.debug(message);
		});
		ffmpeg.on("progress", ({ progress }) => {
			console.debug(progress);
			progressCallback?.(progress);
		});

		if (!ffmpeg.loaded) throw new Error("FFmpeg not loaded");
		if (!file) throw new Error("No file provided");

		const timestamp = Date.now();
		const inputFileName = `thumbnail-input-${timestamp}-${file.name}`;
		const outputFileName = changeExtension(`thumbnail-output-${timestamp}-${file.name}`, "mp3");

		console.debug("Writing file");
		const fileData = new Uint8Array(await file.arrayBuffer());
		await ffmpeg.writeFile(inputFileName, fileData);

		console.debug("Executing command to convert thumbnail");
		await ffmpeg.exec(["-i", inputFileName, "-vn", "-ac", "1", "-b:a", "128k", outputFileName]);

		console.debug("Reading output audio file");
		const data = await ffmpeg.readFile(outputFileName);

		console.debug("Cleaning up");
		await ffmpeg.deleteFile(inputFileName);
		await ffmpeg.deleteFile(outputFileName);

		return data as Uint8Array;
	} catch (error) {
		toast.error("Error happened while converting to audio, make sure your file is valid and try again.");
		console.error("Error converting to audio:", error);
		throw error;
	} finally {
		release();
	}
}
