import getThumbnail from "@/utils/getThumbnail";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Badge, Button, Card, CardSection, Group, Image, OptionsDropdown, Progress, Select, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import convertToAudio from "@/utils/convertToAudio";
import "react-h5-audio-player/lib/styles.css";
import AudioPlayer from "react-h5-audio-player";
import changeExtension from "@/utils/changeExtension";

type FileCardProps = {
	file: File;
	ffmpeg: FFmpeg;
};

export default function FileCard({ file, ffmpeg }: FileCardProps) {
	const [thumbnail, setThumbnail] = useState<null | Uint8Array | string>(null);
	const isThumbnailStarted = useRef(false);
	const [targetExt, setTargetExt] = useState("mp3");
	const [isConverting, setIsConverting] = useState(false);
	const [progress, setProgress] = useState(0);
	const [output, setOutput] = useState<string | null>(null);

	const loadThumbnail = useCallback(async () => {
		const thumbnail = await getThumbnail(file, ffmpeg);
		const url = URL.createObjectURL(new Blob([thumbnail], { type: "image/png" }));
		setThumbnail(url);
	}, [file, ffmpeg]);

	useEffect(() => {
		if (ffmpeg.loaded && !isThumbnailStarted.current) {
			// Ensures that we don't load thumbnail twice
			isThumbnailStarted.current = true;
			loadThumbnail();
		}
	}, [ffmpeg.loaded, loadThumbnail]);

	const onStartConversion = async () => {
		setIsConverting(true);

		const output = await convertToAudio(file, ffmpeg, targetExt, (progress) => {
			setProgress(progress);
		});

		const blob = new Blob([output], { type: `audio/mpeg` });
		const url = URL.createObjectURL(blob);
		setOutput(url);
		setIsConverting(false);
		setProgress(100);
	};

	const download = () => {
		// TODO: Allow user to select their outputname
		const a = document.createElement("a");
		a.href = output!;
		a.download = changeExtension(file.name, targetExt);

		// Adding the link to the document
		document.body.appendChild(a);
		// Auto-click the link to trigger the download
		a.click();
		document.body.removeChild(a);
	};

	return (
		<Card w="100%" maw="800px" shadow="xl">
			<CardSection>{thumbnail !== null && <Image src={thumbnail} height={400} alt={`${file.name}'s thumbnail`} />}</CardSection>

			<Group justify="space-between" mt="md" mb="xl">
				<Text fw={500} truncate="end" lineClamp={4} component="div">
					{file.name}
				</Text>

				<Badge>{file.type.split("/").at(-1)}</Badge>
			</Group>

			<Stack>
				{!output && (
					<>
						<Select
							label="Target format"
							data={[
								{ value: "mp3", label: "MP3" },
								{ value: "ogg", label: "OGG" },
								{ value: "wav", label: "WAV" },
							]}
							defaultValue="mp3"
							value={targetExt}
							onChange={(value) => {
								if (value) setTargetExt(value);
							}}
						/>

						<Button onClick={onStartConversion}>Start conversion</Button>
					</>
				)}

				{isConverting && <Progress value={progress} striped animated />}

				{output && (
					<>
						<AudioPlayer src={output} autoPlay />
						<Button onClick={download}>Download</Button>
					</>
				)}
			</Stack>
		</Card>
	);
}
