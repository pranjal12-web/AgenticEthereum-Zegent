import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme,Container,Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme appearance="dark">
          <Container >
            {children}
          </Container>
        </Theme>
      </body>
    </html>
  );
}
