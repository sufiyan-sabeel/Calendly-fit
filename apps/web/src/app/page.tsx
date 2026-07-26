'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Shield, Smartphone, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-deep">
      {/* Navigation */}
      <nav className="glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center">
              <span className="font-heading font-bold text-white text-lg">CF</span>
            </div>
            <span className="font-heading text-xl font-bold text-white">Calendy Fit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-muted hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Premium Scheduling for{' '}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Fitness Pros
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto">
            The all-in-one platform for personal trainers, coaches, and wellness professionals
            to manage appointments, clients, and grow your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-heading font-semibold text-lg transition-colors inline-flex items-center gap-2"
            >
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link
              href="/auth/login"
              className="glass-medium hover:bg-glass-bg text-white px-8 py-3 rounded-xl font-heading font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-heading text-4xl font-bold text-white text-center mb-16">
          Everything you need to run your practice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-8 hover:bg-surface-card/80 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass rounded-3xl p-12 md:p-16">
          <h2 className="font-heading text-4xl font-bold text-white mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
            Join thousands of fitness professionals using Calendy Fit to manage their practice.
          </p>
          <Link
            href="/auth/register"
            className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-heading font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted">
          <p>&copy; 2024 Calendy Fit. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: <Calendar className="text-white" size={24} />,
    title: 'Smart Scheduling',
    description: 'Intelligent appointment booking with real-time availability, timezone support, and automatic conflict detection.',
  },
  {
    icon: <Users className="text-white" size={24} />,
    title: 'Client Management',
    description: 'Comprehensive client profiles with progress tracking, workout plans, diet plans, and session history.',
  },
  {
    icon: <Smartphone className="text-white" size={24} />,
    title: 'Mobile & Web',
    description: 'Full-featured mobile app for iOS & Android plus a powerful web dashboard for desktop management.',
  },
  {
    icon: <Globe className="text-white" size={24} />,
    title: 'Google Integrations',
    description: 'Seamless sync with Google Calendar, Maps, Contacts, and Drive. Auto-generate Google Meet links.',
  },
  {
    icon: <Shield className="text-white" size={24} />,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with Row Level Security, encrypted storage, and GDPR compliance.',
  },
  {
    icon: <DollarSign className="text-white" size={24} />,
    title: 'Payments & Invoicing',
    description: 'Built-in payment processing with Stripe, Google Pay, Apple Pay, and automated invoicing.',
  },
];

function DollarSign(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
