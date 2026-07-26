'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, DollarSign, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-deep flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-deep">
      {/* Header */}
      <header className="glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center">
              <span className="font-heading font-bold text-white text-lg">CF</span>
            </div>
            <h1 className="font-heading text-xl font-bold text-white">Calendy Fit</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user?.email}</span>
            <button onClick={handleSignOut} className="text-muted hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-muted mt-1">Welcome back! Here&apos;s your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, label: 'Today\'s Sessions', value: '3', color: 'from-primary to-primary-600' },
            { icon: <Clock size={20} />, label: 'Upcoming', value: '8', color: 'from-accent to-green-600' },
            { icon: <Users size={20} />, label: 'Active Clients', value: '12', color: 'from-blue-500 to-blue-600' },
            { icon: <DollarSign size={20} />, label: 'Revenue (MTD)', value: '$2,450', color: 'from-purple-500 to-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                {React.cloneElement(stat.icon, { className: 'text-white' })}
              </div>
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-heading text-xl font-bold text-white mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {[
              { client: 'Sarah Johnson', time: '9:00 AM', service: 'Personal Training', status: 'Confirmed' },
              { client: 'Mike Chen', time: '10:30 AM', service: 'Online Coaching', status: 'Confirmed' },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-card rounded-lg border border-glass-border">
                <div>
                  <p className="font-medium text-white">{session.client}</p>
                  <p className="text-sm text-muted">{session.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{session.time}</p>
                  <span className="text-xs text-accent">{session.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
