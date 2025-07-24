import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import "../app/globals.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/common/LoadingSpinner";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLoading(false), 2000);
    };
    const handleStop = () => {
      setLoading(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner tip="Loading..." size="large" />
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
