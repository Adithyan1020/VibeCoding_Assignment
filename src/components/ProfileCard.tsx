import React from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { useListStore } from "@/store/listStore";
import { motion } from "framer-motion";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

const colors = ["bg-brutal-red", "bg-brutal-green", "bg-brutal-blue", "bg-brutal-purple", "bg-brutal-pink"];

export const ProfileCard = React.memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileSaved } = useListStore();
  const isSaved = isProfileSaved(profile.username);

  // Pick a stable random color based on username length
  const bgColor = colors[profile.username.length % colors.length];
  // Stable random rotation between -2 and 2 degrees
  const rotation = (profile.username.length % 5) - 2;

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeProfile(profile.username);
    } else {
      addProfile(profile);
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 }
      }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      style={{ rotate: rotation }}
      onClick={handleClick}
      className={`group bg-white p-4 brutal-border brutal-shadow cursor-pointer transition-transform duration-200 flex flex-col items-center gap-4 ${isSaved ? 'ring-4 ring-black' : ''}`}
      data-search={searchQuery}
    >
      <div className={`w-full aspect-square ${bgColor} brutal-border p-4 flex flex-col justify-end relative overflow-hidden`}>
        <img 
          src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`} 
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`;
          }}
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal transition-all duration-300" 
          alt={profile.username}
        />
        <div className="relative z-10">
          <p className="text-white font-heading text-2xl uppercase tracking-tighter leading-tight" style={{ textShadow: "2px 2px 0px black" }}>
            {profile.fullname || profile.username}
          </p>
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center px-1">
        <div>
          <p className="text-xl font-bold font-heading uppercase text-black max-w-[200px] truncate">@{profile.username}</p>
        </div>
        <button
          onClick={handleBookmark}
          className={`p-2 brutal-border font-bold uppercase transition-colors ${
            isSaved 
              ? "bg-black text-white" 
              : "bg-brutal-yellow text-black hover:bg-black hover:text-white"
          }`}
          title={isSaved ? "Remove from List" : "Add to List"}
        >
          {isSaved ? "SAVED" : "SAVE"}
        </button>
      </div>
    </motion.div>
  );
});
