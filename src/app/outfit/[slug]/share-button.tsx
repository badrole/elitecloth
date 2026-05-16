"use client";

import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

const BASE_URL = "https://www.elcloth.store";

interface ShareButtonProps {
  title: string;
  text: string;
  slug: string;
}

export function ShareButton({ title, text, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${BASE_URL}/outfit/${slug}`;
  const caption = text || `Cek outfit "${title}" di Elitecloth!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: caption, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${caption} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${caption} ${shareUrl}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleShare}
        className="btn-pill border border-border-subtle bg-transparent text-xs text-warm-white/60 hover:border-border-hover hover:text-warm-white"
      >
        <Share2 size={14} />
        Share
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-pill border border-border-subtle bg-transparent text-xs text-warm-white/60 hover:border-green-600 hover:text-green-400"
      >
        <MessageCircle size={14} />
        WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className="btn-pill border border-border-subtle bg-transparent text-xs text-warm-white/60 hover:border-border-hover hover:text-warm-white"
      >
        <LinkIcon size={14} />
        {copied ? "Tersalin!" : "Copy Link"}
      </button>
    </div>
  );
}
