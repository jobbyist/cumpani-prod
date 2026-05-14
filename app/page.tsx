"use client";

import React, { useState, useEffect } from 'react';

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
  companionId: string;
  companionName: string;
  content: string;
  image?: string;
  likes: number;
  likedBy: string[];
  comments: { id: string; user: string; text: string }[];
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
  {
    id: 'comp1',
    stageName: '@BustyLwa',
    location: 'Johannesburg',
    hourlyRate: 195,
    bio: 'Curvy queen with stunning curves and beautiful tattoos. I love private evenings, travel, and creating unforgettable experiences.',
    services: ['Private Evenings', 'Travel Companion', 'Sensual Massage', 'Dinner Dates'],
    photos: ['https://picsum.photos/id/1011/600/800'], // Replace with your uploaded image
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-16', '2026-05-18'],
    rating: 4.9,
    ratingCount: 87,
    createdAt: '2025-01-10'
  },
  {
    id: 'comp2',
    stageName: '@Daria',
    location: 'Cape Town',
    hourlyRate: 210,
    bio: 'Stunning mixed beauty with a passion for fine dining and intimate experiences. Available for travel and luxury dates.',
    services: ['Fine Dining', 'Overnight Stays', 'Sensual Experiences', 'Travel'],
    photos: ['https://picsum.photos/id/1005/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-14', '2026-05-17', '2026-05-19'],
    rating: 4.8,
    ratingCount: 64,
    createdAt: '2025-02-05'
  },
  {
    id: 'comp3',
    stageName: '@LanaSway',
    location: 'Stellenbosch',
    hourlyRate: 185,
    bio: 'Elegant and playful companion who loves wine tasting and romantic getaways in the Winelands.',
    services: ['Wine Tasting', 'Romantic Getaways', 'Private Evenings'],
    photos: ['https://picsum.photos/id/1009/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-20'],
    rating: 4.7,
    ratingCount: 52,
    createdAt: '2025-03-12'
  },
  {
    id: 'comp4',
    stageName: '@Kira',
    location: 'Durban',
    hourlyRate: 175,
    bio: 'Warm and curvaceous with a passion for relaxing massages and genuine connection.',
    services: ['Relaxing Massage', 'Beach Evenings', 'Private Relaxation'],
    photos: ['https://picsum.photos/id/160/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-16', '2026-05-18'],
    rating: 4.9,
    ratingCount: 71,
    createdAt: '2025-04-01'
  },
  {
    id: 'comp5',
    stageName: '@Lex',
    location: 'Pretoria',
    hourlyRate: 190,
    bio: 'Bold and confident companion perfect for business events and adventurous dates.',
    services: ['Business Events', 'Adventure Dates', 'Private Evenings'],
    photos: ['https://picsum.photos/id/1008/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-14', '2026-05-22'],
    rating: 4.6,
    ratingCount: 48,
    createdAt: '2025-04-20'
  },
  {
    id: 'comp6',
    stageName: '@MulanMila',
    location: 'Bloemfontein',
    hourlyRate: 165,
    bio: 'Exotic beauty with a wild side. Specializes in private relaxation and weekend getaways.',
    services: ['Private Relaxation', 'Weekend Getaways', 'Dinner & Conversation'],
    photos: ['https://picsum.photos/id/201/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-23'],
    rating: 4.8,
    ratingCount: 39,
    createdAt: '2025-05-10'
  },
  {
    id: 'comp7',
    stageName: '@JazmynHartley',
    location: 'Port Elizabeth',
    hourlyRate: 200,
    bio: 'Sophisticated and passionate. Perfect for gala events and luxury intimate experiences.',
    services: ['Gala Companion', 'Luxury Dates', 'Overnight Stays'],
    photos: ['https://picsum.photos/id/29/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-16', '2026-05-21'],
    rating: 4.7,
    ratingCount: 55,
    createdAt: '2025-05-25'
  },
  {
    id: 'comp8',
    stageName: '@Emma',
    location: 'Nelspruit',
    hourlyRate: 180,
    bio: 'Sweet but naughty companion who loves travel and creating magical private moments.',
    services: ['Travel Companion', 'Private Evenings', 'Adventure Dates'],
    photos: ['https://picsum.photos/id/133/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-18', '2026-05-24'],
    rating: 4.5,
    ratingCount: 33,
    createdAt: '2025-06-05'
  },
  {
    id: 'comp9',
    stageName: '@SweetNia',
    location: 'Sandton',
    hourlyRate: 220,
    bio: 'High-end luxury companion known for discretion and unforgettable experiences.',
    services: ['Luxury Experiences', 'Private Evenings', 'Travel'],
    photos: ['https://picsum.photos/id/251/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-20', '2026-05-25'],
    rating: 4.9,
    ratingCount: 92,
    createdAt: '2025-06-15'
  },
  {
    id: 'comp10',
    stageName: '@LolaVee',
    location: 'Midrand',
    hourlyRate: 170,
    bio: 'Playful and energetic companion who loves fun dates and overnight stays.',
    services: ['Fun Dates', 'Overnight Stays', 'Private Evenings'],
    photos: ['https://picsum.photos/id/177/600/800'],
    verificationStatus: 'verified',
    availability: ['2026-05-17', '2026-05-22'],
    rating: 4.6,
    ratingCount: 47,
    createdAt: '2025-06-28'
  }
];

const initialPosts: Post[] = [
  {
    id: 'post1',
    companionId: 'comp1',
    companionName: '@BustyLwa',
    content: 'Just had the most amazing private evening in Sandton! Who wants to be next? 💕',
    image: 'https://picsum.photos/id/1011/600/400',
    likes: 124,
    likedBy: [],
    comments: [],
    createdAt: '2026-05-10'
  }
];

export default function CumpaniApp() {
  // ==================== STATE ====================
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'dashboard' | 'community'>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'companion'>('client');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingCompanionId, setRatingCompanionId] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Booking form
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingDuration, setBookingDuration] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');

  // Auth form
  const [authForm, setAuthForm] = useState({
    name: '', email: '', stageName: '', location: '', hourlyRate: 150, bio: ''
  });

  // Community post form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  // Exclusive content form
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentType, setNewContentType] = useState<'image' | 'video'>('image');
  const [newContentPrice, setNewContentPrice] = useState(150);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    const savedUser = localStorage.getItem('cumpani_user');
    const savedBookings = localStorage.getItem('cumpani_bookings');
    const savedPosts = localStorage.getItem('cumpani_posts');
    const savedContent = localStorage.getItem('cumpani_exclusive');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedContent) setExclusiveContent(JSON.parse(savedContent));
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('cumpani_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cumpani_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cumpani_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('cumpani_exclusive', JSON.stringify(exclusiveContent));
  }, [exclusiveContent]);

  // ==================== HELPER FUNCTIONS ====================
  const showToast = (message: string) => {
    alert(message); // Replace with better toast later
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cumpani_user');
    setCurrentView('home');
  };

  // ==================== AUTH ====================
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (authForm.email.includes('demo')) {
        const demoUser: User = {
          id: 'demo_' + Date.now(),
          name: authForm.email.includes('client') ? 'Jordan Vale' : 'Sophia Laurent',
          email: authForm.email,
          role: authForm.email.includes('client') ? 'client' : 'companion',
          walletBalance: 450
        };
        setCurrentUser(demoUser);
        setShowAuthModal(false);
        setCurrentView(authForm.email.includes('client') ? 'browse' : 'dashboard');
      }
    } else {
      // Signup logic (simplified)
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: authForm.name,
        email: authForm.email,
        role: selectedRole,
        walletBalance: selectedRole === 'client' ? 200 : 0
      };
      setCurrentUser(newUser);
      setShowAuthModal(false);
      setCurrentView(selectedRole === 'client' ? 'browse' : 'dashboard');
    }
  };

  // ==================== BOOKING ====================
  const openBooking = (companion: Companion) => {
    if (!currentUser) return setShowAuthModal(true);
    if (currentUser.role !== 'client') return showToast("Only clients can book");
    setSelectedCompanion(companion);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!currentUser || !selectedCompanion || !bookingDate) return;

    const total = selectedCompanion.hourlyRate * bookingDuration;
    if (currentUser.walletBalance < total) {
      return showToast("Insufficient credits!");
    }

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
    showToast("Booking confirmed!");
    setTimeout(() => setCurrentView('dashboard'), 800);
  };

  // ==================== RATING SYSTEM ====================
  const openRatingModal = (companionId: string) => {
    setRatingCompanionId(companionId);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    const companionIndex = companions.findIndex(c => c.id === ratingCompanionId);
    if (companionIndex === -1) return;

    const newRating = (companions[companionIndex].rating * companions[companionIndex].ratingCount + ratingValue) / (companions[companionIndex].ratingCount + 1);

    const updatedCompanions = [...companions];
    updatedCompanions[companionIndex] = {
      ...updatedCompanions[companionIndex],
      rating: parseFloat(newRating.toFixed(1)),
      ratingCount: updatedCompanions[companionIndex].ratingCount + 1
    };

    setCompanions(updatedCompanions);
    setShowRatingModal(false);
    setRatingComment('');
    showToast("Thank you for your rating!");
  };

  // ==================== COMMUNITY FEED ====================
  const createPost = () => {
    if (!currentUser || currentUser.role !== 'companion' || !newPostContent) return;

    const newPost: Post = {
      id: 'post_' + Date.now(),
      companionId: currentUser.id,
      companionName: currentUser.name,
      content: newPostContent,
      image: newPostImage || undefined,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostImage('');
    showToast("Post published!");
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  // ==================== EXCLUSIVE CONTENT ====================
  const uploadExclusiveContent = () => {
    if (!currentUser || currentUser.role !== 'companion' || !newContentTitle) return;

    const newContent: ExclusiveContent = {
      id: 'exc_' + Date.now(),
      companionId: currentUser.id,
      title: newContentTitle,
      type: newContentType,
      url: 'https://picsum.photos/id/1015/800/600', // Replace with real upload
      price: newContentPrice,
      unlockedBy: []
    };

    setExclusiveContent(prev => [...prev, newContent]);
    setNewContentTitle('');
    showToast("Exclusive content uploaded!");
  };

  const unlockContent = (content: ExclusiveContent) => {
    if (!currentUser) return;
    if (currentUser.walletBalance < content.price) return showToast("Insufficient credits");

    setCurrentUser({ ...currentUser, walletBalance: currentUser.walletBalance - content.price });
    setExclusiveContent(prev => prev.map(c => 
      c.id === content.id ? { ...c, unlockedBy: [...c.unlockedBy, currentUser.id] } : c
    ));
    showToast("Content unlocked!");
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#c026d3]">Home</button>
            <button onClick={() => setCurrentView('browse')} className="hover:text-[#c026d3]">Browse</button>
            <button onClick={() => setCurrentView('community')} className="hover:text-[#c026d3]">Community</button>
            {currentUser && (
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#c026d3]">Dashboard</button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{currentUser.name}</span>
                <button onClick={logout} className="text-xs px-4 py-1 border rounded-full">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn-primary px-6 py-2 rounded-full">
                Login
              </button>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">☰</button>
          </div>
        </div>
      </nav>

      {/* HERO with VIDEO */}
      {currentView === 'home' && (
        <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/3443/3443-small.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/80"></div>
          
          <div className="relative z-10 text-center px-6">
            <h1 className="text-7xl font-bold tracking-tighter mb-6">Premium Companions.<br />Discreet Experiences.</h1>
            <p className="text-xl max-w-md mx-auto mb-10 text-white/80">South Africa’s most trusted platform</p>
            <button onClick={() => setCurrentView('browse')} className="btn-primary px-10 py-4 rounded-2xl text-lg">
              Browse Companions
            </button>
          </div>
        </div>
      )}

      {/* BROWSE */}
      {currentView === 'browse' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-10">Featured Companions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map(comp => (
              <div key={comp.id} className="card rounded-3xl overflow-hidden">
                <img src={comp.photos[0]} alt={comp.stageName} className="w-full h-[420px] object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start">
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
                    <span className="text-white/60 text-sm ml-2">({comp.ratingCount} reviews)</span>
                  </div>

                  <button 
                    onClick={() => openBooking(comp)} 
                    className="mt-6 w-full btn-primary py-3 rounded-2xl"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMUNITY FEED */}
      {currentView === 'community' && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8">Community Feed</h1>
          
          {currentUser?.role === 'companion' && (
            <div className="glass p-6 rounded-3xl mb-8">
              <textarea 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share something with your fans..."
                className="w-full bg-transparent border border-white/20 rounded-2xl p-4 h-24 resize-y"
              />
              <button onClick={createPost} className="btn-primary mt-4 px-8 py-2 rounded-full">Post</button>
            </div>
          )}

          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="glass p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="font-semibold">{post.companionName}</div>
                  <div className="text-xs text-white/50">{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                <p className="mb-4">{post.content}</p>
                {post.image && <img src={post.image} alt="" className="rounded-2xl mb-4" />}
                
                <div className="flex items-center gap-6 text-sm">
                  <button onClick={() => likePost(post.id)} className="flex items-center gap-1">
                    ❤️ {post.likes}
                  </button>
                  <button className="flex items-center gap-1">💬 {post.comments.length}</button>
                  <button className="text-[#c026d3]">Tip</button>
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
          
          {currentUser.role === 'client' && (
            <div>
              <h2 className="text-2xl mb-4">My Bookings</h2>
              {bookings.filter(b => b.clientId === currentUser.id).map(booking => (
                <div key={booking.id} className="glass p-6 rounded-3xl mb-4">
                  <div className="font-semibold">{booking.companionName}</div>
                  <div>{booking.date} at {booking.time} • {booking.duration}h • {booking.totalCredits} credits</div>
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => openRatingModal(booking.companionId)}
                      className="mt-3 text-sm underline"
                    >
                      Rate Experience
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentUser.role === 'companion' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl mb-4">My Profile</h3>
                <div className="text-3xl font-semibold">{currentUser.name}</div>
                <div className="text-white/60 mt-1">Verified Companion</div>
              </div>
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl mb-4">Earnings</h3>
                <div className="text-6xl font-mono text-[#c026d3]">{currentUser.walletBalance}</div>
                <div className="text-white/60">credits available</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      {/* Auth Modal, Booking Modal, Rating Modal, etc. would go here */}

      <footer className="text-center py-12 text-xs text-white/40">
        Cumpani © 2026 • Premium Adult Companionship • 18+
      </footer>
    </div>
  );
}