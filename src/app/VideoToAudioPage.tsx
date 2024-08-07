"use client";
import { Button, Card, Center, Container, Divider, FileButton, Group, Stack } from "@mantine/core";
import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import FileCard from "./FileCard";
import { IconUpload } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";

export default function VideoToAudioComponent() {
	const [file, setFile] = useState<File | null>(null);
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
		<Card shadow="xl" m={"xl"}>
			<Container m="xl" w="100%" component={Center}>
				<Stack w="100%" maw="700px">
					<Dropzone
						multiple={false}
						onDrop={(file) => {
							setFile(file[0]);
						}}
						accept={["video/*"]}
					>
						<Button component={Center}>
							<Group>
								<IconUpload />
								Upload Video
							</Group>
						</Button>
					</Dropzone>

					{file && (
						<>
							<Divider />

							<FileCard key={file.lastModified} file={file} ffmpeg={ffmpegRef.current} />
						</>
					)}
				</Stack>
			</Container>
		</Card>
	);
}
