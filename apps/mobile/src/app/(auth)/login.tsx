/**
 * Calendy Fit Mobile - Login Screen
 * Supabase Auth with Email/Password and Google OAuth
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Chrome as Google, ArrowLeft } from 'lucide-react-native';

import { useAuth } from '@calendy/hooks';
import { validateEmail, validatePassword } from '@calendy/utils';

const colors = {
  surface: { deep: '#000000', card: '#121212' },
  glass: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', 'bg-medium': 'rgba(255,255,255,0.08)' },
  text: { primary: '#EDEDEF', secondary: '#8A8F98', muted: '#6B7280', inverse: '#0F172A' },
  primary: { DEFAULT: '#F97316' },
  error: '#EF4444',
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string | null>>({});

  const handleLogin = async () => {
    const e = validateEmail(email);
    const p = validatePassword(password);
    setLocalErrors({ email: e.isValid ? null : e.error, password: p.isValid ? null : p.error });
    if (!e.isValid || !p.isValid) return;
    try { await signIn(email, password); } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.deep }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={{ width: 44, height: 44, justifyContent: 'center', marginTop: 8 }}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
            <LinearGradient colors={['#F97316', '#EA580C']} style={{ width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'BarlowCondensed', fontSize: 28, fontWeight: '700', color: colors.text.inverse }}>CF</Text>
            </LinearGradient>
            <Text style={{ fontFamily: 'BarlowCondensed', fontSize: 32, fontWeight: '700', color: colors.text.primary }}>Welcome Back</Text>
            <Text style={{ fontFamily: 'Barlow', fontSize: 16, color: colors.text.secondary, textAlign: 'center' }}>Sign in to manage your fitness journey</Text>
          </View>

          {error && (
            <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 0.5, borderColor: 'rgba(239,68,68,0.3)' }}>
              <Text style={{ fontFamily: 'Barlow', fontSize: 14, color: colors.error, textAlign: 'center' }}>{error}</Text>
            </View>
          )}

          <View style={{ backgroundColor: colors.glass.bg, borderRadius: 16, borderWidth: 0.5, borderColor: colors.glass.border, padding: 16, marginBottom: 24, overflow: 'hidden' }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontFamily: 'Barlow', fontSize: 14, fontWeight: '500', color: colors.text.secondary, marginBottom: 8 }}>Email</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.glass.bg, borderRadius: 12, borderWidth: 0.5, borderColor: localErrors.email ? colors.error : colors.glass.border, paddingHorizontal: 16, minHeight: 48 }}>
                <Mail size={18} color={colors.text.muted} />
                <TextInputCustom placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              {localErrors.email && <Text style={{ fontFamily: 'Barlow', fontSize: 12, color: colors.error, marginTop: 4 }}>{localErrors.email}</Text>}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontFamily: 'Barlow', fontSize: 14, fontWeight: '500', color: colors.text.secondary, marginBottom: 8 }}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.glass.bg, borderRadius: 12, borderWidth: 0.5, borderColor: localErrors.password ? colors.error : colors.glass.border, paddingHorizontal: 16, minHeight: 48 }}>
                <TextInputCustom placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
              </View>
              {localErrors.password && <Text style={{ fontFamily: 'Barlow', fontSize: 12, color: colors.error, marginTop: 4 }}>{localErrors.password}</Text>}
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'Barlow', fontSize: 14, color: colors.primary.DEFAULT, fontWeight: '500' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{ backgroundColor: colors.primary.DEFAULT, borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: isLoading ? 0.5 : 1 }}
            >
              <Text style={{ fontFamily: 'BarlowCondensed', fontSize: 18, fontWeight: '600', color: colors.text.inverse, letterSpacing: 0.5 }}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 0.5, backgroundColor: colors.glass.border }} />
            <Text style={{ fontFamily: 'Barlow', fontSize: 14, color: colors.text.muted, marginHorizontal: 16 }}>or continue with</Text>
            <View style={{ flex: 1, height: 0.5, backgroundColor: colors.glass.border }} />
          </View>

          <TouchableOpacity
            onPress={() => signInWithGoogle()}
            style={{ backgroundColor: colors.glass['bg-medium'], borderRadius: 12, borderWidth: 0.5, borderColor: colors.glass.border, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            <Google size={20} color={colors.text.primary} />
            <Text style={{ fontFamily: 'Barlow', fontSize: 16, fontWeight: '500', color: colors.text.primary }}>Google</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
            <Text style={{ fontFamily: 'Barlow', fontSize: 15, color: colors.text.secondary }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={{ fontFamily: 'Barlow', fontSize: 15, color: colors.primary.DEFAULT, fontWeight: '600' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple TextInput wrapper to avoid repeating styles
function TextInputCustom(props: any) {
  const { default: TI } = require('react-native');
  return <TI.TextInput
    placeholderTextColor={colors.text.muted}
    style={{ flex: 1, fontFamily: 'Barlow', fontSize: 16, color: colors.text.primary, paddingVertical: 12 }}
    {...props}
  />;
}
