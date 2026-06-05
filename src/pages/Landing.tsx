import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Brain, Mic, BarChart3, FileText,
  Shield, Zap, Target, ChevronDown, ChevronUp, Star, Play,
  Clock, Users, Award, TrendingUp, CheckCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[128px]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Google Gemini AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6"
          >
            <span className="text-white">Ace your next</span>
            <br />
            <span className="gradient-text">interview</span>
            <span className="text-white"> with AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Practice with AI-generated questions tailored to your resume and job role.
            Get instant feedback, scores, and actionable insights to improve.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center gap-2 group"
            >
              Start Practicing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary px-8 py-3.5 rounded-2xl text-base font-medium text-gray-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
          >
            {[
              { value: '10K+', label: 'Interviews Taken' },
              { value: '95%', label: 'Success Rate' },
              { value: '4.9', label: 'User Rating' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Hero Image / Mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="glass-card rounded-3xl p-1 max-w-4xl mx-auto">
              <div className="bg-gray-900/80 rounded-[20px] p-6 sm:p-8">
                {/* Mock Dashboard */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4 h-7 bg-white/5 rounded-lg flex items-center px-3">
                    <span className="text-xs text-gray-500">interviewbuddy.ai/dashboard</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Overall Score', value: '85/100', color: 'from-blue-500 to-blue-600' },
                    { label: 'Interviews', value: '12', color: 'from-emerald-500 to-emerald-600' },
                    { label: 'Improvement', value: '+23%', color: 'from-purple-500 to-purple-600' },
                  ].map(card => (
                    <div key={card.label} className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">{card.label}</div>
                      <div className={`text-xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 h-32">
                    <div className="text-xs text-gray-500 mb-3">Score History</div>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 55, 50, 65, 70, 68, 78, 82, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500/60 to-blue-400/30 rounded-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 h-32">
                    <div className="text-xs text-gray-500 mb-3">Current Session</div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Technical Interview</div>
                        <div className="text-xs text-gray-500">Question 3 of 10</div>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full">
                      <div className="h-full w-[30%] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      </section>

      {/* Logos / Trust Banner */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-8">Trusted by candidates interviewing at</p>
          <div className="flex items-center justify-center gap-8 sm:gap-16 flex-wrap opacity-40">
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map(company => (
              <span key={company} className="text-lg sm:text-xl font-bold text-gray-400">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[128px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" /> Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Everything you need to
              <br />
              <span className="gradient-text">nail your interview</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed to prepare you for any interview scenario.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Brain,
                title: 'AI-Powered Questions',
                description: 'Questions generated from your resume, tailored to the specific job role, difficulty level, and interview type.',
                gradient: 'from-blue-500 to-blue-600',
                glow: 'blue',
              },
              {
                icon: Mic,
                title: 'Voice Mode',
                description: 'Answer questions using voice with real-time speech-to-text transcription. Practice as if in a real interview.',
                gradient: 'from-emerald-500 to-emerald-600',
                glow: 'emerald',
              },
              {
                icon: BarChart3,
                title: 'Detailed Analytics',
                description: 'Track your progress with comprehensive charts, scores, and improvement metrics over time.',
                gradient: 'from-purple-500 to-purple-600',
                glow: 'purple',
              },
              {
                icon: FileText,
                title: 'Resume Analysis',
                description: 'Upload your resume and let AI extract key information to generate relevant interview questions.',
                gradient: 'from-orange-500 to-orange-600',
                glow: 'orange',
              },
              {
                icon: Target,
                title: 'Personalized Feedback',
                description: 'Get strengths, weaknesses, and actionable suggestions for each answer you provide.',
                gradient: 'from-pink-500 to-pink-600',
                glow: 'pink',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is encrypted and never shared. Practice with confidence knowing your information is safe.',
                gradient: 'from-cyan-500 to-cyan-600',
                glow: 'cyan',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-4`} style={{ background: `linear-gradient(135deg, rgba(${feature.glow === 'blue' ? '59,130,246' : feature.glow === 'emerald' ? '16,185,129' : feature.glow === 'purple' ? '139,92,246' : feature.glow === 'orange' ? '249,115,22' : feature.glow === 'pink' ? '236,72,153' : '6,182,212'}, 0.15), rgba(${feature.glow === 'blue' ? '59,130,246' : feature.glow === 'emerald' ? '16,185,129' : feature.glow === 'purple' ? '139,92,246' : feature.glow === 'orange' ? '249,115,22' : feature.glow === 'pink' ? '236,72,153' : '6,182,212'}, 0.05))` }}>
                  <feature.icon className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <Clock className="w-3 h-3" /> How It Works
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Ready in <span className="gradient-text">3 simple steps</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Upload Resume',
                description: 'Upload your PDF resume. Our AI extracts key information to personalize your interview.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'Configure Interview',
                description: 'Choose your job role, difficulty level, and interview type. We generate tailored questions.',
                icon: Target,
              },
              {
                step: '03',
                title: 'Practice & Improve',
                description: 'Answer questions via text or voice. Get instant AI feedback with detailed scoring.',
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative">
                <div className="glass-card rounded-2xl p-8 text-center relative z-10">
                  <div className="text-6xl font-black gradient-text opacity-20 absolute top-4 right-6">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-700 z-20">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-white/5 relative">
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[128px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
              <Users className="w-3 h-3" /> Testimonials
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">thousands</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer at Google',
                content: 'InterviewBuddy AI helped me prepare for my Google interviews in just 2 weeks. The AI questions were incredibly relevant and the feedback was actionable.',
                avatar: 'SC',
              },
              {
                name: 'Marcus Johnson',
                role: 'Product Manager at Meta',
                content: 'The voice mode feature is game-changing. It feels like a real interview. I improved my communication score by 40% within a month.',
                avatar: 'MJ',
              },
              {
                name: 'Priya Sharma',
                role: 'Data Scientist at Amazon',
                content: 'The analytics dashboard helped me identify my weak areas. I focused on improving them and landed offers from 3 FAANG companies.',
                avatar: 'PS',
              },
              {
                name: 'Alex Rivera',
                role: 'Frontend Developer at Stripe',
                content: 'Best interview prep tool I\'ve ever used. The resume analysis feature generates questions that are incredibly specific and challenging.',
                avatar: 'AR',
              },
              {
                name: 'Emily Watson',
                role: 'ML Engineer at OpenAI',
                content: 'The difficulty levels are perfectly calibrated. I started with beginner and gradually moved to advanced. Highly recommend for anyone in tech.',
                avatar: 'EW',
              },
              {
                name: 'David Kim',
                role: 'Senior Engineer at Netflix',
                content: 'I love how it tracks my improvement over time. Being able to see my scores trending upward gave me the confidence I needed.',
                avatar: 'DK',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Ready to ace your next
              <br />
              <span className="gradient-text">interview?</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Join thousands of candidates who've improved their interview skills with AI-powered practice.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-10 py-4 rounded-2xl text-base font-semibold text-white inline-flex items-center gap-2 group"
            >
              Get Started — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does InterviewBuddy AI generate questions?',
      a: 'We use Google Gemini AI to analyze your resume and generate relevant interview questions based on your experience, the target job role, difficulty level, and interview type (HR, Technical, or Mixed).',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes, absolutely. All data is encrypted in transit and at rest using Supabase security. We never share your personal information or resume content with third parties.',
    },
    {
      q: 'Can I use voice mode for answering?',
      a: 'Yes! Our voice mode uses the Web Speech API for real-time speech-to-text transcription. You can speak your answers naturally and edit the transcript before submitting.',
    },
    {
      q: 'How accurate is the AI evaluation?',
      a: 'Our AI evaluation uses advanced language models to assess your answers on multiple dimensions including technical accuracy, communication clarity, and confidence. While no AI is perfect, our scoring is calibrated to be consistent and constructive.',
    },
    {
      q: 'Is InterviewBuddy AI free to use?',
      a: 'We offer a generous free tier that includes resume uploads, interview sessions, and full analytics. Premium features may be available in the future.',
    },
    {
      q: 'What types of interviews are supported?',
      a: 'We support HR interviews (behavioral, situational), Technical interviews (coding concepts, system design), and Mixed interviews that combine both types.',
    },
  ];

  return (
    <section id="faq" className="py-24 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
            <CheckCircle className="w-3 h-3" /> FAQ
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeInUp} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Need to import AnimatePresence for FAQ
import { AnimatePresence } from 'framer-motion';
