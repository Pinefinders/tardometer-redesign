import { useState, useEffect } from "react";
import { Save, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  type: 'tweet' | 'user';
  identifier: string; // tweetId or username
}

const getStorageKey = (type: 'tweet' | 'user', identifier: string) => {
  return `note_${type}_${identifier}`;
};

export const hasNote = (type: 'tweet' | 'user', identifier: string): boolean => {
  const key = getStorageKey(type, identifier);
  const saved = localStorage.getItem(key);
  return saved !== null && saved.trim().length > 0;
};

const NotesSection = ({ type, identifier }: NotesSectionProps) => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const storageKey = getStorageKey(type, identifier);

  // Load existing note on mount
  useEffect(() => {
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      setNote(existing);
      setSavedNote(existing);
    } else {
      setNote("");
      setSavedNote(null);
    }
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, note);
    setSavedNote(note);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = () => {
    localStorage.removeItem(storageKey);
    setNote("");
    setSavedNote(null);
  };

  const hasChanges = note !== (savedNote ?? "");
  const placeholder = type === 'tweet' 
    ? "Add your private notes about this tweet..." 
    : "Add your private notes about this user...";

  return (
    <div className="mt-6 pt-6 border-t border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📝</span>
        <h3 className="text-sm font-semibold text-foreground">Private Notes</h3>
        {savedNote && (
          <span className="text-xs text-muted-foreground">(saved locally)</span>
        )}
      </div>
      
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] bg-secondary/50 border-border/50 resize-y"
      />
      
      <div className="flex items-center gap-2 mt-3">
        <Button
          onClick={handleSave}
          disabled={!note.trim() || !hasChanges}
          size="sm"
          variant="outline"
          className="gap-1.5"
        >
          {showSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Note
            </>
          )}
        </Button>
        
        {savedNote && (
          <Button
            onClick={handleDelete}
            size="sm"
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
