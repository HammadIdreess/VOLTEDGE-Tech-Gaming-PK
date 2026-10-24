import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, Clock, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050810] border-t border-white/10 text-slate-400 text-xs">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/5 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">100% Genuine Sealed</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct from authorized brand distributors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Nationwide Express</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Insured 24-48h delivery via TCS & Leopard</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Official Brand Warranty</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Up to 3-5 years local warranty claim</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">COD & Bank Transfer</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Secure payment options across Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                VOLT<span className="text-blue-500">EDGE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Pakistan&apos;s premier online technology retailer specializing in PC components, custom gaming rigs, esports peripherals, and certified computer hardware.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Sector C, DHA Phase 5, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+92 300 1234567 / +92 42 35740000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>support@voltedge.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">PC Hardware</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=graphics-cards" className="hover:text-cyan-400 transition-colors">
                  Graphics Cards (RTX 40-Series)
                </Link>
              </li>
              <li>
                <Link href="/products?category=processors-cpus" className="hover:text-cyan-400 transition-colors">
                  Processors (AMD & Intel)
                </Link>
              </li>
              <li>
                <Link href="/products?category=motherboards" className="hover:text-cyan-400 transition-colors">
                  Motherboards (AM5 / LGA1700)
                </Link>
              </li>
              <li>
                <Link href="/products?category=ram-memory" className="hover:text-cyan-400 transition-colors">
                  DDR5 & DDR4 Gaming RAM
                </Link>
              </li>
              <li>
                <Link href="/products?category=ssds-storage" className="hover:text-cyan-400 transition-colors">
                  NVMe Gen4 & Gen5 SSDs
                </Link>
              </li>
              <li>
                <Link href="/products?category=power-supplies" className="hover:text-cyan-400 transition-colors">
                  ATX 3.0 Power Supplies
                </Link>
              </li>
            </ul>
          </div>

          {/* Gaming Gear */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Gaming & Gear</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=gaming-monitors" className="hover:text-cyan-400 transition-colors">
                  240Hz & OLED Monitors
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming-keyboards" className="hover:text-cyan-400 transition-colors">
                  Mechanical Keyboards
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming-mice" className="hover:text-cyan-400 transition-colors">
                  Ultralight Esports Mice
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming-headsets" className="hover:text-cyan-400 transition-colors">
                  Spatial Audio Headsets
                </Link>
              </li>
              <li>
                <Link href="/products?category=cases-cooling" className="hover:text-cyan-400 transition-colors">
                  Tempered Glass Cases & AIOs
                </Link>
              </li>
              <li>
                <Link href="/products?category=cables-connectivity" className="hover:text-cyan-400 transition-colors">
                  DisplayPort 2.1 & 8K HDMI
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About VoltEdge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-cyan-400 transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-cyan-400 transition-colors">
                  Return & Warranty Claims
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-cyan-400 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 VoltEdge Technologies. All rights reserved. Registered in Pakistan.
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
              Bank Transfer (HBL / Meezan)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
              Visa / MasterCard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
