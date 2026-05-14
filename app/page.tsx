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
    id: 'comp1', stageName: '@BustyLwa', location: 'Johannesburg', hourlyRate: 195,
    bio: 'Curvy queen with stunning curves and beautiful tattoos. Loves private evenings and travel.',
    services: ['Private Evenings', 'Travel Companion', 'Sensual Massage'],
    photos: ['https://picsum.photos/id/1011/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-15', '2026-05-16'], 
    rating: 4.9, ratingCount: 87, createdAt: '2025-01-10'
  },
  {
    id: 'comp2', stageName: '@Daria', location: 'Cape Town', hourlyRate: 210,
    bio: 'Stunning mixed beauty passionate about fine dining and intimate experiences.',
    services: ['Fine Dining', 'Overnight Stays', 'Travel'],
    photos: ['https://picsum.photos/id/1005/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-14', '2026-05-17'],
    rating: 4.8, ratingCount: 64, createdAt: '2025-02-05'
  },
  {
    id: 'comp3', stageName: '@LanaSway', location: 'Stellenbosch', hourlyRate: 185,
    bio: 'Elegant companion who loves wine tasting and romantic getaways.',
    services: ['Wine Tasting', 'Romantic Getaways'],
    photos: ['https://picsum.photos/id/1009/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-15', '2026-05-20'],
    rating: 4.7, ratingCount: 52, createdAt: '2025-03-12'
  },
  {
    id: 'comp4', stageName: '@Kira', location: 'Durban', hourlyRate: 175,
    bio: 'Warm and curvaceous with a passion for relaxing massages.',
    services: ['Relaxing Massage', 'Beach Evenings'],
    photos: ['https://picsum.photos/id/160/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-16', '2026-05-18'],
    rating: 4.9, ratingCount: 71, createdAt: '2025-04-01'
  },
  {
    id: 'comp5', stageName: '@Lex', location: 'Pretoria', hourlyRate: 190,
    bio: 'Bold and confident companion perfect for business events.',
    services: ['Business Events', 'Adventure Dates'],
    photos: ['https://picsum.photos/id/1008/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-14', '2026-05-22'],
    rating: 4.6, ratingCount: 48, createdAt: '2025-04-20'
  },
  {
    id: 'comp6', stageName: '@MulanMila', location: 'Bloemfontein', hourlyRate: 165,
    bio: 'Exotic beauty with a wild side. Specializes in private relaxation.',
    services: ['Private Relaxation', 'Weekend Getaways'],
    photos: ['https://picsum.photos/id/201/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-15', '2026-05-23'],
    rating: 4.8, ratingCount: 39, createdAt: '2025-05-10'
  },
  {
    id: 'comp7', stageName: '@JazmynHartley', location: 'Port Elizabeth', hourlyRate: 200,
    bio: 'Sophisticated and passionate. Perfect for gala events.',
    services: ['Gala Companion', 'Luxury Dates'],
    photos: ['https://picsum.photos/id/29/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-16', '2026-05-21'],
    rating: 4.7, ratingCount: 55, createdAt: '2025-05-25'
  },
  {
    id: 'comp8', stageName: '@Emma', location: 'Nelspruit', hourlyRate: 180,
    bio: 'Sweet but naughty companion who loves travel and magical moments.',
    services: ['Travel Companion', 'Private Evenings'],
    photos: ['https://picsum.photos/id/133/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-18', '2026-05-24'],
    rating: 4.5, ratingCount: 33, createdAt: '2025-06-05'
  },
  {
    id: 'comp9', stageName: '@SweetNia', location: 'Sandton', hourlyRate: 220,
    bio: 'High-end luxury companion known for discretion and unforgettable experiences.',
    services: ['Luxury Experiences', 'Private Evenings'],
    photos: ['https://picsum.photos/id/251/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-15', '2026-05-25'],
    rating: 4.9, ratingCount: 92, createdAt: '2025-06-15'
  },
  {
    id: 'comp10', stageName: '@LolaVee', location: 'Midrand', hourlyRate: 170,
    bio: 'Playful and energetic companion who loves fun dates.',
    services: ['Fun Dates', 'Overnight Stays'],
    photos: ['https://picsum.photos/id/177/600/800'],
    verificationStatus: 'verified', availability: ['2026-05-17', '2026-05-22'],
    rating: 4.6, ratingCount: 47, createdAt: '2025-06-28'
  }
];

export default function CumpaniApp() {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [exclusiveContent, setExclusiveContent] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'dashboard'