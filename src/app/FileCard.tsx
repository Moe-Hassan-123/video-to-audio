import getThumbnail from "@/videoFunctions/getThumbnail";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Badge, Card, CardSection, Group, Image, LoadingOverlay, Text, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

type FileCardProps = {
	file: File;
	ffmpeg: FFmpeg;
};
export default ({ file, ffmpeg }: FileCardProps) => {
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
	}, [ffmpeg.loaded]);

	return (
		<Card w="320px">
			<CardSection>{thumbnail !== null && <Image src={thumbnail} height={160} alt={`${file.name}'s thumbnail`} />}</CardSection>

			<Group justify="space-between" mt="md" mb="xs">
				<Text fw={500}>{file.name}</Text>
				<Badge color="pink">{file.type}</Badge>
			</Group>
		</Card>
	);
};
