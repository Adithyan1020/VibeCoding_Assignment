import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, Camera, Video, PlaySquare } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const getPlatformIcon = (p: Platform) => {
  if (p === "instagram") return <Camera className="w-5 h-5" />;
  if (p === "youtube") return <Video className="w-5 h-5" />;
  return <PlaySquare className="w-5 h-5" />; // Tiktok alternative
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="mb-2 space-y-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              selected === p 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105" 
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:scale-105"
            }`}
          >
            {getPlatformIcon(p)}
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>
      
      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators by username or name..."
          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder-gray-400 text-lg"
        />
      </div>
    </div>
  );
}
