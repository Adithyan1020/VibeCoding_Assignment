import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Bookmark, X, ChevronRight, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useListStore } from "@/store/listStore";
import { formatFollowers } from "@/utils/formatters";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { savedProfiles, removeProfile } = useListStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-xl font-bold tracking-tight">Wobb Influencers</span>
            </Link>
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full font-medium transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedProfiles.length > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {savedProfiles.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>}
            {description && <p className="mt-2 text-gray-500 text-lg">{description}</p>}
          </div>
        )}
        {children}
      </main>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saved Profiles</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your shortlisted influencers</p>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500">Your list is empty.</p>
                    <p className="text-sm text-gray-400 mt-1">Add profiles from the search page.</p>
                  </div>
                ) : (
                  savedProfiles.map((profile) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={profile.user_id}
                      className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                      onClick={() => {
                        setIsSidebarOpen(false);
                        navigate(`/profile/${profile.username}`);
                      }}
                    >
                      <img
                        src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`}
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`;
                        }}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                        alt={profile.username}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1">
                          @{profile.username}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{profile.fullname}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatFollowers(profile.followers)} followers</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProfile(profile.username);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
