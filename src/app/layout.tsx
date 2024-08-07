import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Anchor, AppShell, AppShellFooter, AppShellMain, Center, ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
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
				<MantineProvider
					forceColorScheme="light"
					theme={{
						primaryColor: "violet",
					}}
				>
					<AppShell>
						<AppShellMain>{children}</AppShellMain>
						<AppShellFooter component={Center}>
							Created by&nbsp;
							<Anchor href="https://mohamed-hassan.dev" target="_blank">
								Mohamed Hassan
							</Anchor>
						</AppShellFooter>
					</AppShell>
				</MantineProvider>
			</body>
		</html>
	);
}
