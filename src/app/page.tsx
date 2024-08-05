"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button, Center, Container, Divider, FileButton, FileInput, SimpleGrid, Stack } from "@mantine/core";
import "@mantine/core/styles.css";
import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileCard from "./FileCard";

export default function Home() {
	const [files, setFiles] = useState<File[]>([]);
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
						multiple
						accept="video/*"
						onChange={(files) => {
							setFiles((oldFiles) => {
								const uniqueFilesMap = new Map();
								[...oldFiles, ...files].forEach((file) => {
									uniqueFilesMap.set(file.name, file);
								});
								return [...uniqueFilesMap.values()];
							});
						}}
					>
						{(props) => <Button {...props}>Upload a Video</Button>}
					</FileButton>

					<Divider />

					<SimpleGrid
						cols={{
							md: 2,
							xs: 1,
						}}
						spacing="xl"
					>
						{ffmpegRef.current.loaded &&
							files?.map((file) => {
								return <FileCard key={file.lastModified} file={file} ffmpeg={ffmpegRef.current} />;
							})}
					</SimpleGrid>
				</Stack>
			</Container>
		</main>
	);
}
