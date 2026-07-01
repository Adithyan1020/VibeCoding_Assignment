import React from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export const ProfileList = React.memo(function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white brutal-border brutal-shadow">
        <SearchX className="w-16 h-16 text-black mb-4" />
        <h3 className="text-4xl font-heading text-black uppercase tracking-tighter mb-4 text-center">NOTHING FOUND</h3>
        <p className="text-xl font-bold text-center max-w-sm">
          No creators match your search. Try different keywords or switch platforms.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12 pb-20"
    >
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={onProfileClick}
        />
      ))}
    </motion.div>
  );
});
