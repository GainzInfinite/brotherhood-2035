import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  DollarSign,
  Brain,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  Target,
  Crown,
  ArrowRight,
  Check,
  Zap,
} from "lucide-react"
import MarketingHeader from "@/components/MarketingHeader"

export default function LandingPage() {
  const valuePillars = [
    {
      icon: Heart,
      title: "Health Mastery",
      description: "Track workouts, nutrition, and biometrics. Build the physical foundation of a disciplined life through consistent daily logging.",
    },
    {
      icon: DollarSign,
      title: "Wealth Tracking",
      description: "Monitor income streams, expenses, and portfolio growth. Financial clarity drives financial freedom and purposeful living.",
    },
    {
      icon: Brain,
      title: "Mind & Discipline",
      description: "Journal reflections, track meditation, and measure consistency. Master your thoughts to master your reality.",
    },
  ]

  const features = [
    { icon: Calendar, title: "Unified Calendar", description: "All modules in one view" },
    { icon: TrendingUp, title: "Retroactive Logging", description: "Track income anytime" },
    { icon: DollarSign, title: "Expense Tracking", description: "Complete financial visibility" },
    { icon: Target, title: "Consistency Engine", description: "Build unbreakable habits" },
    { icon: BookOpen, title: "Autosaving Journal", description: "Never lose your thoughts" },
    { icon: Users, title: "Clans & Brotherhood", description: "Connect with like-minded men" },
  ]

  const pricingFeatures = [
    "All modules included",
    "Clans + community access",
    "Unlimited journal entries",
    "Advanced wealth analytics",
    "Discipline tracking engine",
    "Secure cloud sync",
  ]

  return (
    <div className="min-h-screen bg-black text-[#F5E6D3]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1410] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold font-cinzel mb-8 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-clip-text text-transparent tracking-tight leading-tight">
            THE BROTHERHOOD OS
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-[#F5E6D3]/80 mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
            A discipline command center for men who refuse to settle. Master your health, wealth, mind, and life.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-lg transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-95 text-xl"
            >
              Start Your 14-Day Free Trial
              <ArrowRight className="h-6 w-6" />
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-gold-500/50 hover:border-gold-500 text-gold-500 font-bold rounded-lg transition-all hover:bg-gold-500/10 text-xl"
            >
              See Command Center
            </a>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/30 border-2 border-gold-500/40 hover:border-gold-500/60 transition-all duration-500">
              <Image
                src="/screenshots/command-center-income-format.png"
                alt="Brotherhood OS Command Center"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Brotherhood OS Exists */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1a1410] to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold font-cinzel mb-8 text-gold-500">
            Why Brotherhood OS Exists
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-[#F5E6D3]/80 leading-relaxed">
            <p>
              Modern men are drowning in chaos. No structure. No accountability. No clear identity or path forward.
            </p>
            <p>
              <span className="text-gold-500 font-semibold">Brotherhood OS</span> gives you a command center for life mastery—a single place to track your health, build your wealth, sharpen your mind, and cultivate unbreakable discipline.
            </p>
            <p>
              It&apos;s not another productivity app. It&apos;s a complete operating system for men who refuse to be average.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <Zap className="w-16 h-16 text-gold-500" />
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[#1a1410]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold font-cinzel text-center mb-20 text-gold-500">
            Three Pillars of Mastery
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {valuePillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div
                  key={index}
                  className="group bg-[#1a1410] border border-gold-500/20 rounded-2xl p-10 hover:border-gold-500/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-105"
                >
                  <div className="w-20 h-20 bg-gold-500/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-colors">
                    <Icon className="w-10 h-10 text-gold-500" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[#F5E6D3]">{pillar.title}</h3>
                  <p className="text-[#F5E6D3]/70 leading-relaxed text-lg">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Screenshot Showcase */}
      <section id="showcase" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold font-cinzel text-center mb-8 text-gold-500">
            Built for Discipline
          </h2>
          <p className="text-xl sm:text-2xl text-[#F5E6D3]/70 text-center mb-20 max-w-4xl mx-auto leading-relaxed">
            Every feature designed to help you track, optimize, and dominate your daily progress.
          </p>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl shadow-gold-500/20 hover:border-gold-500/60 transition-all duration-300">
                <Image
                  src="/screenshots/wealth-header-buttons.png"
                  alt="Wealth Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center text-[#F5E6D3]/80 text-lg">Track income and expenses with precision</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl shadow-gold-500/20 hover:border-gold-500/60 transition-all duration-300">
                <Image
                  src="/screenshots/onboarding-after-profile.png"
                  alt="Onboarding Flow"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center text-[#F5E6D3]/80 text-lg">Personalized setup in minutes</p>
            </div>

            <div className="space-y-6 md:col-span-2 max-w-3xl mx-auto">
              <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl shadow-gold-500/20 hover:border-gold-500/60 transition-all duration-300">
                <Image
                  src="/screenshots/journal-autosave-feedback.png"
                  alt="Journal Autosave"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center text-[#F5E6D3]/80 text-lg">Autosaving journal with rich formatting—never lose your thoughts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold font-cinzel text-center mb-20 text-gold-500">
            Everything You Need
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-[#1a1410] border border-gold-500/20 rounded-xl p-8 hover:border-gold-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="w-10 h-10 text-gold-500 mb-6" />
                  <h3 className="text-xl font-bold mb-3 text-[#F5E6D3]">{feature.title}</h3>
                  <p className="text-[#F5E6D3]/60 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold font-cinzel text-center mb-20 text-gold-500">
            Simple, Honest Pricing
          </h2>
          
          <div className="bg-gradient-to-br from-[#1a1410] to-black border-2 border-gold-500/40 rounded-2xl p-10 sm:p-16 hover:border-gold-500/70 transition-all duration-300 hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gold-500/10 rounded-full mb-8">
                <Crown className="w-12 h-12 text-gold-500" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-[#F5E6D3]">Elite Membership</h3>
              <div className="flex items-baseline justify-center gap-3 mb-3">
                <span className="text-6xl sm:text-7xl font-bold text-gold-500">$20.35</span>
                <span className="text-2xl sm:text-3xl text-[#F5E6D3]/60">/month</span>
              </div>
              <p className="text-lg text-[#F5E6D3]/60">Cancel anytime • No hidden fees</p>
            </div>

            <div className="space-y-5 mb-12">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-7 h-7 bg-gold-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-5 h-5 text-gold-500" />
                  </div>
                  <span className="text-lg text-[#F5E6D3]/90">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="block w-full text-center px-10 py-5 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-lg transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-95 text-xl"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] to-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-cinzel mb-10 text-gold-500 leading-tight">
            Become the man you were meant to be.
          </h2>
          <p className="text-xl sm:text-2xl text-[#F5E6D3]/80 mb-12 leading-relaxed">
            Your data is yours. No ads. No upsells. Just pure discipline engineering.
          </p>
          
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-lg transition-all hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] active:scale-95 text-xl"
          >
            Start Your Free Trial
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-gold-500/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-gold-500 mb-5 font-cinzel text-lg">Brotherhood OS</h4>
              <p className="text-[#F5E6D3]/60 leading-relaxed">A discipline command center for modern men.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#F5E6D3] mb-5">Product</h4>
              <ul className="space-y-3 text-[#F5E6D3]/60">
                <li><Link href="/landing" className="hover:text-gold-500">Features</Link></li>
                <li><Link href="/landing#pricing" className="hover:text-gold-500">Pricing</Link></li>
                <li><Link href="/auth/signup" className="hover:text-gold-500">Free Trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#F5E6D3] mb-5">Account</h4>
              <ul className="space-y-3 text-[#F5E6D3]/60">
                <li><Link href="/auth/login" className="hover:text-gold-500">Log In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-gold-500">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#F5E6D3] mb-5">Legal</h4>
              <ul className="space-y-3 text-[#F5E6D3]/60">
                <li><a href="#" className="hover:text-gold-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gold-500">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gold-500/20 pt-10 text-center text-[#F5E6D3]/60">
            <p>© {new Date().getFullYear()} Brotherhood OS. Built for discipline. Designed for mastery.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
