import { useState } from "react";

const BookmarkletSection = () => {
  const [isDragging, setIsDragging] = useState(false);

  // Always use production domain for bookmarklet
  const baseUrl = 'https://tardometer.com';

  // Bookmarklet code - must be single line with no extra whitespace
  const bookmarkletCode = `javascript:(function(){var url=window.location.href;if(!/(?:twitter\\.com|x\\.com)\\/\\w+\\/status\\/\\d+/.test(url)){alert('Please navigate to a tweet first!');return;}window.open('${baseUrl}/?tweet='+encodeURIComponent(url),'_blank','width=600,height=700');})();`;


  return (
    <>
      {/* Mobile message - only visible on small screens */}
      <div className="block sm:hidden text-center">
        <p className="text-sm text-muted-foreground">
          📱 Paste any tweet URL above to get instant scores!
        </p>
      </div>

      {/* Desktop bookmarklet - hidden on mobile */}
      <section className="hidden sm:block w-full max-w-xl">
        <div className="glass-card p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Quick Score Bookmarklet
            </h2>
            <p className="text-muted-foreground text-sm">
              Score any tweet or profile instantly while browsing Twitter/X
            </p>
          </div>

          {/* Bookmarklet Button */}
          <div className="flex justify-center mb-4">
            <a
              href={bookmarkletCode}
              draggable="true"
              onDragStart={(e) => {
                setIsDragging(true);
                e.dataTransfer.setData('text/uri-list', bookmarkletCode);
                e.dataTransfer.setData('text/plain', 'Tard Score');
                e.dataTransfer.effectAllowed = 'copyLink';
              }}
              onDragEnd={() => setIsDragging(false)}
              className={`
                inline-flex items-center gap-2 px-6 py-3 
                bg-gradient-to-r from-destructive via-accent to-primary
                text-white font-bold text-lg rounded-xl
                shadow-lg cursor-grab active:cursor-grabbing
                transition-all duration-300
                hover:scale-105 hover:shadow-xl
                select-none
                ${isDragging ? 'scale-110 shadow-2xl opacity-80' : ''}
              `}
              title="Drag me to your bookmarks bar!"
            >
              <span className="text-xl">📊</span>
              <span>Tard Score</span>
            </a>
          </div>

          {/* Simple instruction */}
          <p className="text-sm text-muted-foreground text-center">
            Drag to bookmarks → Click on any tweet
          </p>
        </div>
      </section>
    </>
  );
};

export default BookmarkletSection;
