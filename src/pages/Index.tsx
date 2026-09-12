import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, User, Search, Upload, LogIn, Home, Compass, Users, Bookmark, Menu, X } from 'lucide-react';

const Index = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const videos = [
    {
      id: 1,
      creator: 'Alex Chen',
      handle: '@alexchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      likes: '2.4M',
      comments: '145K',
      shares: '89K',
      description: 'POV: You just discovered the best app ever 🎬',
      bg: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=900&fit=crop',
    },
    {
      id: 2,
      creator: 'Maya Patel',
      handle: '@mayavisuals',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      likes: '1.8M',
      comments: '203K',
      shares: '112K',
      description: 'Creating magic on Dhawan ✨',
      bg: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=900&fit=crop',
    },
    {
      id: 3,
      creator: 'Jordan Lee',
      handle: '@jordanlee',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      likes: '3.1M',
      comments: '267K',
      shares: '198K',
      description: 'The future of short-form content 🚀',
      bg: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=900&fit=crop',
    },
  ];

  const currentVideo = videos[activeVideo];

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">Dhawan</span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-card border border-border rounded-full px-4 py-2 w-64">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search creators..."
              className="bg-transparent outline-none text-sm w-full text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors font-semibold text-sm">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-sm">
              Sign In
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Side Navigation - Hidden on mobile */}
        <div className="hidden md:flex flex-col w-20 bg-card border-r border-border px-3 py-6 gap-6 fixed left-0 top-16 bottom-0 h-[calc(100vh-64px)]">
          <nav className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors group">
              <Home className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors group">
              <Compass className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Explore</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors group">
              <Users className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Friends</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors group">
              <Bookmark className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Saved</span>
            </div>
          </nav>
        </div>

        {/* Main Feed */}
        <div className="flex-1 md:ml-20 flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
          <div className="w-full max-w-md h-[calc(100vh-64px)] relative">
            {/* Video Container */}
            <div
              className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-3xl"
              style={{
                backgroundImage: `url(${currentVideo.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

              {/* Video Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top - Creator Info */}
                <div className="flex items-center gap-3 mt-12">
                  <img
                    src={currentVideo.avatar}
                    alt={currentVideo.creator}
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{currentVideo.creator}</p>
                    <p className="text-xs text-muted-foreground">{currentVideo.handle}</p>
                  </div>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:opacity-90 transition-opacity">
                    Follow
                  </button>
                </div>

                {/* Middle - Description */}
                <div className="max-w-xs">
                  <p className="text-sm font-medium leading-snug">{currentVideo.description}</p>
                </div>

                {/* Bottom - Interaction Stats */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="font-semibold">{currentVideo.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold">{currentVideo.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span className="font-semibold">{currentVideo.shares}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-6">
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">{currentVideo.likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">{currentVideo.comments}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Share2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">{currentVideo.shares}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Bookmark className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                </div>
              </button>
            </div>

            {/* Video Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVideo(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeVideo
                      ? 'bg-primary w-6'
                      : 'bg-white/40 w-1.5 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-30 md:hidden flex flex-col gap-4 p-4">
          <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Search creators..."
              className="bg-transparent outline-none text-sm w-full text-foreground placeholder-muted-foreground"
            />
          </div>

          <nav className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <Home className="w-5 h-5 text-secondary" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <Compass className="w-5 h-5 text-secondary" />
              <span>Explore</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <Users className="w-5 h-5 text-secondary" />
              <span>Friends</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <Bookmark className="w-5 h-5 text-secondary" />
              <span>Saved</span>
            </div>
          </nav>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-semibold mt-2">
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
