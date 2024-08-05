"use client";
import styles from "./page.module.css";
import { Button, Center, Container, Divider, FileButton, Stack } from "@mantine/core";
import "@mantine/core/styles.css";
import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import FileCard from "./FileCard";

export type UploadedFile = {
	file: File;
	audioOutput?: Uint8Array;
	isProcessing: boolean;
	progress: number;
	isDone: boolean;
};

export default function ConvertPage() {
	const [file, setFile] = useState<UploadedFile | null>(null);
	const ffmpegRef = useRef(new FFmpeg());
	const [isLoading, setIsLoading] = useState(false);

	const load = async () => {
		setIsLoading(true);
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
		const ffmpeg = ffmpegRef.current;

		// toBlobURL is used to bypass CORS issue, urls with the same
		// domain can be used directly.
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
		});

		setIsLoading(false);
	};

	if (!isLoading && !ffmpegRef.current.loaded) load();

	return (
		<main className={styles.main}>
			<Container m="xl" w="100%" component={Center}>
				<Stack w="100%" maw="700px">
					<span>UPLOAD FILE:</span>

					<FileButton
						accept="video/*"
						onChange={(file) => {
							if (file)
								setFile({
									file: file,
									audioOutput: undefined,
									isProcessing: false,
									isDone: false,
									progress: 0,
								});
						}}
					>
						{(props) => <Button {...props}>Upload Video</Button>}
					</FileButton>

					{file && (
						<>
							<Divider />
							<FileCard key={file.file.lastModified} file={file} ffmpeg={ffmpegRef.current} />
						</>
					)}
				</Stack>
			</Container>
		</main>
	);
}
