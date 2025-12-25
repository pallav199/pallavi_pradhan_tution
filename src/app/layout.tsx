import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pallavi Pradhan Science Tuition | CBSE Classes 8, 9, 10",
  description: "Practice quizzes for CBSE Science students in Classes 8, 9, and 10. Aligned with classroom lessons and exam patterns.",
  keywords: ["Science Tuition", "CBSE", "Class 8", "Class 9", "Class 10", "Quiz", "Practice"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
