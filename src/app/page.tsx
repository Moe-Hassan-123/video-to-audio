import NoSSRWrapper from "./NoSSRWrapper";
import VideoToAudioComponent from "./VideoToAudioPage";
import { Container, Title, Text, Button, List, ThemeIcon, Group, Paper, Badge, ListItem, Anchor } from "@mantine/core";
import { IconCheck, IconUpload, IconBrandGithub } from "@tabler/icons-react";

export type UploadedFile = {
	file: File;
	audioOutput?: Uint8Array;
	isProcessing: boolean;
	progress: number;
	isDone: boolean;
};

export default function Home() {
	return (
		<NoSSRWrapper>
			<Container py="xl">
				<Title ta="center">VideoToAudio: Convert Your Videos to Audio in Seconds</Title>

				<Group align="center" justify="center" gap="xl" mb="md">
					<Badge size="lg" radius="sm">
						Free Forever
					</Badge>
					<Badge size="lg" radius="sm">
						Open Source
					</Badge>
				</Group>

				<section id="convert">
					<VideoToAudioComponent />
				</section>

				<Container size={560} p={0}>
					<Text size="lg" c="dimmed" ta="center">
						Instant Video-to-Audio Conversion, Right in Your Browser
					</Text>
					<Text mt="md" ta="center">
						Transform any video into high-quality audio with just a few clicks. No software to install, no waiting for uploads – VideoToAudio harnesses the power of your browser for
						lightning-fast conversions.
					</Text>

					<Paper withBorder mt="xl" radius="md" p="xl">
						<Title order={3} ta="center" mb="md">
							Why Choose VideoToAudio?
						</Title>
						<List
							spacing="sm"
							size="sm"
							icon={
								<ThemeIcon size={20} radius="xl">
									<IconCheck size={12} stroke={1.5} />
								</ThemeIcon>
							}
						>
							<ListItem>
								<b>Lightning Fast:</b> Conversions happen right in your browser – no uploading required.
							</ListItem>
							<ListItem>
								<b>Privacy First:</b> Your files never leave your device. Convert with confidence.
							</ListItem>
							<ListItem>
								<b>Universal Compatibility:</b> Works on any modern browser, on any device.
							</ListItem>
							<ListItem>
								<b>Powered by FFmpeg-Wasm:</b> Professional-grade conversion using web assembly technology.
							</ListItem>
							<ListItem>
								<b>Free Forever:</b> No hidden fees, no premium tiers – all features are completely free.
							</ListItem>
							<ListItem>
								<b>Open Source:</b> Transparent code you can trust and contribute to.
							</ListItem>
						</List>
					</Paper>

					<Paper withBorder mt="xl" radius="md" p="xl">
						<Title order={3} ta="center" mb="md">
							How It Works
						</Title>
						<List type="ordered" spacing="sm" size="sm">
							<ListItem>Click 'Upload File' or drag and drop your video.</ListItem>
							<ListItem>Select your desired audio format (MP3, WAV, AAC).</ListItem>
							<ListItem>Click 'Convert' and watch the magic happen.</ListItem>
							<ListItem>Download your new audio file instantly.</ListItem>
						</List>
					</Paper>

					<Paper withBorder mt="xl" radius="md" p="xl">
						<Title order={3} ta="center" mb="md">
							Technical Marvel
						</Title>
						<Text size="sm">VideoToAudio leverages FFmpeg-Wasm, a cutting-edge implementation of FFmpeg that runs entirely in your web browser. This means:</Text>
						<List
							spacing="xs"
							size="sm"
							mt="sm"
							icon={
								<ThemeIcon c="blue" size={16} radius="xl">
									<IconCheck size={10} stroke={1.5} />
								</ThemeIcon>
							}
						>
							<ListItem>Blazing fast conversions without server bottlenecks</ListItem>
							<ListItem>Enhanced privacy as your files never leave your device</ListItem>
							<ListItem>Consistent performance across all platforms</ListItem>
						</List>
					</Paper>

					<Text fw={500} ta="center" mt="xl">
						Ready to turn your videos into audio? Try it now – no registration required!
					</Text>

					<Group justify="center" mt="xl">
						<Anchor href="#convert">
							<Button size="lg" leftSection={<IconUpload size={20} />}>
								Convert Your First Video
							</Button>
						</Anchor>
						<Anchor href="https://github.com/Moe-Hassan-123/video-to-audio" target="_blank">
							<Button size="lg" variant="outline" leftSection={<IconBrandGithub size={20} />}>
								View on GitHub
							</Button>
						</Anchor>
					</Group>

					<Text c="dimmed" size="sm" ta="center" mt="xl">
						VideoToAudio: Unleash the audio from your videos, instantly and securely. Free forever and open source.
					</Text>
				</Container>
			</Container>
		</NoSSRWrapper>
	);
}
