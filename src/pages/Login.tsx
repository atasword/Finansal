import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600 flex items-center justify-center shadow-xl shadow-sage-400/40 mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Finansal Takip</h1>
          <p className="text-sage-300 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-sage-900/80 backdrop-blur-xl rounded-3xl border border-sage-800/60 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-sage-200 mb-2">E-posta</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-sage-800/60 border border-sage-700 rounded-xl text-white placeholder-sage-600 hover:border-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 transition-all"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-sage-200 mb-2">Şifre</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-sage-800/60 border border-sage-700 rounded-xl text-white placeholder-sage-600 hover:border-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-sage-500 hover:text-sage-300 transition-colors cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sage-400 to-sage-500 text-white font-semibold rounded-xl hover:from-sage-300 hover:to-sage-400 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Giriş Yap
            </button>
          </form>

          <p className="text-center text-sm text-sage-500 mt-6">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-sage-300 hover:text-sage-200 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 rounded">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
