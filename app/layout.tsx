import type { Metadata } from "next";
import { Nunito, DM_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meowtrics — Sticker Pricing Calculator",
  description:
    "Free sticker pricing calculator for small businesses. " +
    "Calculate material cost, labor, COGS, selling price, and profit margin " +
    "instantly. Your numbers, purrfected. 🐱",
  keywords: [
    "sticker pricing calculator",
    "cost per sticker Philippines",
    "COGS calculator small business",
    "sticker profit margin calculator",
    "Etsy sticker pricing",
    "Shopee sticker seller tool",
    "print shop calculator",
    "meowtrics",
  ],
  openGraph: {
    title: "Meowtrics — Your numbers, purrfected. 🐱",
    description:
      "Free sticker pricing calculator. Know your costs. Price with confidence.",
    url: "https://meowtrics.com",
    siteName: "Meowtrics",
  },
};

/**
 * RootLayout — wraps the entire app with fonts and dark mode support.
 * The `suppressHydrationWarning` on <html> prevents mismatch from
 * the dark mode class being set via localStorage before React hydrates.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = localStorage.getItem('meowtrics-dark');
                  if (dark === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
