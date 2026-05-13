"use client";

import React, { useState, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'companion';
  avatar?: string;
  walletBalance: number;
}

interface Companion {
  id: string;
  userId?: string;
  stageName: string;
  location: string;
  hourlyRate: number;
  bio: string;
  services: string[];
  photos: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  availability: string[];
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'credit_purchase' | 'booking_debit' | 'booking_credit' | 'withdrawal';
  amount: number;
  description: string;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const initialCompanions: Companion[] = [
  {
    id: 'comp1',
    stageName: 'Sophia Laurent',
    location: 'Johannesburg',
    hourlyRate: 180,
    bio: 'Elegant and intellectually stimulating companion. I enjoy fine dining, deep conversations, and creating unforgettable private moments. Based in Sandton, available for travel.',
    services: ['Fine Dining', 'Travel Companion', 'Private Evenings', 'Sensual Massage'],
    photos: [
      'https://picsum.photos/id/1011/600/800',
      'https://picsum.photos/id/1005/600/800',
      'https://picsum.photos/id/1012/600/800'
    ],
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-16', '2026-05-18', '2026-05-20', '2026-05-22'],
    createdAt: '2025-01-10'
  },
  {
    id: 'comp2',
    stageName: 'Isabella Voss',
    location: 'Cape Town',
    hourlyRate: 220,
    bio: 'Passionate and adventurous. I love the outdoors, wine tasting in Stellenbosch, and intimate evenings by the sea. Discreet and professional.',
    services: ['Wine Tasting', 'Beach Evenings', 'Adventure Dates', 'Overnight Stays'],
    photos: [
      'https://picsum.photos/id/1009/600/800',
      'https://picsum.photos/id/201/600/800',
      'https://picsum.photos/id/29/600/800'
    ],
    verificationStatus: 'verified',
    availability: ['2026-05-14', '2026-05-17', '2026-05-19', '2026-05-21'],
    createdAt: '2025-02-05'
  },
  {
    id: 'comp3',
    stageName: 'Amara Khethiwe',
    location: 'Durban',
    hourlyRate: 150,
    bio: 'Warm, curvaceous and full of life. Specializing in relaxing massages and genuine connection. Perfect for those seeking a nurturing experience.',
    services: ['Relaxing Massage', 'Dinner & Conversation', 'Private Relaxation', 'Weekend Getaways'],
    photos: [
      'https://picsum.photos/id/1006/600/800',
      'https://picsum.photos/id/160/600/800',
      'https://picsum.photos/id/251/600/800'
    ],
    verificationStatus: 'verified',
    availability: ['2026-05-15', '2026-05-16', '2026-05-18', '2026-05-23'],
    createdAt: '2025-03-12'
  },
  {
    id: 'comp4',
    stageName: 'Elena Moreau',
    location: 'Pretoria',
    hourlyRate: 195,
    bio: 'Sophisticated French-inspired elegance. I offer refined companionship for business events, galas, and private sophisticated encounters.',
    services: ['Business Events', 'Gala Companion', 'Cultural Outings', 'Intimate Evenings'],
    photos: [
      'https://picsum.photos/id/1008/600/800',
      'https://picsum.photos/id/177/600/800',
      'https://picsum.photos/id/133/600/800'
    ],
    verificationStatus: 'pending',
    availability: ['2026-05-14', '2026-05-20', '2026-05-24'],
    createdAt: '2026-04-01'
  }
];

const creditPackages = [
  { credits: 50, price: 250, label: 'Starter' },
  { credits: 120, price: 550, label: 'Popular' },
  { credits: 250, price: 1100, label: 'Premium' },
  { credits: 500, price: 2100, label: 'VIP' },
];

const cryptoOptions = [
  { symbol: 'BTC', name: 'Bitcoin', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
  { symbol: 'USDT', name: 'Tether (ERC20)', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
];

const servicesList = ['Fine Dining', 'Travel Companion', 'Private Evenings', 'Sensual Massage', 'Wine Tasting', 'Beach Evenings', 'Business Events', 'Overnight Stays', 'Relaxing Massage', 'Gala Companion'];

export default function CumpaniApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'dashboard' | 'wallet'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'client' | 'companion'>('client');
  
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMinRate, setFilterMinRate] = useState(0);
  const [filterMaxRate, setFilterMaxRate] = useState(300);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rate-low' | 'rate-high' | 'newest'>('rate-low');

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingDuration, setBookingDuration] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    stageName: '',
    location: '',
    hourlyRate: 150,
    bio: '',
    selectedServices: [] as string[],
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  const [purchaseAmount, setPurchaseAmount] = useState(120);
  const [cryptoSelected, setCryptoSelected] = useState(cryptoOptions[0]);
  const [cryptoAmount, setCryptoAmount] = useState(100);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'card' | 'crypto'>('card');

  useEffect(() => {
    const savedUser = localStorage.getItem('cumpani_user');
    const savedCompanions = localStorage.getItem('cumpani_companions');
    const savedBookings = localStorage.getItem('cumpani_bookings');
    const savedTransactions = localStorage.getItem('cumpani_transactions');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedCompanions) setCompanions(JSON.parse(savedCompanions));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('cumpani_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cumpani_companions', JSON.stringify(companions));
  }, [companions]);

  useEffect(() => {
    localStorage.setItem('cumpani_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cumpani_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      if (authForm.email.includes('demo')) {
        if (authForm.email.includes('client')) {
          const demoClient: User = {
            id: 'user_client_demo',
            name: 'Alex Thompson',
            email: 'client@demo.com',
            role: 'client',
            walletBalance: 450,
          };
          setCurrentUser(demoClient);
          setShowAuthModal(false);
          showToast('Welcome back, Alex!', 'success');
          setCurrentView('browse');
        } else {
          const demoCompanion: User = {
            id: 'user_comp_demo',
            name: 'Sophia Laurent',
            email: 'companion@demo.com',
            role: 'companion',
            walletBalance: 1250,
          };
          setCurrentUser(demoCompanion);
          setShowAuthModal(false);
          showToast('Welcome back to your dashboard', 'success');
          setCurrentView('dashboard');
        }
      } else {
        showToast('Demo mode: Use "client@demo.com" or "companion@demo.com" or sign up', 'info');
      }
    } else {
      if (!authForm.email || !authForm.name) {
        showToast('Please fill in required fields', 'error');
        return;
      }

      const newUserId = 'user_' + Date.now();

      if (selectedRole === 'client') {
        const newClient: User = {
          id: newUserId,
          name: authForm.name,
          email: authForm.email,
          role: 'client',
          walletBalance: 200,
        };
        setCurrentUser(newClient);
        setShowAuthModal(false);
        showToast('Account created! You have 200 welcome credits.', 'success');
        setCurrentView('browse');
      } else {
        if (!authForm.stageName || !authForm.bio) {
          showToast('Please provide stage name and bio for companion profile', 'error');
          return;
        }

        const newCompanionProfile: Companion = {
          id: 'comp_' + Date.now(),
          userId: newUserId,
          stageName: authForm.stageName,
          location: authForm.location || 'Johannesburg',
          hourlyRate: authForm.hourlyRate,
          bio: authForm.bio,
          services: authForm.selectedServices.length > 0 ? authForm.selectedServices : ['Private Evenings'],
          photos: ['https://picsum.photos/id/1005/600/800', 'https://picsum.photos/id/1011/600/800'],
          verificationStatus: 'pending',
          availability: [],
          createdAt: new Date().toISOString().split('T')[0],
        };

        setCompanions(prev => [...prev, newCompanionProfile]);

        const newCompanionUser: User = {
          id: newUserId,
          name: authForm.stageName,
          email: authForm.email,
          role: 'companion',
          walletBalance: 0,
        };
        setCurrentUser(newCompanionUser);
        setShowAuthModal(false);
        showToast('Companion profile created! Complete verification to start accepting bookings.', 'success');
        setCurrentView('dashboard');
      }

      setAuthForm({ name: '', email: '', password: '', stageName: '', location: '', hourlyRate: 150, bio: '', selectedServices: [] });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cumpani_user');
    setCurrentView('home');
    showToast('Logged out successfully', 'info');
  };

  const openCompanionProfile = (companion: Companion) => {
    setSelectedCompanion(companion);
    setShowCompanionModal(true);
    setShowBookingModal(false);
  };

  const openBooking = (companion: Companion) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role !== 'client') {
      showToast('Only clients can book companions', 'error');
      return;
    }
    if (companion.verificationStatus !== 'verified') {
      showToast('This companion is not yet verified. Please choose another.', 'error');
      return;
    }
    setSelectedCompanion(companion);
    setBookingDate('');
    setBookingTime('20:00');
    setBookingDuration(2);
    setBookingNotes('');
    setShowCompanionModal(false);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!currentUser || !selectedCompanion || !bookingDate) {
      showToast('Please select a date', 'error');
      return;
    }

    const totalCredits = selectedCompanion.hourlyRate * bookingDuration;

    if (currentUser.walletBalance < totalCredits) {
      showToast(`Insufficient credits. You need ${totalCredits} but have ${currentUser.walletBalance}.`, 'error');
      return;
    }

    const newBooking: Booking = {
      id: 'book_' + Date.now(),
      clientId: currentUser.id,
      companionId: selectedCompanion.id,
      companionName: selectedCompanion.stageName,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration,
      totalCredits,
      status: 'confirmed',
      notes: bookingNotes,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [...prev, newBooking]);

    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - totalCredits };
    setCurrentUser(updatedUser);

    const clientTx: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      type: 'booking_debit',
      amount: -totalCredits,
      description: `Booking with ${selectedCompanion.stageName} • ${bookingDuration}h on ${bookingDate}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, clientTx]);

    showToast(`Booking confirmed! ${totalCredits} credits deducted.`, 'success');
    setShowBookingModal(false);
    setSelectedCompanion(null);
    setBookingNotes('');
    
    setTimeout(() => setCurrentView('dashboard'), 800);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !currentUser) return;

    if (booking.status !== 'confirmed') {
      showToast('Cannot cancel this booking', 'error');
      return;
    }

    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + booking.totalCredits };
    setCurrentUser(updatedUser);

    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    );

    const refundTx: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      type: 'booking_debit',
      amount: booking.totalCredits,
      description: `Refund for cancelled booking with ${booking.companionName}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, refundTx]);

    showToast('Booking cancelled and credits refunded', 'success');
  };

  const submitVerification = () => {
    if (!currentUser || currentUser.role !== 'companion') return;

    const compIndex = companions.findIndex(c => c.userId === currentUser.id || c.stageName === currentUser.name);

    if (compIndex !== -1) {
      const updatedCompanions = [...companions];
      updatedCompanions[compIndex] = {
        ...updatedCompanions[compIndex],
        verificationStatus: 'verified',
      };
      setCompanions(updatedCompanions);
    }

    setShowVerificationModal(false);
    showToast('Congratulations! Your profile is now verified. You can accept bookings.', 'success');
  };

  const saveProfileUpdate = () => {
    if (!currentUser || currentUser.role !== 'companion' || !selectedCompanion) return;

    const updated = companions.map(c =>
      c.id === selectedCompanion.id
        ? { ...c, ...profileForm }
        : c
    );
    setCompanions(updated);
    setEditingProfile(false);
    showToast('Profile updated successfully', 'success');
  };

  const purchaseCredits = async (credits: number, priceZAR: number) => {
    if (!currentUser) return;

    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newBalance = currentUser.walletBalance + credits;
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);

    const tx: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      type: 'credit_purchase',
      amount: credits,
      description: `Purchased ${credits} credits via Card (R${priceZAR})`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, tx]);

    setIsProcessingPayment(false);
    showToast(`Successfully added ${credits} credits to your wallet!`, 'success');
    setShowWalletModal(false);
  };

  const purchaseWithCrypto = async () => {
    if (!currentUser) return;

    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2200));

    const newBalance = currentUser.walletBalance + cryptoAmount;
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);

    const tx: Transaction = {
      id: 'tx_crypto_' + Date.now(),
      userId: currentUser.id,
      type: 'credit_purchase',
      amount: cryptoAmount,
      description: `Purchased ${cryptoAmount} credits via ${cryptoSelected.symbol}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, tx]);

    setIsProcessingPayment(false);
    showToast(`${cryptoAmount} credits added via ${cryptoSelected.symbol}. (Demo)`, 'success');
    setShowWalletModal(false);
  };

  const filteredCompanions = React.useMemo(() => {
    let result = [...companions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.stageName.toLowerCase().includes(term) ||
        c.bio.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term)
      );
    }

    if (filterLocation) {
      result = result.filter(c => c.location === filterLocation);
    }

    result = result.filter(c => c.hourlyRate >= filterMinRate && c.hourlyRate <= filterMaxRate);

    if (filterVerifiedOnly) {
      result = result.filter(c => c.verificationStatus === 'verified');
    }

    if (sortBy === 'rate-low') {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === 'rate-high') {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return result;
  }, [companions, searchTerm, filterLocation, filterMinRate, filterMaxRate, filterVerifiedOnly, sortBy]);

  const locations = Array.from(new Set(companions.map(c => c.location)));

  const userBookings = currentUser 
    ? bookings.filter(b => b.clientId === currentUser.id || (currentUser.role === 'companion' && companions.some(c => c.id === b.companionId && c.userId === currentUser.id)))
    : [];

  const myCompanionProfile = currentUser?.role === 'companion' 
    ? companions.find(c => c.userId === currentUser.id || c.stageName === currentUser.name)
    : null;

  const quickLogin = (role: 'client' | 'companion') => {
    if (role === 'client') {
      const demo: User = { id: 'demo_client', name: 'Jordan Vale', email: 'client@demo.com', role: 'client', walletBalance: 380 };
      setCurrentUser(demo);
      showToast('Logged in as demo client', 'success');
      setCurrentView('browse');
    } else {
      const demo: User = { id: 'demo_comp', name: 'Sophia Laurent', email: 'sophia@cumpani.fun', role: 'companion', walletBalance: 890 };
      setCurrentUser(demo);
      showToast('Logged in as demo companion', 'success');
      setCurrentView('dashboard');
    }
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">
      <nav className="sticky top-0 z-50 glass border-b border-[#333] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c026d3] to-[#a21caf] flex items-center justify-center">
              <span className="text-white font-bold text-xl tracking-tighter">C</span>
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-[-1.5px]">Cumpani</div>
              <div className="text-[10px] text-[#a1a1aa] -mt-1">PREMIUM • SOUTH AFRICA</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <button onClick={() => setCurrentView('home')} className={`nav-link ${currentView === 'home' ? 'active text-white' : 'text-[#a1a1aa]'}`}>Home</button>
            <button onClick={() => setCurrentView('browse')} className={`nav-link ${currentView === 'browse' ? 'active text-white' : 'text-[#a1a1aa]'}`}>Browse Companions</button>
            <button onClick={() => setCurrentView('home')} className="nav-link text-[#a1a1aa] hover:text-white">For Companions</button>
            
            {currentUser && (
              <>
                <button onClick={() => setCurrentView('dashboard')} className={`nav-link ${currentView === 'dashboard' ? 'active text-white' : 'text-[#a1a1aa]'}`}>Dashboard</button>
                <button onClick={() => { setCurrentView('wallet'); setShowWalletModal(true); }} className="nav-link text-[#a1a1aa] hover:text-white flex items-center gap-1.5">
                  Wallet <span className="text-[#c026d3] font-mono text-xs">• {currentUser.walletBalance}</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-[#71717a] text-xs capitalize">{currentUser.role}</div>
                </div>
                <button onClick={logout} className="btn-secondary px-4 py-1.5 text-xs rounded-full">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} 
                className="btn-primary px-6 py-2 rounded-full text-sm font-medium"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="fixed top-20 right-6 z-[100] space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-5 py-3 rounded-2xl shadow-xl text-sm flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : toast.type === 'error' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {currentView === 'home' && (
        <div>
          <div className="relative h-[92vh] flex items-center justify-center bg-[radial-gradient(#222_0.8px,transparent_1px)] bg-[length:4px_4px]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black"></div>
            
            <div className="relative z-10 max-w-5xl px-6 text-center">
              <div className="inline-block mb-4 px-4 py-1 rounded-full border border-white/20 text-xs tracking-[3px] text-white/70">EST. 2025 • JOHANNESBURG</div>
              <h1 className="text-7xl md:text-8xl font-semibold tracking-[-4.5px] leading-none mb-6">
                Premium Companions.<br />Discreet Experiences.
              </h1>
              <p className="max-w-md mx-auto text-xl text-[#a1a1aa] mb-10">South Africa's most trusted platform for elegant, verified adult companionship.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCurrentView('browse')} className="btn-primary px-10 py-4 rounded-2xl text-lg font-medium flex items-center justify-center gap-3 group">
                  Browse Companions <span className="group-hover:translate-x-0.5 transition">→</span>
                </button>
                <button onClick={() => { setShowAuthModal(true); setAuthMode('signup'); setSelectedRole('companion'); }} className="btn-secondary px-8 py-4 rounded-2xl text-lg font-medium">
                  Become a Companion
                </button>
              </div>

              <div className="mt-12 flex justify-center gap-8 text-xs text-white/50 tracking-widest">
                <div>18+ ONLY</div>
                <div>VERIFIED PROFILES</div>
                <div>SECURE PAYMENTS</div>
                <div>DISCREET</div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto -mt-8 relative z-20 px-6">
            <div className="glass rounded-3xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
              <input 
                type="text" 
                placeholder="Search by name, city or vibe..." 
                className="flex-1 bg-transparent px-6 py-4 text-lg placeholder:text-white/40 focus:outline-none"
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentView('browse'); }}
              />
              <button onClick={() => setCurrentView('browse')} className="btn-primary px-10 py-4 rounded-2xl font-medium whitespace-nowrap">Find Companions</button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[#c026d3] text-sm tracking-[2px]">DISCOVER</div>
                <div className="text-4xl font-semibold tracking-tight">Featured Companions</div>
              </div>
              <button onClick={() => setCurrentView('browse')} className="text-sm flex items-center gap-2 text-[#c026d3] hover:underline">View all →</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companions.slice(0, 4).map(comp => (
                <div key={comp.id} onClick={() => openCompanionProfile(comp)} className="card rounded-3xl overflow-hidden cursor-pointer group">
                  <div className="relative">
                    <img src={comp.photos[0]} alt={comp.stageName} className="companion-photo w-full" />
                    {comp.verificationStatus === 'verified' && (
                      <div className="absolute top-4 right-4 bg-black/70 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="text-emerald-400">●</span> Verified
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-xl tracking-tight">{comp.stageName}</div>
                        <div className="text-[#a1a1aa] text-sm">{comp.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-medium text-[#c026d3]">{comp.hourlyRate}</div>
                        <div className="text-[10px] text-white/50 -mt-1">CREDITS/HR</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#a1a1aa] line-clamp-2">{comp.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] py-16">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="text-[#c026d3] text-sm tracking-[3px] mb-2">SEAMLESS EXPERIENCE</div>
                <div className="text-4xl font-semibold tracking-tight">How Cumpani Works</div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { num: "01", title: "Browse & Discover", desc: "Explore verified companions across South Africa. Filter by location, rates, and availability." },
                  { num: "02", title: "Book with Credits", desc: "Purchase credits easily via card or crypto. Book instantly with our secure digital wallet." },
                  { num: "03", title: "Meet & Enjoy", desc: "Meet your companion. All sessions are private, consensual, and handled with complete discretion." }
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="mx-auto w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-2xl font-mono mb-6 text-[#c026d3]">{step.num}</div>
                    <div className="font-semibold text-2xl mb-3 tracking-tight">{step.title}</div>
                    <p className="text-[#a1a1aa] max-w-xs mx-auto">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="text-[#c026d3] text-sm tracking-widest mb-3">EARN ON YOUR TERMS</div>
            <h2 className="text-5xl font-semibold tracking-[-2px] mb-6">Join as a Companion</h2>
            <p className="text-xl text-[#a1a1aa] max-w-md mx-auto mb-8">Create your profile, get verified, set your own rates and availability. Get paid in credits you can withdraw or spend.</p>
            <button onClick={() => { setShowAuthModal(true); setAuthMode('signup'); setSelectedRole('companion'); }} className="btn-primary px-10 py-4 rounded-2xl text-lg">Create Companion Profile</button>
            <p className="mt-4 text-xs text-white/40">Free to join • Quick verification • High earning potential</p>
          </div>
        </div>
      )}

      {currentView === 'browse' && (
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-sm text-[#c026d3] tracking-widest">EXPLORE</div>
              <h1 className="text-5xl font-semibold tracking-[-2.5px]">Browse Companions</h1>
            </div>
            <div className="text-sm text-[#a1a1aa]">{filteredCompanions.length} available</div>
          </div>

          <div className="glass rounded-3xl p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <div className="text-xs text-white/50 mb-1.5">SEARCH</div>
              <input 
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Name, city or keyword..." className="input w-full rounded-2xl px-5 py-3" 
              />
            </div>
            
            <div>
              <div className="text-xs text-white/50 mb-1.5">LOCATION</div>
              <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="input w-full rounded-2xl px-5 py-3">
                <option value="">All Cities</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div>
              <div className="text-xs text-white/50 mb-1.5">RATE (CREDITS/HR)</div>
              <div className="flex gap-2">
                <input type="number" value={filterMinRate} onChange={e => setFilterMinRate(Number(e.target.value))} className="input w-full rounded-2xl px-4 py-3 text-sm" placeholder="Min" />
                <input type="number" value={filterMaxRate} onChange={e => setFilterMaxRate(Number(e.target.value))} className="input w-full rounded-2xl px-4 py-3 text-sm" placeholder="Max" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filterVerifiedOnly} onChange={e => setFilterVerifiedOnly(e.target.checked)} className="accent-[#c026d3]" /> Verified only
              </label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input rounded-2xl px-5 py-3 text-sm">
                <option value="rate-low">Price: Low to High</option>
                <option value="rate-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanions.length > 0 ? filteredCompanions.map(companion => (
              <div key={companion.id} className="card rounded-3xl overflow-hidden group">
                <div className="relative cursor-pointer" onClick={() => openCompanionProfile(companion)}>
                  <img src={companion.photos[0]} alt={companion.stageName} className="companion-photo w-full" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {companion.verificationStatus === 'verified' && <div className="bg-black/80 text-emerald-400 text-[10px] px-3 py-px rounded-full tracking-wider">VERIFIED</div>}
                    {companion.verificationStatus === 'pending' && <div className="bg-yellow-900/80 text-yellow-400 text-[10px] px-3 py-px rounded-full tracking-wider">PENDING</div>}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-4 py-1 rounded-2xl text-sm font-mono">{companion.hourlyRate} <span className="text-xs text-white/60">cr</span></div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-2xl tracking-tight">{companion.stageName}</div>
                      <div className="text-sm text-[#a1a1aa]">{companion.location}</div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-[#a1a1aa] line-clamp-3 min-h-[60px]">{companion.bio}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {companion.services.slice(0,3).map(s => (
                      <span key={s} className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/70">{s}</span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button onClick={() => openCompanionProfile(companion)} className="flex-1 btn-secondary py-3 rounded-2xl text-sm">View Profile</button>
                    <button onClick={() => openBooking(companion)} disabled={companion.verificationStatus !== 'verified'} className="flex-1 btn-primary py-3 rounded-2xl text-sm disabled:opacity-40">Book Now</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-white/50">No companions match your filters.</div>
            )}
          </div>
        </div>
      )}

      {currentView === 'dashboard' && currentUser && (
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-[#c026d3]">YOUR SPACE</div>
              <h1 className="text-5xl font-semibold tracking-[-2px]">Dashboard</h1>
            </div>
            <div className="text-right text-sm">
              Balance: <span className="font-mono text-[#c026d3] text-xl">{currentUser.walletBalance}</span> credits
            </div>
          </div>

          {currentUser.role === 'client' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-semibold text-2xl mb-4 tracking-tight">My Bookings</h2>
                {userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(booking => (
                      <div key={booking.id} className="glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xl">{booking.companionName}</div>
                          <div className="text-[#a1a1aa]">{booking.date} at {booking.time} • {booking.duration} hours</div>
                          {booking.notes && <div className="text-sm mt-1 text-white/60 italic">“{booking.notes}”</div>}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-1 rounded-full text-xs uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400' : booking.status === 'cancelled' ? 'bg-red-950 text-red-400' : 'bg-zinc-800'}`}>
                            {booking.status}
                          </div>
                          <div className="font-mono text-lg text-[#c026d3]">{booking.totalCredits} cr</div>
                          {booking.status === 'confirmed' && (
                            <button onClick={() => cancelBooking(booking.id)} className="text-xs text-red-400 hover:text-red-500 px-4">Cancel</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-3xl p-12 text-center text-white/50">You have no bookings yet. Start exploring companions.</div>
                )}
              </div>

              <button onClick={() => setCurrentView('browse')} className="btn-primary w-full py-4 rounded-2xl">Find more companions to book →</button>
            </div>
          )}

          {currentUser.role === 'companion' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-white/50">YOUR PROFILE</div>
                    <div className="text-3xl font-semibold tracking-tight">{myCompanionProfile?.stageName || currentUser.name}</div>
                  </div>
                  <div>
                    {myCompanionProfile?.verificationStatus === 'verified' ? (
                      <div className="bg-emerald-950 text-emerald-400 px-4 py-1 rounded-full text-xs tracking-widest">VERIFIED</div>
                    ) : (
                      <button onClick={() => setShowVerificationModal(true)} className="text-xs bg-yellow-900 hover:bg-yellow-800 transition px-5 py-2 rounded-full">GET VERIFIED</button>
                    )}
                  </div>
                </div>

                {myCompanionProfile && (
                  <>
                    <div className="grid grid-cols-2 gap-x-8 text-sm">
                      <div className="space-y-4">
                        <div><span className="text-white/50">Location</span><br />{myCompanionProfile.location}</div>
                        <div><span className="text-white/50">Rate</span><br /><span className="font-mono text-2xl text-[#c026d3]">{myCompanionProfile.hourlyRate}</span> credits/hr</div>
                      </div>
                      <div>
                        <span className="text-white/50">Services</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {myCompanionProfile.services.map(s => <span key={s} className="bg-white/5 px-3 py-1 rounded text-xs">{s}</span>)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-white/50 text-sm">Bio</span>
                      <p className="mt-1 text-[#a1a1aa]">{myCompanionProfile.bio}</p>
                    </div>

                    <button onClick={() => { setSelectedCompanion(myCompanionProfile); setProfileForm(myCompanionProfile); setEditingProfile(true); }} className="mt-6 btn-secondary px-6 py-2 text-sm rounded-2xl">Edit Profile</button>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div className="glass rounded-3xl p-6">
                  <div className="text-sm text-white/50 mb-1">EARNINGS (DEMO)</div>
                  <div className="text-5xl font-mono tracking-tighter text-[#c026d3]">{currentUser.walletBalance}</div>
                  <div className="text-xs text-white/50">credits available</div>
                </div>

                <div className="glass rounded-3xl p-6">
                  <div className="font-medium mb-3">Verification Status</div>
                  {myCompanionProfile?.verificationStatus === 'verified' ? (
                    <div className="text-emerald-400">✓ Your profile is verified and visible to clients.</div>
                  ) : (
                    <div>
                      <div className="text-yellow-400 mb-3">Pending verification</div>
                      <button onClick={() => setShowVerificationModal(true)} className="text-xs underline">Submit documents for verification</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3">
                <h3 className="font-semibold mb-4 text-xl tracking-tight">Incoming Bookings</h3>
                {userBookings.length > 0 ? (
                  <div className="space-y-3">
                    {userBookings.map(b => (
                      <div key={b.id} className="glass p-5 rounded-2xl flex justify-between items-center">
                        <div>Booking from client on <span className="font-medium">{b.date}</span> at {b.time} • {b.duration}h • {b.totalCredits} cr</div>
                        <div className="text-xs px-4 py-1 bg-white/5 rounded">Confirmed</div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-white/50 text-sm">No bookings yet. Once verified, clients will be able to book you.</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {showWalletModal && currentUser && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" onClick={() => setShowWalletModal(false)}>
          <div className="glass w-full max-w-lg rounded-3xl p-8 modal" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <div>
                <div className="text-sm text-white/60">YOUR WALLET</div>
                <div className="text-5xl font-mono tracking-[-2px] text-[#c026d3]">{currentUser.walletBalance}</div>
                <div className="text-xs -mt-1 text-white/50">CREDITS</div>
              </div>
              <button onClick={() => setShowWalletModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="flex border-b border-white/10 mb-6">
              <button onClick={() => setActivePaymentTab('card')} className={`flex-1 py-3 text-sm font-medium ${activePaymentTab === 'card' ? 'border-b-2 border-[#c026d3] text-white' : 'text-white/50'}`}>Card (VISA / Mastercard)</button>
              <button onClick={() => setActivePaymentTab('crypto')} className={`flex-1 py-3 text-sm font-medium ${activePaymentTab === 'crypto' ? 'border-b-2 border-[#c026d3] text-white' : 'text-white/50'}`}>Crypto</button>
            </div>

            {activePaymentTab === 'card' && (
              <div>
                <div className="text-xs text-white/60 mb-3">CHOOSE PACKAGE</div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {creditPackages.map((pkg, idx) => (
                    <button key={idx} onClick={() => purchaseCredits(pkg.credits, pkg.price)} disabled={isProcessingPayment} className="glass hover:border-[#c026d3] border border-transparent p-4 rounded-2xl text-left transition">
                      <div className="font-mono text-3xl text-[#c026d3]">{pkg.credits}</div>
                      <div className="text-sm">credits</div>
                      <div className="text-xs mt-2 text-white/50">R{pkg.price} • {pkg.label}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-center text-white/40">Payments processed securely via Stripe. 1 credit ≈ R5 (varies).</p>
              </div>
            )}

            {activePaymentTab === 'crypto' && (
              <div>
                <div className="mb-4">
                  <div className="text-xs text-white/60 mb-2">SELECT CRYPTOCURRENCY</div>
                  <div className="flex gap-2">
                    {cryptoOptions.map((opt, i) => (
                      <button key={i} onClick={() => setCryptoSelected(opt)} className={`flex-1 py-2 text-xs rounded-2xl border ${cryptoSelected.symbol === opt.symbol ? 'border-[#c026d3] bg-white/5' : 'border-white/10'}`}>{opt.symbol}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60">AMOUNT OF CREDITS</label>
                  <input type="number" value={cryptoAmount} onChange={e => setCryptoAmount(Number(e.target.value))} className="input w-full mt-1.5 rounded-2xl px-5 py-4 text-2xl font-mono" />
                </div>

                <div className="mt-6 p-4 bg-black/40 rounded-2xl text-xs font-mono break-all">
                  Send to:<br />
                  <span className="text-[#c026d3]">{cryptoSelected.address}</span>
                </div>

                <button onClick={purchaseWithCrypto} disabled={isProcessingPayment} className="mt-6 w-full btn-primary py-4 rounded-2xl disabled:opacity-70">
                  {isProcessingPayment ? 'CONFIRMING ON-CHAIN...' : `I HAVE SENT ${cryptoAmount} CREDITS WORTH`}
                </button>
                <p className="text-center text-[10px] mt-3 text-white/40">Demo mode. Real integration would use payment gateway + on-chain verification.</p>
              </div>
            )}

            {isProcessingPayment && <div className="text-center text-xs mt-4 text-white/60">Processing secure payment...</div>}
          </div>
        </div>
      )}

      {showCompanionModal && selectedCompanion && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowCompanionModal(false)}>
          <div className="glass max-w-3xl w-full rounded-3xl overflow-hidden modal my-8" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedCompanion.photos[0]} alt="" className="w-full h-[420px] object-cover" />
              <button onClick={() => setShowCompanionModal(false)} className="absolute top-6 right-6 bg-black/70 px-5 py-2 rounded-full text-sm">Close</button>
              {selectedCompanion.verificationStatus === 'verified' && <div className="absolute top-6 left-6 bg-black/70 px-4 py-1 text-xs rounded-full text-emerald-400 tracking-widest">VERIFIED COMPANION</div>}
            </div>

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end gap-x-8">
                <div className="flex-1">
                  <div className="text-5xl font-semibold tracking-[-2.5px]">{selectedCompanion.stageName}</div>
                  <div className="text-2xl text-[#a1a1aa] mt-1">{selectedCompanion.location}</div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="font-mono text-6xl text-[#c026d3] tracking-tighter">{selectedCompanion.hourlyRate}</div>
                  <div className="text-xs -mt-2 text-white/50">CREDITS PER HOUR</div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <div className="uppercase text-xs tracking-[2px] text-white/50 mb-3">ABOUT</div>
                  <p className="text-[#a1a1aa] leading-relaxed">{selectedCompanion.bio}</p>

                  <div className="mt-8">
                    <div className="uppercase text-xs tracking-[2px] text-white/50 mb-3">SERVICES OFFERED</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompanion.services.map(service => (
                        <div key={service} className="px-5 py-2 bg-white/5 rounded-2xl text-sm">{service}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="uppercase text-xs tracking-[2px] text-white/50 mb-3">AVAILABILITY</div>
                  <div className="text-sm text-[#a1a1aa]">
                    {selectedCompanion.availability.length > 0 ? (
                      selectedCompanion.availability.map(d => (
                        <div key={d} className="py-1 border-b border-white/10 last:border-none">{new Date(d).toLocaleDateString('en-ZA', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                      ))
                    ) : "Flexible — contact for availability"}
                  </div>

                  <button onClick={() => openBooking(selectedCompanion)} disabled={selectedCompanion.verificationStatus !== 'verified'} className="mt-8 w-full btn-primary py-4 rounded-2xl text-base disabled:bg-white/10 disabled:text-white/40">
                    {selectedCompanion.verificationStatus === 'verified' ? 'BOOK THIS COMPANION' : 'PENDING VERIFICATION'}
                  </button>
                  <p className="text-center text-[10px] mt-3 text-white/40">Secure booking • Instant confirmation with credits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedCompanion && currentUser && (
        <div className="fixed inset-0 z-[85] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowBookingModal(false)}>
          <div className="glass w-full max-w-md rounded-3xl p-8 modal" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs tracking-widest text-white/50">CONFIRM YOUR SESSION</div>
                <div className="text-3xl font-semibold tracking-tight mt-1">{selectedCompanion.stageName}</div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-xl leading-none text-white/40">×</button>
            </div>

            <div className="my-8 space-y-5">
              <div>
                <label className="text-xs text-white/60 block mb-1.5">DATE</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input w-full rounded-2xl px-5 py-3.5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">START TIME</label>
                  <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="input w-full rounded-2xl px-5 py-3.5" />
                </div>
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">DURATION</label>
                  <select value={bookingDuration} onChange={e => setBookingDuration(Number(e.target.value))} className="input w-full rounded-2xl px-5 py-3.5">
                    {[1,2,3,4].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1.5">NOTES FOR COMPANION (OPTIONAL)</label>
                <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} placeholder="Any special requests or details..." className="input w-full rounded-2xl px-5 py-3.5 h-20 resize-y" />
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Cost</span>
                <span className="font-mono text-xl text-[#c026d3]">{selectedCompanion.hourlyRate * bookingDuration} credits</span>
              </div>
              <div className="text-xs text-white/50">Your balance: {currentUser.walletBalance} credits</div>

              <button onClick={confirmBooking} className="mt-6 w-full btn-primary py-4 text-base rounded-2xl">CONFIRM & PAY WITH CREDITS</button>
              <p className="text-center text-[10px] mt-4 text-white/40">This is a binding request. Cancellations are subject to our policy.</p>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[95] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          <div className="glass w-full max-w-md rounded-3xl p-8 modal" onClick={e => e.stopPropagation()}>
            <div className="flex mb-8 border-b border-white/10">
              <button onClick={() => setAuthMode('login')} className={`flex-1 pb-4 text-sm font-medium ${authMode === 'login' ? 'text-white border-b-2 border-[#c026d3]' : 'text-white/50'}`}>Login</button>
              <button onClick={() => setAuthMode('signup')} className={`flex-1 pb-4 text-sm font-medium ${authMode === 'signup' ? 'text-white border-b-2 border-[#c026d3]' : 'text-white/50'}`}>Sign Up</button>
            </div>

            {authMode === 'login' && (
              <div>
                <p className="text-center text-sm text-white/60 mb-6">Demo accounts for testing the full experience</p>
                
                <div className="space-y-3 mb-6">
                  <button onClick={() => quickLogin('client')} className="w-full py-3.5 rounded-2xl border border-white/20 hover:bg-white/5 transition text-sm">Login as Demo Client (has credits)</button>
                  <button onClick={() => quickLogin('companion')} className="w-full py-3.5 rounded-2xl border border-white/20 hover:bg-white/5 transition text-sm">Login as Demo Companion (verified)</button>
                </div>

                <div className="text-center text-xs text-white/40">Or use the form below with any email containing “demo”</div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4 mt-4">
              {authMode === 'signup' && (
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setSelectedRole('client')} className={`flex-1 py-2 text-xs rounded-2xl ${selectedRole === 'client' ? 'bg-white text-black' : 'bg-white/5'}`}>I'm a Client</button>
                  <button type="button" onClick={() => setSelectedRole('companion')} className={`flex-1 py-2 text-xs rounded-2xl ${selectedRole === 'companion' ? 'bg-white text-black' : 'bg-white/5'}`}>I'm a Companion</button>
                </div>
              )}

              <input type="text" placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="input w-full rounded-2xl px-5 py-3.5" required />
              <input type="email" placeholder="Email address" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="input w-full rounded-2xl px-5 py-3.5" required />

              {authMode === 'signup' && selectedRole === 'companion' && (
                <>
                  <input type="text" placeholder="Stage / Display Name" value={authForm.stageName} onChange={e => setAuthForm({...authForm, stageName: e.target.value})} className="input w-full rounded-2xl px-5 py-3.5" required />
                  <input type="text" placeholder="Primary City (e.g. Johannesburg)" value={authForm.location} onChange={e => setAuthForm({...authForm, location: e.target.value})} className="input w-full rounded-2xl px-5 py-3.5" />
                  <input type="number" placeholder="Hourly Rate in Credits" value={authForm.hourlyRate} onChange={e => setAuthForm({...authForm, hourlyRate: Number(e.target.value)})} className="input w-full rounded-2xl px-5 py-3.5" />
                  <textarea placeholder="Short professional bio..." value={authForm.bio} onChange={e => setAuthForm({...authForm, bio: e.target.value})} className="input w-full rounded-2xl px-5 py-3.5 h-24" required />
                  
                  <div>
                    <div className="text-xs mb-2 text-white/60">SELECT SERVICES (optional)</div>
                    <div className="flex flex-wrap gap-2">
                      {servicesList.map(s => (
                        <button type="button" key={s} onClick={() => {
                          const newServices = authForm.selectedServices.includes(s) 
                            ? authForm.selectedServices.filter(x => x !== s) 
                            : [...authForm.selectedServices, s];
                          setAuthForm({...authForm, selectedServices: newServices});
                        }} className={`text-xs px-4 py-1.5 rounded-full border transition ${authForm.selectedServices.includes(s) ? 'bg-[#c026d3] border-[#c026d3]' : 'border-white/20 hover:bg-white/5'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary w-full py-4 rounded-2xl mt-2 text-base">
                {authMode === 'login' ? 'Sign In' : `Create ${selectedRole === 'client' ? 'Client' : 'Companion'} Account`}
              </button>
            </form>

            <p className="text-center text-[10px] mt-6 text-white/40">This is a fully functional demo. Real version would use secure authentication.</p>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-6" onClick={() => setShowVerificationModal(false)}>
          <div className="glass max-w-md w-full rounded-3xl p-8 modal" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-semibold tracking-tight">Get Verified</h3>
            <p className="text-sm text-white/60 mt-2">Upload your documents to unlock full features and appear in searches.</p>

            <div className="my-8 space-y-4 text-sm">
              <div className="border border-dashed border-white/30 rounded-2xl p-5 text-center">
                Government ID (front & back)<br />
                <span className="text-xs text-white/40">Drag & drop or click to upload (demo)</span>
              </div>
              <div className="border border-dashed border-white/30 rounded-2xl p-5 text-center">
                Selfie holding ID<br />
                <span className="text-xs text-white/40">Demo mode — click submit to verify instantly</span>
              </div>
            </div>

            <button onClick={submitVerification} className="btn-primary w-full py-3.5 rounded-2xl">SUBMIT FOR VERIFICATION</button>
            <p className="text-center text-xs mt-4 text-white/40">In production: Manual review within 24hrs by our compliance team.</p>
          </div>
        </div>
      )}

      {editingProfile && selectedCompanion && (
        <div className="fixed inset-0 z-[85] bg-black/90 flex items-center justify-center p-4">
          <div className="glass w-full max-w-lg rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">Edit Your Profile</h3>
            
            <div className="space-y-4">
              <input className="input w-full rounded-2xl px-5 py-3" value={profileForm.stageName || ''} onChange={e => setProfileForm({...profileForm, stageName: e.target.value})} placeholder="Stage Name" />
              <input className="input w-full rounded-2xl px-5 py-3" value={profileForm.location || ''} onChange={e => setProfileForm({...profileForm, location: e.target.value})} placeholder="Location" />
              <input type="number" className="input w-full rounded-2xl px-5 py-3" value={profileForm.hourlyRate || ''} onChange={e => setProfileForm({...profileForm, hourlyRate: Number(e.target.value)})} placeholder="Hourly Rate" />
              <textarea className="input w-full rounded-2xl px-5 py-3 h-28" value={profileForm.bio || ''} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Bio" />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setEditingProfile(false)} className="flex-1 btn-secondary py-3 rounded-2xl">Cancel</button>
              <button onClick={saveProfileUpdate} className="flex-1 btn-primary py-3 rounded-2xl">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 py-10 text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-y-4">
          <div>© {new Date().getFullYear()} Cumpani. All rights reserved. Premium adult companionship platform.</div>
          <div className="flex gap-x-6">
            <span>18+ Only • Consensual Adult Services</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Legal (South Africa)</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-6 text-[10px] text-white/30">
          Production version deployed via GitHub Pages. This is a fully functional demo with localStorage. Replace with Supabase + Stripe for full production use.
        </div>
      </footer>
    </div>
  );
}
