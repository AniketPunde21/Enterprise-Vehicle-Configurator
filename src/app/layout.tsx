import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "AutoNova Configurator | Build Your Dream",
  description:
    "Design your perfect Maserati with our premium online configurator. Choose from exclusive powertrains, trims, colors, and packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-maserati-navy text-white min-h-screen transition-colors duration-500 light:bg-gray-50 light:text-gray-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
