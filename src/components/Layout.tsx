import { useState, type ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, X, ChevronRight, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useListStore } from "@/store/listStore";
import { formatFollowers } from "@/utils/formatters";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { savedProfiles, removeProfile } = useListStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsSidebarOpen(true);
    window.addEventListener('openSidebar', handleOpen);
    return () => window.removeEventListener('openSidebar', handleOpen);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <header className="pt-8 px-4 sm:px-8 lg:px-12 max-w-[1600px] w-full mx-auto">
        <Link to="/" className="inline-block">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading text-black tracking-tighter uppercase leading-none" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}>
            TOP SEARCH
          </h1>
        </Link>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-32">
        {children}
      </main>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-brutal-yellow brutal-border z-50 flex flex-col shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="p-6 border-b-4 border-black bg-white flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-heading text-black uppercase tracking-tighter">Shortlist</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 brutal-border bg-brutal-red text-white hover:bg-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {savedProfiles.length === 0 ? (
                  <div className="text-center py-12 bg-white brutal-border brutal-shadow">
                    <Bookmark className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold text-xl">Empty List</p>
                  </div>
                ) : (
                  savedProfiles.map((profile) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={profile.user_id}
                      className="group flex flex-col bg-white brutal-border brutal-shadow cursor-pointer hover:-translate-y-1 transition-transform"
                      onClick={() => {
                        setIsSidebarOpen(false);
                        navigate(`/profile/${profile.username}`);
                      }}
                    >
                      <div className="flex items-center gap-4 p-4">
                        <img
                          src={profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=random`;
                          }}
                          className="w-16 h-16 brutal-border object-cover bg-brutal-blue"
                          alt={profile.username}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-black truncate">@{profile.username}</h3>
                          <p className="text-sm truncate text-gray-600">{profile.fullname}</p>
                          <p className="text-xs font-bold mt-1 bg-brutal-purple text-white inline-block px-2 py-0.5 brutal-border">
                            {formatFollowers(profile.followers)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-4 border-black flex">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProfile(profile.username);
                          }}
                          className="flex-1 p-3 bg-brutal-red text-white font-bold border-r-4 border-black hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" /> REJECT
                        </button>
                        <div className="p-3 bg-white flex items-center justify-center">
                          <ChevronRight className="w-6 h-6" />
                        </div>
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
