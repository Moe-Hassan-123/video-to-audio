import getThumbnail from "@/utils/getThumbnail";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Badge, Button, Card, CardSection, Group, Image, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

type FileCardProps = {
	file: File;
	ffmpeg: FFmpeg;
};
export default function FileCard({ file, ffmpeg }: FileCardProps) {
	const [thumbnail, setThumbnail] = useState<null | Uint8Array | string>(null);
	const isThumbnailStarted = useRef(false);

	const loadThumbnail = async () => {
		const thumbnail = await getThumbnail(file, ffmpeg);
		console.log(thumbnail);
		const url = URL.createObjectURL(new Blob([thumbnail], { type: "image/png" }));
		setThumbnail(url);
	};

	useEffect(() => {
		if (ffmpeg.loaded && !isThumbnailStarted.current) {
			isThumbnailStarted.current = true;
			loadThumbnail();
		}
	}, [ffmpeg.loaded, loadThumbnail]);

	return (
		<Card w="100%" maw="320px">
			<CardSection>{thumbnail !== null && <Image src={thumbnail} height={160} alt={`${file.name}'s thumbnail`} />}</CardSection>

			<Stack>
				<Text fw={500} truncate="end" lineClamp={4} component="div">
					{file.name}
				</Text>

				<Badge color="pink">{file.type.split("/").at(-1)}</Badge>
			</Stack>

			<Button color="blue" fullWidth mt="md" radius="md">
				Start conversion now
			</Button>
		</Card>
	);
}
