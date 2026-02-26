import type { Metadata } from "next";
import "./globals.css";
import { geistSans, geistMono } from "./fonts";

export const metadata: Metadata = {
    title: "NYPL Class Discovery",
    description: "Discover NYPL TechConnect classes",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}
