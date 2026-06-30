import { useState, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { Users } from "lucide-react";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, searchQuery), [allProfiles, searchQuery]);

  const handleProfileClick = (username: string) => {
    console.log("Clicked profile:", username);
  };

  return (
    <Layout 
      title="Discover Creators" 
      description="Find and shortlist top influencers across major social platforms."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
        <PlatformFilter
          selected={platform}
          onChange={(p) => {
            setPlatform(p);
            setSearchQuery("");
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Results
        </h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {filtered.length} of {allProfiles.length} profiles
        </span>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
