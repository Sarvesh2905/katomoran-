import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link2, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '../components/UI/Input.jsx'
import { Button } from '../components/UI/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { login } from '../api/auth.js'
import { useToast } from '../components/UI/Toaster.jsx'
import { Toaster } from '../components/UI/Toaster.jsx'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function LoginPage() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await login(data)
      loginUser(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}>
      {/* Cosmic background */}
      <div className="cosmic-bg">
        <div className="cosmic-stars" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-md"
                style={{ background: 'rgba(124,58,237,0.5)' }} />
              <div className="relative p-3 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Link2 className="h-7 w-7 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold gradient-text">Katomaran</span>
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your analytics dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid var(--border-default)' }}>
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl aurora-gradient"
            style={{ position: 'relative', height: '2px', marginBottom: '24px',
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #ec4899)', borderRadius: '2px' }} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 p-1 rounded-md transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one →
            </Link>
          </p>
        </div>
      </motion.div>
      <Toaster />
    </div>
  )
}