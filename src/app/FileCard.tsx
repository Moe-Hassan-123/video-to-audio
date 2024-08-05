import getThumbnail from "@/utils/getThumbnail";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Badge, Button, Card, CardSection, Group, Image, Progress, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { UploadedFile } from "./page";
import convertToAudio from "@/utils/convertToAudio";
import "react-h5-audio-player/lib/styles.css";
import AudioPlayer from "react-h5-audio-player";

type FileCardProps = {
	file: UploadedFile;
	ffmpeg: FFmpeg;
};

export default function FileCard({ file, ffmpeg }: FileCardProps) {
	const [thumbnail, setThumbnail] = useState<null | Uint8Array | string>(null);
	const isThumbnailStarted = useRef(false);

	const loadThumbnail = useCallback(async () => {
		const thumbnail = await getThumbnail(file.file, ffmpeg);
		const url = URL.createObjectURL(new Blob([thumbnail], { type: "image/png" }));
		setThumbnail(url);
	}, [file.file, ffmpeg]);

	useEffect(() => {
		if (ffmpeg.loaded && !isThumbnailStarted.current) {
			// Ensures that we don't load thumbnail twice
			isThumbnailStarted.current = true;
			loadThumbnail();
		}
	}, [ffmpeg.loaded, loadThumbnail]);

	const [isConverting, setIsConverting] = useState(false);
	const [finishedConverting, setFinishedConverting] = useState(false);
	const [progress, setProgress] = useState(0);
	const [output, setOutput] = useState<string | null>(null);

	const onStartConversion = async () => {
		setIsConverting(true);

		const output = await convertToAudio(file.file, ffmpeg, (progress) => {
			setProgress(progress);
		});

		console.log(output);
		const url = URL.createObjectURL(new Blob([output], { type: "audio/mp3" }));
		setOutput(url);

		setIsConverting(false);
		setFinishedConverting(true);
		setProgress(100);
	};

	const download = () => {
		const a = document.createElement("a");
		a.href = output!;
		a.download = "audio.mp3";

		// Adding the link to the document
		document.body.appendChild(a);

		// Auto-click the link to trigger the download
		a.click();
		document.body.removeChild(a);
	};
	return (
		<Card w="100%" maw="800px" shadow="xl">
			<CardSection>{thumbnail !== null && <Image src={thumbnail} height={400} alt={`${file.file.name}'s thumbnail`} />}</CardSection>

			<Group justify="space-between" mt="md" mb="xl">
				<Text fw={500} truncate="end" lineClamp={4} component="div">
					{file.file.name}
				</Text>

				<Badge>{file.file.type.split("/").at(-1)}</Badge>
			</Group>

			<Stack>
				{!output && <Button onClick={onStartConversion}>Start conversion</Button>}

				{isConverting && <Progress value={progress} striped animated />}

				{output && (
					<>
						<AudioPlayer src={output} autoPlay style={{ background: "red" }} />
						<Button onClick={download}>Download</Button>
					</>
				)}
			</Stack>
		</Card>
	);
}
