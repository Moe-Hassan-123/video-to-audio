import NoSSRWrapper from "./NoSSRWrapper";
import ConvertPage from "./VideoToAudioPage";

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
			<ConvertPage />
		</NoSSRWrapper>
	);
}
