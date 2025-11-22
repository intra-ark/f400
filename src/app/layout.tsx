import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "F400 Manufacturing Time Definition",
    description: "Schneider Electric F400 Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className="light">
            <head>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
            </head>
            <body className={`${inter.className} font-display bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen`}>
                {children}
            </body>
        </html>
    );
}
