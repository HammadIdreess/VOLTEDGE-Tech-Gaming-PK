'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-white">Contact &amp; Customer Support</h1>
        <p className="text-xs text-slate-400">
          Have questions about PC compatibility, order status, or warranty claims? Our technical support team in Lahore is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Box */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Support Coordinates
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-200">Fulfillment Hub &amp; Office</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Sector C, Commercial Area, DHA Phase 5, Lahore, Punjab, Pakistan
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-200">Phone &amp; WhatsApp Support</p>
                <p className="text-slate-400 mt-0.5">+92 300 1234567 / +92 42 35740000</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-200">Email Inquiries</p>
                <p className="text-slate-400 mt-0.5">support@voltedge.pk (General &amp; Orders)</p>
                <p className="text-slate-400">warranty@voltedge.pk (RMA &amp; Warranty)</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-200">Operating Hours</p>
                <p className="text-slate-400 mt-0.5">Monday – Saturday: 11:00 AM – 9:00 PM PKT</p>
                <p className="text-slate-400">Sunday: Closed for order dispatches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Send a Technical Message
          </h2>

          {submitted ? (
            <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-100">Message Received!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. A VoltEdge technical representative will reply to your inquiry within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asad Ali"
                    className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.pk"
                    className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subject / Order Number</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Order #VE-20261024 or GPU Compatibility Inquiry"
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our technical support team help your setup?"
                  className="w-full bg-slate-800 border border-white/10 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
