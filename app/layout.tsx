import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "NEXUS — your people, in sync", description: "A social space for the people and ideas you care about." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
