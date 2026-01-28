import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Archive, Trash2, ExternalLink, AlertTriangle, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllArchivedTweets, deleteArchivedTweet, ArchivedTweet } from "@/lib/archive";
import { toast } from "sonner";

const getScoreInfo = (score: number) => {
  if (score <= 24) return { label: "TARDED", colorClass: "bg-destructive text-destructive-foreground" };
  if (score <= 75) return { label: "MID", colorClass: "bg-accent text-accent-foreground" };
  return { label: "BASED", colorClass: "bg-primary text-primary-foreground" };
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ArchiveCard = ({ 
  archive, 
  onDelete 
}: { 
  archive: ArchivedTweet; 
  onDelete: (id: string) => void;
}) => {
  const scoreInfo = getScoreInfo(archive.score.score);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-4 sm:p-6 transition-all hover:border-primary/30">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold">@{archive.authorUsername}</span>
          {archive.hasCommunityNote && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              CN
            </span>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${scoreInfo.colorClass}`}>
          {archive.score.score} {scoreInfo.label}
        </span>
      </div>

      {/* Tweet Preview */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {archive.tweetText}
      </p>

      {/* Expandable Metrics */}
      {expanded && (
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/30 animate-fade-up">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Archived Metrics</h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-foreground font-mono font-bold">{archive.metrics.likes.toLocaleString()}</div>
              <div className="text-muted-foreground">Likes</div>
            </div>
            <div>
              <div className="text-foreground font-mono font-bold">{archive.metrics.retweets.toLocaleString()}</div>
              <div className="text-muted-foreground">RTs</div>
            </div>
            <div>
              <div className="text-foreground font-mono font-bold">{archive.metrics.replies.toLocaleString()}</div>
              <div className="text-muted-foreground">Replies</div>
            </div>
            <div>
              <div className="text-foreground font-mono font-bold">{archive.metrics.quoteRetweets.toLocaleString()}</div>
              <div className="text-muted-foreground">Quotes</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-muted-foreground">Reply Ratio</div>
              <div className={`font-mono font-bold ${archive.score.replyRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
                {archive.score.replyRatio}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Quote Ratio</div>
              <div className={`font-mono font-bold ${archive.score.quoteRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
                {archive.score.quoteRatio}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Eng. Quality</div>
              <div className={`font-mono font-bold ${archive.score.engagementQuality < 5 ? "text-destructive" : "text-primary"}`}>
                {archive.score.engagementQuality}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Archived {formatDate(archive.archivedAt)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2 py-1 rounded hover:bg-muted transition-colors"
          >
            {expanded ? "Hide" : "Details"}
          </button>
          <a
            href={archive.tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition-colors text-primary"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </a>
          <button
            onClick={() => onDelete(archive.tweetId)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/20 text-destructive transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Archives = () => {
  const [archives, setArchives] = useState<ArchivedTweet[]>([]);

  useEffect(() => {
    setArchives(getAllArchivedTweets());
  }, []);

  const handleDelete = (tweetId: string) => {
    deleteArchivedTweet(tweetId);
    setArchives(getAllArchivedTweets());
    toast.success("Archive deleted");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="pt-8 pb-6 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Archive className="w-8 h-8 text-primary" />
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-title">
            My Archives
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Preserved Tarded moments. Saved locally, persists even if the original tweet is deleted.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16 max-w-3xl mx-auto w-full">
        {archives.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No archives yet</h2>
            <p className="text-muted-foreground mb-6">
              When you analyze a tweet, use the "Archive Tweet" button to preserve the evidence.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze a Tweet
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {archives.length} archived tweet{archives.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-4">
              {archives.map((archive) => (
                <ArchiveCard 
                  key={archive.tweetId} 
                  archive={archive} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Info Note */}
            <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                📦 Archived tweets are saved locally in your browser and persist even if the original is deleted.
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Archives;
