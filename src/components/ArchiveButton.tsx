import { useState, useEffect } from "react";
import { Archive, Check } from "lucide-react";
import { TweetMetrics, TardScore } from "@/lib/twitter";
import { archiveTweet, isArchived } from "@/lib/archive";
import { toast } from "sonner";

interface ArchiveButtonProps {
  tweetId: string;
  tweetUrl: string;
  authorUsername: string;
  metrics: TweetMetrics;
  score: TardScore;
}

const ArchiveButton = ({ 
  tweetId, 
  tweetUrl, 
  authorUsername, 
  metrics, 
  score 
}: ArchiveButtonProps) => {
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    setArchived(isArchived(tweetId));
  }, [tweetId]);

  const handleArchive = () => {
    if (archived) {
      toast.info("Already archived", {
        description: "This tweet is already in your archives.",
      });
      return;
    }

    archiveTweet({
      tweetId,
      tweetUrl,
      authorUsername,
      tweetText: `Tweet by @${authorUsername}`, // Placeholder since we don't have actual text
      metrics,
      score,
      hasCommunityNote: metrics.hasCommunityNote || false,
    });

    setArchived(true);
    toast.success("Tweet archived! 📦", {
      description: "Evidence preserved. View in My Archives.",
    });
  };

  return (
    <button
      onClick={handleArchive}
      disabled={archived}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
        archived
          ? "bg-primary/20 text-primary border border-primary/30 cursor-default"
          : "bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/50"
      }`}
    >
      {archived ? (
        <>
          <Check className="w-4 h-4" />
          Archived
        </>
      ) : (
        <>
          <Archive className="w-4 h-4" />
          Archive Tweet
        </>
      )}
    </button>
  );
};

export default ArchiveButton;
