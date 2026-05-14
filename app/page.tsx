"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ==================== TYPES ====================
interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'companion';
  walletBalance: number;
}

interface Companion {
  id: string;
  stageName: string;
  location: string;
  hourlyRate: number;
  bio: string;
  services: string[];
  photos: string[];
  verificationStatus: 'pending' | 'verified';
  availability: string[];
  rating: number;
  ratingCount: number;
  createdAt: string;
}

interface Booking {
  id: string;
  clientId: string;
  companionId: string;
  companionName: string;
  date: string;
  time: string;
  duration: number;
  totalCredits: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface Post {
  id: string;
  userId: string;
  companionName: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  comments: any[];
  createdAt: string;
}

interface ExclusiveContent {
  id: string;
  companionId: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  price: number;
  unlockedBy: string[];
}

// ==================== INITIAL DATA ====================
const initialCompanions: Companion[] = [
  { id: 'comp1', stageName: '@BustyLwa', location: 'Johannesburg', hourlyRate: 195, bio: 'Curvy queen with stunning curves and tattoos.', services: ['Private Evenings', 'Travel Companion'], photos: ['https://picsum.photos/id/1011/600/800'], verificationStatus: 'verified', availability: ['2026-05-15'], rating: 4.9, ratingCount: 87, createdAt: '2025-01-10' },
  { id: 'comp2', stageName: '@Daria', location: 'Cape Town', hourlyRate: 210, bio: 'Stunning mixed beauty passionate about luxury experiences.', services: ['Fine Dining', 'Overnight Stays'], photos: ['https://picsum.photos/id/1005/600/800'], verificationStatus: 'verified', availability: ['2026-05-14'], rating: 4.8, ratingCount: 64, createdAt: '2025-02-05' },
  { id: 'comp3', stageName: '@LanaSway', location: 'Stellenbosch', hourlyRate: 185, bio: 'Elegant companion who loves wine tasting.', services: ['Wine Tasting', 'Romantic Getaways'], photos: ['https://picsum.photos/id/1009/600/800'], verificationStatus: 'verified', availability: ['2026-05-15'], rating: 4.7, ratingCount: 52, createdAt: '2025-03-12' },
  { id: 'comp4', stageName: '@Kira', location: 'Durban', hourlyRate: 175, bio: 'Warm and curvaceous with relaxing massages.', services: ['Relaxing Massage', 'Beach Evenings'], photos: ['https://picsum.photos/id/160/600/800'], verificationStatus: 'verified', availability: ['2026-05-16'], rating: 4.9, ratingCount: 71, createdAt: '2025-04-01' },
  { id: 'comp5', stageName: '@Lex', location: 'Pretoria', hourlyRate: 190, bio: 'Bold and confident for business events.', services: ['Business Events', 'Adventure Dates'], photos: ['https://picsum.photos/id/1008/600/800'], verificationStatus: 'verified', availability: ['2026-05-14'], rating: 4.6, ratingCount: 48, createdAt: '2025-04-20' },
  { id: 'comp6', stageName: '@MulanMila', location: 'Bloemfontein', hourlyRate: 165, bio: 'Exotic beauty with a wild side.', services: ['Private Relaxation', 'Weekend Getaways'], photos: ['https://picsum.photos/id/201/600/800'], verificationStatus: 'verified', availability: ['2026-05-15'], rating: 4.8, ratingCount: 39, createdAt: '2025-05-10' },
  { id: 'comp7', stageName: '@JazmynHartley', location: 'Port Elizabeth', hourlyRate: 200, bio: 'Sophisticated companion for gala events.', services: ['Gala Companion', 'Luxury Dates'], photos: ['https://picsum.photos/id/29/600/800'], verificationStatus: 'verified', availability: ['2026-05-16'], rating: 4.7, ratingCount: 55, createdAt: '2025-05-25' },
  { id: 'comp8', stageName: '@Emma', location: 'Nelspruit', hourlyRate: 180, bio: 'Sweet but naughty travel companion.', services: ['Travel Companion', 'Private Evenings'], photos: ['https://picsum.photos/id/133/600/800'], verificationStatus: 'verified', availability: ['2026-05-18'], rating: 4.5, ratingCount: 33, createdAt: '2025-06-05' },
  { id: 'comp9', stageName: '@SweetNia', location: 'Sandton', hourlyRate: 220, bio: 'High-end luxury companion.', services: ['Luxury Experiences', 'Private Evenings'], photos: ['https://picsum.photos/id/251/600/800'], verificationStatus: 'verified', availability: ['2026-05-15'], rating: 4.9, ratingCount: 92, createdAt: '2025-06-15' },
  { id: 'comp10', stageName: '@LolaVee', location: 'Midrand', hourlyRate: 170, bio: 'Playful and energetic companion.', services: ['Fun Dates', 'Overnight Stays'], photos: ['https://picsum.photos/id/177/600/800'], verificationStatus: 'verified', availability: ['2026-05-17'], rating: 4.6, ratingCount: 47, createdAt: '2025-06-28' }
];

export default function CumpaniApp() {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'dashboard' | 'community'>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'companion'>('client');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingCompanionId, setRatingCompanionId] = useState('');
  const [ratingValue, setRatingValue] = useState(5);

  // Forms
  const [authForm, setAuthForm] = useState({ name: '', email: '' });
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingDuration, setBookingDuration] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentPrice, setNewContentPrice] = useState(150);

  // Load from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: user.id,
            name: profile.full_name || user.email || 'User',
            email: user.email || '',
            role: profile.role,
            walletBalance: profile.wallet_balance || 200
          });
        }
      }

      // Load bookings, posts, etc.
      const { data: bookingsData } = await supabase.from('bookings').select('*');
      if (bookingsData) setBookings(bookingsData);
    };

    loadData();
  }, []);

  // ==================== SUPABASE FUNCTIONS ====================
  const uploadToSupabase = async (file: File, bucket: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // ==================== AUTH ====================
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: 'demo123'
      });

      if (error) return alert(error.message);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      setCurrentUser({
        id: data.user.id,
        name: profile?.full_name || data.user.email || 'User',
        email: data.user.email || '',
        role: profile?.role || 'client',
        walletBalance: profile?.wallet_balance || 200
      });

      setShowAuthModal(false);
      setCurrentView(profile?.role === 'companion' ? 'dashboard' : 'browse');

    } else {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: 'demo123'
      });

      if (error) return alert(error.message);

      await supabase.from('profiles').insert({
        id: data.user?.id,
        role: selectedRole,
        full_name: authForm.name,
        wallet_balance: selectedRole === 'client' ? 200 : 0
      });

      alert("Account created! Check your email.");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('home');
  };

  // ==================== BOOKING ====================
  const openBooking = (companion: Companion) => {
    if (!currentUser) return setShowAuthModal(true);
    if (currentUser.role !== 'client') return alert("Only clients can book");
    setSelectedCompanion(companion);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!currentUser || !selectedCompanion || !bookingDate) return;

    const total = selectedCompanion.hourlyRate * bookingDuration;
    if (currentUser.walletBalance < total) return alert("Insufficient credits!");

    const { error } = await supabase.from('bookings').insert({
      client_id: currentUser.id,
      companion_id: selectedCompanion.id,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration,
      total_credits: total,
      status: 'confirmed',
      notes: bookingNotes
    });

    if (error) return alert(error.message);

    // Update local state
    const newBooking: Booking = {
      id: 'book_' + Date.now(),
      clientId: currentUser.id,
      companionId: selectedCompanion.id,
      companionName: selectedCompanion.stageName,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration,
      totalCredits: total,
      status: 'confirmed',
      notes: bookingNotes,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    setCurrentUser({ ...currentUser, walletBalance: currentUser.walletBalance - total });
    setShowBookingModal(false);
    alert("Booking confirmed!");
  };

  // ==================== RATING ====================
  const openRating = (companionId: string) => {
    setRatingCompanionId(companionId);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    const index = companions.findIndex(c => c.id === ratingCompanionId);
    if (index === -1) return;

    const comp = companions[index];
    const newAvg = ((comp.rating * comp.ratingCount) + ratingValue) / (comp.ratingCount + 1);

    const updated = [...companions];
    updated[index] = {
      ...comp,
      rating: parseFloat(newAvg.toFixed(1)),
      ratingCount: comp.ratingCount + 1
    };

    setCompanions(updated);
    setShowRatingModal(false);
    alert("Thank you for your rating!");
  };

  // ==================== COMMUNITY ====================
  const createPost = async () => {
    if (!currentUser || !newPostContent) return;

    const { data, error } = await supabase.from('posts').insert({
      user_id: currentUser.id,
      content: newPostContent
    });

    if (error) return alert(error.message);

    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      companionName: currentUser.name,
      content: newPostContent,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    alert("Post published!");
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/cumpanilogo.svg" alt="Cumpani" className="h-9" />
            <div className="font-semibold text-2xl">Cumpani</div>
          </div>

          <div className="hidden md:flex gap-8">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#c026d3]">Home</button>
            <button onClick={() => setCurrentView('browse')} className="hover:text-[#c026d3]">Browse</button>
            <button onClick={() => setCurrentView('community')} className="hover:text-[#c026d3]">Community</button>
            {currentUser && <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#c026d3]">Dashboard</button>}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span>{currentUser.name}</span>
                <button onClick={logout} className="text-xs px-4 py-1 border rounded-full">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn-primary px-6 py-2 rounded-full">Login</button>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">☰</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      {currentView === 'home' && (
        <div className="relative h-[100vh] flex items-center justify-center">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="https://assets.mixkit.co/videos/preview/3443/3443-small.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-7xl font-bold tracking-tighter mb-6">Premium Companions.<br />Discreet Experiences.</h1>
            <button onClick={() => setCurrentView('browse')} className="btn-primary px-10 py-4 rounded-2xl text-lg">Browse Companions</button>
          </div>
        </div>
      )}

      {/* BROWSE */}
      {currentView === 'browse' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-10">Featured Companions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map((comp) => (
              <div key={comp.id} className="card rounded-3xl overflow-hidden">
                <img src={comp.photos[0]} alt={comp.stageName} className="w-full h-[420px] object-cover" />
                <div className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-2xl font-semibold">{comp.stageName}</div>
                      <div className="text-white/60">{comp.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#c026d3] text-2xl font-mono">{comp.hourlyRate}</div>
                      <div className="text-xs text-white/50">credits/hr</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-yellow-400">
                    {'★'.repeat(Math.floor(comp.rating))} 
                    <span className="text-white/60 text-sm ml-2">({comp.ratingCount})</span>
                  </div>
                  <button onClick={() => openBooking(comp)} className="mt-6 w-full btn-primary py-3 rounded-2xl">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMUNITY */}
      {currentView === 'community' && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8">Community Feed</h1>
          
          {currentUser?.role === 'companion' && (
            <div className="glass p-6 rounded-3xl mb-8">
              <textarea 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share something with your fans..."
                className="w-full bg-transparent border border-white/20 rounded-2xl p-4 h-24"
              />
              <button onClick={createPost} className="btn-primary mt-4 px-8 py-2 rounded-full">Post</button>
            </div>
          )}

          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="glass p-6 rounded-3xl">
                <div className="font-semibold mb-2">{post.companionName}</div>
                <p>{post.content}</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <button>❤️ {post.likes}</button>
                  <button>💬 {post.comments.length}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {currentView === 'dashboard' && currentUser && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-8">Dashboard</h1>
          <div className="glass p-8 rounded-3xl">
            <div className="text-3xl font-semibold">{currentUser.name}</div>
            <div className="text-white/60 mt-1 capitalize">{currentUser.role}</div>
            <div className="mt-6 text-6xl font-mono text-[#c026d3]">{currentUser.walletBalance}</div>
            <div className="text-white/60">credits available</div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="glass w-full max-w-md p-8 rounded-3xl">
            <div className="flex mb-6 border-b border-white/10">
              <button onClick={() => setAuthMode('login')} className={`flex-1 pb-4 ${authMode === 'login' ? 'border-b-2 border-[#c026d3]' : ''}`}>Login</button>
              <button onClick={() => setAuthMode('signup')} className={`flex-1 pb-4 ${authMode === 'signup' ? 'border-b-2 border-[#c026d3]' : ''}`}>Sign Up</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedRole('client')} className={`flex-1 py-2 rounded ${selectedRole === 'client' ? 'bg-white text-black' : 'bg-white/10'}`}>Client</button>
                  <button type="button" onClick={() => setSelectedRole('companion')} className={`flex-1 py-2 rounded ${selectedRole === 'companion' ? 'bg-white text-black' : 'bg-white/10'}`}>Companion</button>
                </div>
              )}
              <input type="text" placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="input w-full" required />
              <input type="email" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="input w-full" required />
              <button type="submit" className="btn-primary w-full py-3 rounded-2xl mt-4">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && selectedCompanion && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="glass w-full max-w-md p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Book {selectedCompanion.stageName}</h2>
            <div className="space-y-4">
              <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="input w-full" />
              <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="input w-full" />
              <select value={bookingDuration} onChange={e => setBookingDuration(Number(e.target.value))} className="input w-full">
                {[1,2,3,4].map(h => <option key={h} value={h}>{h} hours</option>)}
              </select>
              <textarea placeholder="Notes" value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} className="input w-full h-20" />
            </div>
            <div className="mt-6 flex gap-4">
              <button onClick={() => setShowBookingModal(false)} className="flex-1 btn-secondary py-3 rounded-2xl">Cancel</button>
              <button onClick={confirmBooking} className="flex-1 btn-primary py-3 rounded-2xl">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="glass w-full max-w-md p-8 rounded-3xl text-center">
            <h2 className="text-2xl font-bold mb-6">Rate Your Experience</h2>
            <div className="flex justify-center gap-2 text-4xl mb-6">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRatingValue(star)} className={star <= ratingValue ? 'text-yellow-400' : 'text-white/30'}>★</button>
              ))}
            </div>
            <button onClick={submitRating} className="btn-primary w-full py-3 rounded-2xl">Submit Rating</button>
          </div>
        </div>
      )}

      <footer className="text-center py-12 text-xs text-white/40">
        Cumpani © 2026 • Premium Adult Companionship • 18+
      </footer>
    </div>
  );
}