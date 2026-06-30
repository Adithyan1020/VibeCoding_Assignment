import React from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { useListStore } from "@/store/listStore";
import { motion } from "framer-motion";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export const ProfileCard = React.memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileSaved } = useListStore();
  const isSaved = isProfileSaved(profile.username);

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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      onClick={handleClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col h-full"
      data-search={searchQuery}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleBookmark}
          className={`p-2.5 rounded-full shadow-sm transition-all duration-200 ${
            isSaved 
              ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md" 
              : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-md border border-gray-100"
          }`}
          title={isSaved ? "Remove from List" : "Add to List"}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img 
          src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`} 
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`;
          }}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-50 shadow-sm group-hover:border-indigo-100 transition-colors" 
          alt={profile.username}
        />
        <div className="flex-1 min-w-0 pr-8">
          <div className="font-bold text-lg text-gray-900 truncate flex items-center gap-1">
            @{profile.username}
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-sm text-gray-500 truncate">{profile.fullname}</div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Followers</p>
          <p className="text-lg font-bold text-gray-900">{formatFollowers(profile.followers)}</p>
        </div>
        
        {profile.engagement_rate !== undefined && (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Engagement</p>
            <p className="text-lg font-bold text-indigo-600">
              {(profile.engagement_rate * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
});
