import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Video To Audio",
	description: "Convert any video to an mp3 audio file right in your browser, your files are never uploaded to a server.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<MantineProvider>{children}</MantineProvider>
			</body>
		</html>
	);
}
