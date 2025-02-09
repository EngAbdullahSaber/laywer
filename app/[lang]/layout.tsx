"use client";
import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { Inter } from "next/font/google";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import store from "../../store/Store";
import { Provider } from "react-redux";
import DynamicMetadata from "./DynamicMetadata"; // Import the DynamicMetadata component
import Head from "next/head";

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang} dir={lang == "ar" ? "rtl" : "ltr"}>
      <Head>
        {/* Favicon links */}
        {/* <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-16x16.png"
          sizes="16x16"
        />

        {/* Apple Touch Icon for iOS */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" />  */}

        {/* Optional: Add a meta tag for MS tile image for Windows */}

        {/* You can add other dynamic metadata here */}
      </Head>
      <TanstackProvider>
        <Provider store={store}>
          <Providers>
            <DynamicMetadata />

            <DirectionProvider lang={lang}>{children}</DirectionProvider>
          </Providers>
        </Provider>
      </TanstackProvider>
    </html>
  );
}
