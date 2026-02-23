'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Star,
  Flame,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  Zap,
  Network,
  Bot,
  Link2,
  Lock,
  Users,
  BarChart3,
  Shield,
  X,
  Mail,
  Check,
} from 'lucide-react';

// X (Twitter) Logo Component
const XLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import logoImage from '../lib/logo.png';
import homeImage from '../lib/home.png';
import predict1Image from '../lib/predict1.png';
import predict2Image from '../lib/predict2.png';
import predict3Image from '../lib/predict3.png';

// 图片组件，带错误处理
function ImageWithFallback({
  src,
  alt,
  categoryName,
}: {
  src: string;
  alt: string;
  categoryName: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full min-h-[600px] bg-gray-900 flex items-center justify-center text-gray-500">
        <div className="text-center p-8">
          <p className="text-lg font-semibold mb-2">图片未找到</p>
          <p className="text-sm text-gray-400">
            请将图片放在: <code className="bg-gray-800 px-2 py-1 rounded">public/images/{categoryName.toLowerCase()}.jpg</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-contain"
      onError={() => setHasError(true)}
    />
  );
}

export default function SpaceHome() {
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [activeNav, setActiveNav] = useState('Markets');
  const [leverageAmount, setLeverageAmount] = useState(2500);
  const [leverage, setLeverage] = useState(5);
  const [raised, setRaised] = useState(1.2);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update raised amount periodically
  useEffect(() => {
    const liveUpdate = setInterval(() => {
      setRaised((prev) => Math.min(prev + Math.random() * 0.01, 5.0));
    }, 5000);
    return () => clearInterval(liveUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWaitlistClick = () => {
    setShowWaitlistModal(true);
    setIsSubmitted(false);
    setEmail('');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('请输入有效的邮箱地址');
      return;
    }

    // 存储到 localStorage
    try {
      const existingEmails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]');
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem('waitlist_emails', JSON.stringify(existingEmails));
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setShowWaitlistModal(false);
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('保存邮箱失败:', error);
      alert('保存失败，请重试');
    }
  };

  const categories = [
    { name: 'Trending', icon: Flame },
    { name: 'Breakouts', icon: ArrowUpRight },
    { name: 'New', icon: Star },
    { name: 'Crypto' },
    { name: 'Politics' },
    { name: 'Sports' },
    { name: 'Tech' },
    { name: 'Economy' },
    { name: 'Culture' },
    { name: 'Beyond' },
  ];

  // 所有分类使用同一张图片
  // Next.js 图片导入可能返回对象或字符串，统一处理
  const homeImageSrc = typeof homeImage === 'string' ? homeImage : homeImage.src || (homeImage as any).default || homeImage;
  const logoImageSrc = typeof logoImage === 'string' ? logoImage : logoImage.src || (logoImage as any).default || logoImage;
  const predict1ImageSrc = typeof predict1Image === 'string' ? predict1Image : predict1Image.src || (predict1Image as any).default || predict1Image;
  const predict2ImageSrc = typeof predict2Image === 'string' ? predict2Image : predict2Image.src || (predict2Image as any).default || predict2Image;
  const predict3ImageSrc = typeof predict3Image === 'string' ? predict3Image : predict3Image.src || (predict3Image as any).default || predict3Image;
  
  const categoryImages: Record<string, string> = {
    Trending: homeImageSrc,
    Breakouts: homeImageSrc,
    New: homeImageSrc,
    Crypto: homeImageSrc,
    Politics: homeImageSrc,
    Sports: homeImageSrc,
    Tech: homeImageSrc,
    Economy: homeImageSrc,
    Culture: homeImageSrc,
    Beyond: homeImageSrc,
  };

  // 根据导航项切换图片
  const navImages: Record<string, string> = {
    Markets: predict1ImageSrc,
    Trade: predict2ImageSrc,
    Portfolio: predict3ImageSrc,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-900/30 via-blue-800/20 to-black pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <img src={logoImageSrc} alt="Logo" className="h-8 w-auto" />
            </div>
            <a 
              href="https://x.com/LikeliOfficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <XLogo size={20} />
            </a>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-5 py-2.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/60 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-300">Built on BNB</span>
              </div>
              <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/60 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300">World&apos;s First Leveraged Prediction Market</span>
              </div>
            </div>

            <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              10x Prediction Markets
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              The arena where truth wins, capital flows, and the sharpest minds compete daily.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-yellow-400 text-4xl">🏆</div>
              <button 
                onClick={handleWaitlistClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
              >
                Waitlist
              </button>
              <div className="text-yellow-400 text-4xl">🏆</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800' : 'bg-black/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <img src={logoImageSrc} alt="Logo" className="h-6 w-auto" />
            </div>

            {/* Center: Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setActiveNav('Markets')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                  activeNav === 'Markets'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Markets
              </button>
              <button
                onClick={() => setActiveNav('Trade')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                  activeNav === 'Trade'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Trade
              </button>
              <button
                onClick={() => setActiveNav('Portfolio')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                  activeNav === 'Portfolio'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                Portfolio
              </button>
            </div>

            {/* Right: Waitlist Button */}
            <button
              onClick={handleWaitlistClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Image Display */}
        <div className="w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
          <ImageWithFallback
            src={navImages[activeNav] || navImages.Markets}
            alt={activeNav}
            categoryName={activeNav}
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pick outcomes, set your position and optional leverage, then cash out anytime or hold until the market resolves.
          </p>
        </div>

        {/* Three Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1: Choose a Market */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-white">Choose a Market</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Browse crypto, politics, sports, tech, economics, culture, and more. Pick outcomes you know better than the crowd does.
            </p>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <img
                src={predict1ImageSrc}
                alt="Choose a Market"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Step 2: Build Your Position */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-white">Build Your Position</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Buy YES or NO shares with market orders for instant fills, or set limit orders at any price and wait for them to execute.
            </p>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <img
                src={predict2ImageSrc}
                alt="Build Your Position"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Step 3: Multiply Your Returns */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-white">Multiply Your Returns</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Multiply your exposure up to 10x with leverage. Small capital and big positions means outsized returns when you&apos;re right.
            </p>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <img
                src={predict3ImageSrc}
                alt="Multiply Your Returns"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* More Power Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-white">
          Why Likeli.io Will 10x Your Investment
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          This is not just another token. This is the future of decentralized prediction markets.
          </p>
        </div>

        {/* Three Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Leverage Trade */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Leverage Trade</h3>
            
            {/* Yes/No Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-green-500/20 border-2 border-green-500 text-green-400 py-2 rounded-lg font-semibold">
                Yes 33¢
              </button>
              <button className="flex-1 bg-gray-800 border-2 border-gray-700 text-gray-400 py-2 rounded-lg font-semibold hover:border-red-500 hover:text-red-400 transition-colors">
                No 67¢
              </button>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Amount</div>
              <div className="text-4xl font-bold text-white mb-3">${leverageAmount.toLocaleString()}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLeverageAmount((prev) => prev + 1)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-1.5 rounded text-sm font-semibold transition-colors"
                >
                  +$1
                </button>
                <button
                  onClick={() => setLeverageAmount((prev) => prev + 20)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-1.5 rounded text-sm font-semibold transition-colors"
                >
                  +$20
                </button>
                <button
                  onClick={() => setLeverageAmount((prev) => prev + 100)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-1.5 rounded text-sm font-semibold transition-colors"
                >
                  +$100
                </button>
                <button
                  onClick={() => setLeverageAmount(10000)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-1.5 rounded text-sm font-semibold transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-4">Cost: ${(leverageAmount / leverage).toFixed(2)}</div>

            {/* Leverage Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Leverage</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-400">{leverage}x</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Leverage lets you trade bigger with less capital, multiplying profits fast.
            </p>
          </div>

          {/* Card 2: Hyperliquid Ecosystem */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Hyperliquid Ecosystem</h3>
            
            {/* Ecosystem Integration Graphic */}
            <div className="relative h-64 mb-4 flex items-center justify-center bg-gray-800/50 rounded-lg overflow-hidden">
              <img
                src={`https://picsum.photos/seed/hyperliquid/400/300`}
                alt="Hyperliquid Ecosystem"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Central Hub - Hyperliquid */}
                  <div className="absolute z-10 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Network className="text-white" size={24} />
                  </div>
                  
                  {/* Ecosystem Components */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-cyan-500/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      Prediction Markets
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      Order Book
                    </div>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-10 h-10 bg-green-500/80 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="text-white" size={16} />
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                    <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ecosystem Features List */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300">Native Hyperliquid integration</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Deep liquidity from orderbook</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">On-chain settlement & security</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Built on Hyperliquid&apos;s high-performance infrastructure for seamless prediction markets trading with minimal slippage.
            </p>
          </div>

          {/* Card 3: AI Bot Builder */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-white">AI Bot Builder</h3>
            
            {/* AI Bot Graphic */}
            <div className="relative h-64 mb-4 flex items-center justify-center bg-gray-800/50 rounded-lg overflow-hidden">
              <img
                src={`https://picsum.photos/seed/ai-bot/400/300`}
                alt="AI Trading Bot"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Bot Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                    <Bot className="text-white" size={48} />
                  </div>
                  
                  {/* AI Indicators */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  
                  {/* Code Lines */}
                  <div className="absolute top-0 left-full ml-4 space-y-1">
                    <div className="w-16 h-1 bg-blue-500/50 rounded"></div>
                    <div className="w-12 h-1 bg-purple-500/50 rounded"></div>
                    <div className="w-14 h-1 bg-pink-500/50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="text-yellow-400" size={16} />
                <span className="text-gray-300">Custom AI strategies</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-gray-300">Automated trading</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="text-blue-400" size={16} />
                <span className="text-gray-300">Machine learning models</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Create your own AI prediction trading bot with custom strategies and automation.
            </p>
          </div>
        </div>
      </div>

      {/* Markets Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Markets
          </h2>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              <ArrowUpRight className="rotate-[225deg]" size={20} />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              <ArrowUpRight className="rotate-45" size={20} />
            </button>
          </div>
        </div>

        {/* Market Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Crypto',
              icon: '₿',
              image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=500&fit=crop',
              description: 'BTC, SOL, ETH targets, altcoin milestones, DeFi growth, and the battle between crypto vs traditional assets.',
            },
            {
              title: 'Politics',
              icon: '🏛️',
              image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=500&fit=crop',
              description: 'Elections, leadership shifts, policy decisions, and global diplomacy shaping the future of nations worldwide.',
            },
            {
              title: 'Sports',
              icon: '⚽',
              image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop',
              description: 'Champions, major results, and top stars across football, basketball, tennis, combat sports, e-sports, and racing.',
            },
            {
              title: 'Tech',
              icon: '⚙️',
              image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=500&fit=crop',
              description: 'AI, hardware, and product breakthroughs, major tech earnings, and financial milestones fueling innovation.',
            },
          ].map((market, i) => (
            <div
              key={i}
              className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
            >
              {/* Background Image */}
              <div className="relative h-80">
                <img
                  src={market.image}
                  alt={market.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-lg">
                  {market.icon}
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{market.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {market.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-lime-400 font-semibold text-sm hover:gap-3 transition-all"
                >
                  Market insights
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backed By Industry Leaders Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16">
          Backed By Industry Leaders
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10 text-center hover:border-blue-500/50 transition-all">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
              $2M+
            </div>
            <div className="text-xl font-bold text-white mb-3">Pre-seed Funding</div>
            <div className="text-gray-400 text-sm">From top-tier VCs</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10 text-center hover:border-purple-500/50 transition-all">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              5 Years
            </div>
            <div className="text-xl font-bold text-white mb-3">Team Experience</div>
            <div className="text-gray-400 text-sm">Ex-Coinbase, Binance, Polymarket</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10 text-center hover:border-green-500/50 transition-all">
            <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              100%
            </div>
            <div className="text-xl font-bold text-white mb-3">Audited & Secure</div>
            <div className="text-gray-400 text-sm">By Certik & Hacken</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Participate?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join the world&apos;s first leveraged prediction market. Trade on real-world events with up to 10x leverage.
            </p>
            <button
              onClick={handleWaitlistClick}
              className="bg-white hover:bg-gray-100 text-blue-600 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 mx-auto"
            >
              <span>Join Waitlist</span>
              <ArrowUpRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">L</span>
                </div>
                <span className="text-xl font-bold text-white">Likeli.io</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The world&apos;s first leveraged prediction market using native crypto assets.
              </p>
              <a 
                href="https://x.com/LikeliOfficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <XLogo size={18} />
                <span className="text-sm">@LikeliOfficial</span>
              </a>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Whitepaper</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tokenomics</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Use</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Disclaimer</a></li>
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h3 className="text-white font-bold mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://x.com/LikeliOfficial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <XLogo size={14} />
                    X (Twitter)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Copyright © 2026 Likeli.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowWaitlistModal(false);
                setIsSubmitted(false);
                setEmail('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Join the Waitlist</h2>
                  <p className="text-gray-400">
                    Be among the first to experience the world&apos;s first leveraged prediction market
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
                  >
                    Join Waitlist
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                <p className="text-gray-400">
                  Thank you for joining! We&apos;ll notify you when we launch.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
