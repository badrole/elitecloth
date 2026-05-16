"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { getAllTags } from "@/lib/supabase";

interface TagPickerProps {
  value: string; // comma-separated
  onChange: (value: string) => void;
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const selectedTags = value.split(",").map((t) => t.trim()).filter(Boolean);

  useEffect(() => {
    getAllTags().then(setExistingTags);
  }, []);

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onChange(updated.join(", "));
  };

  const addNewTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || selectedTags.includes(trimmed)) return;
    onChange([...selectedTags, trimmed].join(", "));
    setNewTag("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  return (
    <div className="space-y-3">
      {/* Existing tags as chips */}
      {existingTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-warm-white text-ink-black"
                  : "border border-border-subtle text-warm-white/50 hover:border-border-hover hover:text-warm-white"
              }`}
            >
              {tag}
              {selectedTags.includes(tag) && <X size={10} className="ml-1 inline" />}
            </button>
          ))}
        </div>
      )}

      {/* New tag input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-border-subtle bg-ink-black px-4 py-2.5 text-sm focus:border-warm-white focus:outline-none"
          placeholder="Tambah tag baru..."
        />
        <button
          type="button"
          onClick={addNewTag}
          disabled={!newTag.trim()}
          className="rounded-xl border border-border-subtle px-3 py-2.5 text-warm-white/60 transition-colors hover:border-border-hover hover:text-warm-white disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Selected preview */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-warm-white/30">Terpilih:</span>
          {selectedTags.map((tag) => (
            <span key={tag} className="rounded-full bg-warm-white/10 px-2 py-0.5 text-[10px] text-warm-white/70">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
