import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, Camera, Video, PlaySquare } from "lucide-react";
import { useListStore } from "@/store/listStore";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const getPlatformIcon = (p: Platform) => {
  if (p === "instagram") return <Camera className="w-5 h-5" />;
  if (p === "youtube") return <Video className="w-5 h-5" />;
  return <PlaySquare className="w-5 h-5" />; 
};

const getPlatformColor = (p: Platform) => {
  if (p === "instagram") return "bg-brutal-pink";
  if (p === "youtube") return "bg-brutal-red text-white";
  return "bg-black text-white";
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const { savedProfiles } = useListStore();

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-4">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-lg brutal-border transition-transform hover:-translate-y-1 ${
              selected === p 
                ? `${getPlatformColor(p)} brutal-shadow-hover` 
                : "bg-white text-black brutal-shadow hover:bg-gray-50"
            }`}
          >
            {getPlatformIcon(p)}
            {getPlatformLabel(p).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bottom Floating Navigation (matches Figma) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none z-40 flex justify-center">
        <div className="pointer-events-auto bg-white brutal-border brutal-shadow-hover flex items-center p-2 sm:p-3 gap-2 sm:gap-4 max-w-4xl w-full flex-wrap sm:flex-nowrap">
          <button className="text-gray-500 font-bold px-2 sm:px-4 py-2 hover:text-black transition-colors flex items-center gap-2">
            <span className="hidden sm:inline">Home</span>
          </button>
          
          <button
            onClick={() => window.dispatchEvent(new Event('openSidebar'))}
            className="bg-brutal-green text-white font-bold px-4 sm:px-6 py-2 rounded-md brutal-border hover:bg-black transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Shortlisted</span>
            {savedProfiles.length > 0 && (
              <span className="bg-white text-brutal-green text-xs px-2 py-0.5 rounded-full font-black brutal-border">
                {savedProfiles.length}
              </span>
            )}
          </button>
          
          <div className="flex-1 w-full sm:w-auto border-2 border-dashed border-gray-400 rounded-md px-4 py-2 flex items-center gap-2 focus-within:border-black transition-colors bg-white">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..." 
              className="bg-transparent w-full outline-none font-bold placeholder-gray-400 text-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
