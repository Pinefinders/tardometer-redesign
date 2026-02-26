interface SharePreviewModalProps {
  score: number;
  zone: string;
  shareUrl: string;
  onClose: () => void;
}

const ogImages: Record<string, string> = {
  "NOT RETARDED": "/og-not-retarded.png",
  "SEMI-RETARDED": "/og-semi-retarded.png",
  "FULLY RETARDED": "/og-fully-retarded.png",
};

const SharePreviewModal = ({ score, zone, shareUrl, onClose }: SharePreviewModalProps) => {
  const tweetText = `This tweet scored ${score}/100 — ${zone}. The Retard Score doesn't lie. retardometer.com`;
  const ogImage = ogImages[zone] || ogImages["SEMI-RETARDED"];

  const handlePost = () => {
    const encodedText = encodeURIComponent(tweetText);
    const fullUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#1a1a1a] border border-border/40 shadow-2xl animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground">Preview your post</span>
        </div>

        {/* Tweet text */}
        <div className="px-5 pb-4">
          <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">{tweetText}</p>
        </div>

        {/* OG Card preview */}
        <div className="mx-5 mb-5 rounded-xl overflow-hidden border border-border/30">
          <img
            src={ogImage}
            alt={`${zone} OG card`}
            className="w-full object-cover"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 px-5 pb-5">
          <button
            onClick={handlePost}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-base hover:opacity-90 transition-opacity"
          >
            <span>🐦</span> Post it
          </button>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-muted text-foreground font-bold text-base hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePreviewModal;
