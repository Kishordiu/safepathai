import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const [role, setRole] = useState<'parent' | 'school_admin'>('parent');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            mobile_number: phone,
            role,
            school_name: schoolName || null,
          },
        },
      });
      if (error) throw error;
      navigate(role === 'school_admin' ? '/admin/login' : '/login');
    } catch (err: any) {
      setError(err.message ?? 'Unable to register');
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
          <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
          <p className="text-muted-foreground text-center mb-6">Start protecting your child today</p>
          <div className="flex gap-2 mb-6">
            {([
              { key: 'parent', label: '👨‍👩‍👧 Parent' },
              { key: 'school_admin', label: '🏫 School' },
            ] as const).map((r) => (
              <button key={r.key} onClick={() => setRole(r.key)} type="button"
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${role === r.key ? 'gradient-primary text-white shadow-safe-md' : 'bg-muted text-muted-foreground'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Your full name" className="rounded-xl h-11" value={fullName} onChange={(e)=>setFullName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@example.com" className="rounded-xl h-11" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label>School Name</Label><Input placeholder="School name" className="rounded-xl h-11" value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Phone Number</Label><Input type="tel" placeholder="+91 98765 43210" className="rounded-xl h-11" value={phone} onChange={(e)=>setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Create a strong password" className="rounded-xl h-11" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <BubbleButton type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</BubbleButton>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
