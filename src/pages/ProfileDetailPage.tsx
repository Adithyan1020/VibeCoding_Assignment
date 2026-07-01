import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/listStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const { addProfile, removeProfile, isProfileSaved } = useListStore();
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) return <Layout><p className="font-bold text-xl">Invalid profile</p></Layout>;
  if (!loaded) return <Layout><div className="flex justify-center py-20"><h1 className="text-4xl font-heading animate-pulse uppercase">LOADING...</h1></div></Layout>;
  if (!profileData) return <Layout><div className="bg-white p-8 brutal-border brutal-shadow text-center max-w-xl mx-auto mt-20"><h1 className="text-4xl font-heading uppercase text-brutal-red mb-6">404 NOT FOUND</h1><Link to="/" className="inline-block px-8 py-3 bg-black text-white font-bold text-xl brutal-border hover:bg-brutal-yellow hover:text-black transition-colors">GO BACK</Link></div></Layout>;

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = isProfileSaved(user.username);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-black hover:text-brutal-red mb-8 transition-colors bg-white brutal-border brutal-shadow px-4 py-2">
          <ArrowLeft className="w-6 h-6" />
          BACK
        </Link>

        {/* Mac OS Window Container */}
        <div className="bg-white brutal-border brutal-shadow overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Window Header + Profile Picture */}
          <div className="md:w-1/2 p-6 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col">
            <div className="flex gap-2 mb-8 bg-gray-200 p-2 brutal-border w-fit">
              <div className="w-4 h-4 rounded-full bg-brutal-red brutal-border"></div>
              <div className="w-4 h-4 rounded-full bg-brutal-yellow brutal-border"></div>
              <div className="w-4 h-4 rounded-full bg-brutal-green brutal-border"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative p-6 bg-brutal-red brutal-border">
                <div className="absolute inset-0 m-4 bg-brutal-yellow brutal-border pointer-events-none"></div>
                <div className="relative z-10 bg-brutal-green p-4 brutal-border">
                  <img
                    src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`;
                    }}
                    className="w-48 h-48 sm:w-64 sm:h-64 object-cover filter grayscale mix-blend-multiply"
                    alt={user.username}
                  />
                  <div className="absolute bottom-4 right-4 rotate-[-10deg]">
                    <div className="bg-white px-4 py-2 brutal-border text-center">
                      <p className="text-xs uppercase font-bold text-gray-500 mb-1">Engagement</p>
                      <p className="font-heading text-2xl">{user.engagement_rate !== undefined ? (user.engagement_rate * 100).toFixed(1) + "%" : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Info & Actions */}
          <div className="md:w-1/2 p-6 md:p-12 flex flex-col bg-gray-50">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-heading text-black uppercase tracking-tighter mb-2 flex items-center gap-4">
                {user.fullname || user.username}
                <VerifiedBadge verified={user.is_verified} />
              </h1>
              <p className="text-2xl font-bold bg-black text-white inline-block px-4 py-1 brutal-border mb-6">
                @{user.username}
              </p>
              
              <p className="text-lg leading-relaxed whitespace-pre-wrap font-sans text-gray-800">
                {user.description || "Hey folks, I am a passionate creator who loves to learn, grow and create awesome stuff. Yes I do create !! :D"}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-0 border-t-4 border-l-4 border-black mb-8 bg-white">
              <div className="p-4 border-b-4 border-r-4 border-black flex flex-col justify-center items-center">
                <span className="text-sm font-bold uppercase text-gray-500">Followers</span>
                <span className="font-heading text-3xl">{formatFollowers(user.followers)}</span>
              </div>
              <div className="p-4 border-b-4 border-r-4 border-black flex flex-col justify-center items-center">
                <span className="text-sm font-bold uppercase text-gray-500">Avg Views</span>
                <span className="font-heading text-3xl">{formatFollowers(user.avg_views || 0)}</span>
              </div>
              <div className="p-4 border-b-4 border-r-4 border-black flex flex-col justify-center items-center">
                <span className="text-sm font-bold uppercase text-gray-500">Platform</span>
                <span className="font-heading text-3xl uppercase">{platform}</span>
              </div>
              <div className="p-4 border-b-4 border-r-4 border-black flex flex-col justify-center items-center bg-brutal-yellow">
                <span className="text-sm font-bold uppercase text-black">Posts</span>
                <span className="font-heading text-3xl text-black">{user.posts_count || "N/A"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 py-4 px-6 bg-brutal-red text-white text-2xl font-heading uppercase brutal-border brutal-shadow-hover hover:bg-black transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProfile(user.username);
                }}
              >
                REJECT
              </button>
              
              <button
                className={`flex-1 py-4 px-6 text-white text-2xl font-heading uppercase brutal-border brutal-shadow-hover transition-all ${
                  isSaved ? "bg-black" : "bg-brutal-purple hover:bg-black"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSaved) addProfile(user);
                }}
              >
                {isSaved ? "SHORTLISTED" : "SHORTLIST"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
