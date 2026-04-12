import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage('Reset link sent. Check your email inbox.');
    } catch (err: any) {
      setError(err.message ?? 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SafePath AI</span>
        </Link>
        <div className="rounded-2xl border bg-card p-8 shadow-safe-lg">
          <h1 className="text-2xl font-bold text-center mb-1">Reset Password</h1>
          <p className="text-muted-foreground text-center mb-6">Enter your email and we'll send a reset link</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2"><Label>Email Address</Label><Input type="email" placeholder="you@example.com" className="rounded-xl h-11" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
            {message ? <p className="text-sm text-safe">{message}</p> : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <BubbleButton type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</BubbleButton>
          </form>
          <Link to="/login" className="mt-4 flex items-center justify-center gap-1 text-sm text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
