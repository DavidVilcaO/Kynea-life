import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kynea – La primera plataforma integral de danza en el Perú",
  description: "Encuentra clases de baile, audiciones, shows, eventos culturales y tiendas especializadas. Donde la pasión por la danza cobra vida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
