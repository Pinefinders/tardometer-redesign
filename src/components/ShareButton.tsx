import { Twitter } from "lucide-react";

interface ShareButtonProps {
  score: number;
  type: 'tweet' | 'user';
  tweetUrl?: string;
  username?: string;
}

const ShareButton = ({ score, type, tweetUrl, username }: ShareButtonProps) => {
  const getEmoji = (s: number) => {
    if (s <= 24) return "😭";
    if (s <= 75) return "😐";
    return "🗿";
  };

  const getLabel = (s: number) => {
    if (s <= 24) return "TARD";
    if (s <= 75) return "MID";
    return "BASED";
  };

  const emoji = getEmoji(score);
  const label = getLabel(score);

  const getTweetText = () => {
    if (type === 'tweet' && tweetUrl) {
      return `This tweet scored ${score} (${label}) on the Tard ↔ Based scale! ${emoji}\n\nCheck it out: https://tardometer.lovable.app\n\n${tweetUrl}`;
    } else if (type === 'user' && username) {
      return `@${username} has an average Tard score of ${score} (${label})! ${emoji}\n\nAnalyze your favorite accounts: https://tardometer.lovable.app`;
    }
    return `I just used the Tardometer! ${emoji}\n\nhttps://tardometer.lovable.app`;
  };

  const handleShare = () => {
    const text = encodeURIComponent(getTweetText());
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold text-sm transition-colors shadow-lg hover:shadow-xl"
    >
      <Twitter className="w-4 h-4" fill="currentColor" />
      Share on X
    </button>
  );
};

export default ShareButton;
