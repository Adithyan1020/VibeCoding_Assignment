import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/listStore";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, BookmarkPlus, BookmarkCheck, Users, TrendingUp, Image, Heart, MessageCircle, PlaySquare, Target, type LucideIcon } from "lucide-react";

const MetricCard = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: React.ReactNode }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 text-gray-500 mb-2">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-xl font-bold text-gray-900">{value}</div>
  </div>
);

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

  if (!username) return <Layout><p>Invalid profile</p><Link to="/">Back</Link></Layout>;
  if (!loaded) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div></Layout>;
  if (!profileData) return <Layout><div className="text-center py-20"><p className="text-red-600 mb-4">Could not load profile details for {username}</p><Link to="/" className="text-indigo-600 font-medium">← Back to search</Link></div></Layout>;

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = isProfileSaved(user.username);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner (Simulated) */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 w-full" />
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`;
                }}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-white"
                alt={user.username}
              />
              
              <div className="flex gap-3">
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Profile
                  </a>
                )}
                <button
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
                    isSaved 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                  }`}
                  onClick={() => isSaved ? removeProfile(user.username) : addProfile(user)}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  {isSaved ? "Saved to List" : "Save Profile"}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {user.fullname}
                <VerifiedBadge verified={user.is_verified} />
              </h1>
              <p className="text-lg text-gray-500 font-medium">@{user.username} • <span className="capitalize">{platform}</span></p>
              
              {user.description && (
                <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {user.description}
                </p>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={Users} label="Followers" value={formatFollowers(user.followers)} />
              <MetricCard icon={TrendingUp} label="Engagement" value={formatEngagementRate(user.engagement_rate)} />
              {user.posts_count !== undefined && <MetricCard icon={Image} label="Total Posts" value={user.posts_count.toLocaleString()} />}
              {user.avg_likes !== undefined && <MetricCard icon={Heart} label="Avg. Likes" value={formatFollowers(user.avg_likes)} />}
              {user.avg_comments !== undefined && <MetricCard icon={MessageCircle} label="Avg. Comments" value={formatFollowers(user.avg_comments)} />}
              {user.avg_views !== undefined && user.avg_views > 0 && <MetricCard icon={PlaySquare} label="Avg. Views" value={formatFollowers(user.avg_views)} />}
              {user.engagements !== undefined && <MetricCard icon={Target} label="Engagements" value={formatFollowers(user.engagements)} />}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
