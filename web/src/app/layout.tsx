import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Dock } from "@/components/site/dock";
import { Footer } from "@/components/site/footer";
import { Providers } from "@/components/site/providers";
import "./globals.css";

// Latin: Bricolage Grotesque 700/800 at its regular width for display, Geist
// 400/500/600 for text, Geist Mono 500/600. Arabic: Arad, limited to Arabic
// code points so it never draws Latin while the others load.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage", display: "swap" });
const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-geist-mono", display: "swap" });
const arad = localFont({
  variable: "--font-arad",
  display: "swap",
  src: [{ path: "../fonts/AradVF.woff2", weight: "100 900" }],
  declarations: [{ prop: "unicode-range", value: "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byjawad.pages.dev"),
  title: { default: "Jawad Khamaysa · Voice & Design", template: "%s · Jawad Khamaysa" },
  description: "Arabic voice over, brand identity and video by Jawad Khamaysa, from Palestine.",
  icons: { icon: "/media/logo-gold.png", apple: "/media/logo-gold.png" },
  openGraph: {
    title: "Jawad Khamaysa · Voice & Design",
    description: "Arabic voice over, brand identity and video, from Palestine.",
    images: ["/media/og.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f2ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f17" },
  ],
  viewportFit: "cover",
};

// Runs before first paint: applies the saved language and direction, and
// hides the English pre-render until the Arabic copy is in place.
const localeScript = `(function(){try{var l=localStorage.getItem('siteLocale');if(!l){l=(navigator.language||'').slice(0,2).toLowerCase()==='ar'?'ar':'en'}var r=document.documentElement;r.lang=l;r.dir=l==='ar'?'rtl':'ltr';if(l==='ar')r.classList.add('locale-pending')}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} ${arad.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body>
        <Providers>
          <Dock />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
