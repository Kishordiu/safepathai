import { Link, useNavigate } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ParentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profileData } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      if (profileData?.role === 'school_admin') navigate('/school/dashboard');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message === 'Invalid login credentials' ? 'Invalid email or password' : (err.message ?? 'Unable to sign in'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 70%, hsl(185 60% 42% / 0.4), transparent 60%)' }} />
        <div className="relative text-white max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome back, Parent</h2>
          <p className="text-white/80 text-lg leading-relaxed">Your child's safety dashboard is one step away. Sign in to view real-time location, route intelligence, and predictive safety alerts.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SafePath AI</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Parent Login</h1>
          <p className="text-muted-foreground mb-8">Sign in to monitor your child's safety</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="parent@example.com" className="rounded-xl h-11" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
            <div className="space-y-2">
              <div className="flex justify-between"><Label>Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link></div>
              <Input type="password" placeholder="••••••••" className="rounded-xl h-11" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <BubbleButton type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</BubbleButton>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            School administrator? <Link to="/admin/login" className="text-primary font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
