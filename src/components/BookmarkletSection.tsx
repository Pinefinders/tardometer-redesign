import { useState } from "react";

const BookmarkletSection = () => {
  const [isDragging, setIsDragging] = useState(false);

  // Always use production domain for bookmarklet
  const baseUrl = 'https://tardometer.com';

  // Bookmarklet code - minified JavaScript
  const bookmarkletCode = `javascript:(function(){
    var url = window.location.href;
    if(!/(?:twitter\\.com|x\\.com)\\/\\w+\\/status\\/\\d+/.test(url)){
      alert('Please navigate to a tweet first!');
      return;
    }
    window.open('${baseUrl}/?tweet=' + encodeURIComponent(url), '_blank', 'width=600,height=700');
  })();`;

  const steps = [
    { emoji: "👆", title: "Drag", description: "Drag the button to your bookmarks bar" },
    { emoji: "🐦", title: "Browse", description: "Go to any tweet on Twitter/X" },
    { emoji: "⚡", title: "Click", description: "Click the bookmark → Instant score!" },
  ];

  return (
    <section className="w-full max-w-xl">
      <div className="glass-card p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Quick Score Bookmarklet
          </h2>
          <p className="text-muted-foreground text-sm">
            Score any tweet instantly while browsing Twitter/X
          </p>
        </div>

        {/* Bookmarklet Button */}
        <div className="flex justify-center mb-8">
          <a
            href={bookmarkletCode}
            onClick={(e) => e.preventDefault()}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            className={`
              inline-flex items-center gap-2 px-6 py-3 
              bg-gradient-to-r from-destructive via-accent to-primary
              text-white font-bold text-lg rounded-xl
              shadow-lg cursor-grab active:cursor-grabbing
              transition-all duration-300
              hover:scale-105 hover:shadow-xl
              ${isDragging ? 'scale-110 shadow-2xl opacity-80' : ''}
            `}
            title="Drag me to your bookmarks bar!"
          >
            <span className="text-xl">📊</span>
            <span>Tard Score</span>
          </a>
        </div>

        {/* Drag instruction arrow */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="animate-bounce-slow inline-block">⬆️</span>
            Drag this button to your bookmarks bar
            <span className="animate-bounce-slow inline-block">⬆️</span>
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="relative">
                {/* Step number */}
                <div className="absolute -top-2 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                {/* Emoji */}
                <div className="text-4xl mb-2">{step.emoji}</div>
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-tight">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Arrow connectors between steps */}
        <div className="flex justify-center gap-16 -mt-16 mb-4 pointer-events-none">
          <span className="text-muted-foreground text-2xl">→</span>
          <span className="text-muted-foreground text-2xl">→</span>
        </div>

        {/* Note */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Works on both twitter.com and x.com. 
            Make sure you're viewing a specific tweet, not a profile or timeline.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookmarkletSection;
