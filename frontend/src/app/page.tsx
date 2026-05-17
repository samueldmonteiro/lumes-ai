"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RootRouterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    const seenSplash = localStorage.getItem("lumes_seen_splash");
    if (seenSplash !== "true") {
      hasRedirected.current = true;
      router.replace("/presentation");
      return;
    }

    const query = searchParams.get("q");
    hasRedirected.current = true;
    if (query) {
      router.replace(`/chat?q=${encodeURIComponent(query)}`);
    } else {
      router.replace("/home");
    }
  }, [router, searchParams]);

  return <div className="min-h-screen w-full bg-[#07040D]" />;
}

export default function RootRouterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#07040D]" />}>
      <RootRouterContent />
    </Suspense>
  );
}
