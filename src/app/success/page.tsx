"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SessionData {
  productName: string;
  customerEmail: string;
  downloadUrl: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // For v1, we show a generic success message
    // In production, you'd verify the session with Stripe
    setSession({
      productName: "Ahead AI Guide",
      customerEmail: "",
      downloadUrl: "#",
    });
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No session found</h1>
          <p className="text-muted mb-8">
            It looks like you arrived here without completing a purchase.
          </p>
          <a
            href="/"
            className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Success checkmark */}
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          You&apos;re{" "}
          <span className="gradient-text">ahead</span> now.
        </h1>

        <p className="text-muted text-lg mb-8 leading-relaxed">
          Thank you for your purchase! Your guide is on its way to your
          email. You can also download it directly below.
        </p>

        {session && (
          <div className="bg-card-bg border border-card-border rounded-2xl p-8 mb-8">
            <p className="text-sm text-muted mb-2">You purchased</p>
            <p className="text-xl font-semibold mb-6">
              {session.productName}
            </p>

            <a
              href={session.downloadUrl}
              className="inline-block bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3.5 rounded-full transition-colors w-full"
            >
              Download Your Guide
            </a>
          </div>
        )}

        <p className="text-sm text-muted mb-4">
          A download link has also been sent to your email.
          <br />
          The link expires in 7 days.
        </p>

        <a
          href="/"
          className="text-primary hover:text-primary-hover text-sm font-medium transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
