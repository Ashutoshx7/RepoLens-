import type { Metadata, Viewport } from "next";
import { Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AnalysisProvider } from "@/context/analysis-context";
import { ThemeProvider } from "@/context/theme-provider";

const fontHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "Git-Pulse - Repository Intelligence",
  description: "The precise analytics tool for modern engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        fontSans.variable,
        fontHeading.variable,
        "antialiased font-sans"
      )}>
        <AnalysisProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AnalysisProvider>
      </body>
    </html>
  );
}
