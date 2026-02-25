import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import PageLayout from './components/PageLayout';
import Hero from './pages/Hero';
import Features from './pages/Features';
import About from './pages/About';
import { Upload } from './pages/Upload';
import Analysis from './pages/Analysis';
import Ranking from './pages/Ranking';
import { Pipeline, FAQ, Pricing } from './pages/OtherPages';

// ── Loading splash ─────────────────────────────────────────────────────────
function LoadingScreen({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="loader"
          style={{ position:'fixed',inset:0,zIndex:9999,background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:28 }}
          exit={{ opacity:0 }} transition={{ duration:0.5 }}>
          <motion.div initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }} transition={{ duration:0.5 }} style={{ textAlign:'center' }}>
            {/* Spinning hex logo */}
            <motion.div animate={{ rotate:[0,360] }} transition={{ duration:6,repeat:Infinity,ease:'linear' }}
              style={{ display:'inline-block',marginBottom:20,filter:'drop-shadow(0 0 24px rgba(0,245,255,0.8))' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <path d="M36 4L68 20V52L36 68L4 52V20L36 4Z" stroke="url(#loadG)" strokeWidth="1.5" fill="none"/>
                <path d="M20 48L28 27L38 38L48 24" stroke="url(#loadG)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
                <defs><linearGradient id="loadG" x1="0" y1="0" x2="72" y2="72"><stop stopColor="#00f5ff"/><stop offset="1" stopColor="#ff2d78"/></linearGradient></defs>
              </svg>
            </motion.div>
            <motion.div style={{ fontFamily:'Orbitron,sans-serif',fontSize:28,fontWeight:900,color:'#00f5ff',letterSpacing:'0.08em',textTransform:'uppercase',textShadow:'0 0 20px rgba(0,245,255,0.6)' }}
              initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}>
              RankSense<span style={{ color:'#ff2d78',textShadow:'0 0 20px rgba(255,45,120,0.6)' }}> AI</span>
            </motion.div>
            <motion.div style={{ fontFamily:'Share Tech Mono,monospace',fontSize:11,color:'#3d6678',letterSpacing:4,textTransform:'uppercase',marginTop:8 }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
              INITIALIZING SYSTEM...
            </motion.div>
          </motion.div>
          {/* Progress bar */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} style={{ width:280 }}>
            <div style={{ height:1,background:'rgba(0,245,255,0.08)',overflow:'hidden' }}>
              <motion.div style={{ height:'100%',background:'linear-gradient(90deg,#00f5ff,#ff2d78)',boxShadow:'0 0 12px #00f5ff' }}
                initial={{ width:0 }} animate={{ width:'100%' }} transition={{ duration:1.8,ease:[0.4,0,0.2,1] }}/>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',marginTop:8,fontFamily:'Share Tech Mono,monospace',fontSize:10,color:'#3d6678',letterSpacing:1 }}>
              <span>LayoutLMv3</span><span>TOPSIS Engine</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Page components ────────────────────────────────────────────────────────
function HomePage({ onAuthClick }) {
  const navigate = useNavigate();
  return (
    <>
      <Hero onAnalyzeClick={() => navigate('/upload')} onAuthClick={onAuthClick} onWatchDemo={() => navigate('/pipeline')} />
      <Features />
    </>
  );
}

function UploadPage({ onAuthClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <PageLayout className="page-layout--upload">
      <div className="page-content">
        <Upload onComplete={() => navigate('/analysis')} onAuthClick={onAuthClick} user={user} />
      </div>
    </PageLayout>
  );
}

function AnalysisPage() {
  return <PageLayout className="page-layout--analysis"><div className="page-content"><Analysis /></div></PageLayout>;
}
function RankingPage() {
  return <PageLayout className="page-layout--ranking"><div className="page-content"><Ranking /></div></PageLayout>;
}
function PipelinePage() {
  return <PageLayout className="page-layout--pipeline"><div className="page-content"><Pipeline /></div></PageLayout>;
}
function PricingPage({ onAuthClick }) {
  return <PageLayout className="page-layout--pricing"><div className="page-content"><Pricing onAuthClick={onAuthClick} /></div></PageLayout>;
}
function FAQPage() {
  return <PageLayout className="page-layout--faq"><div className="page-content"><FAQ /></div></PageLayout>;
}
function AboutPage() { return <About />; }

// ── App inner (inside AuthProvider) ───────────────────────────────────────
function AppInner() {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); }, []);

  // Cursor glow
  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    const move = (e) => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const onAuthClick = (mode) => setAuthMode(mode);

  return (
    <div style={{ minHeight: '100vh' }}>
      <LoadingScreen done={!loading} />
      {!loading && (
        <>
          <div id="cursor-glow" />
          <ParticleCanvas />
          <Navbar onAuthClick={onAuthClick} />
          <Routes>
            <Route path="/"         element={<HomePage onAuthClick={onAuthClick} />} />
            <Route path="/upload"   element={<UploadPage onAuthClick={onAuthClick} />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/ranking"  element={<RankingPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/pricing"  element={<PricingPage onAuthClick={onAuthClick} />} />
            <Route path="/faq"      element={<FAQPage />} />
            <Route path="/about"    element={<AboutPage />} />
          </Routes>
          <Footer onAuthClick={onAuthClick} />
          <AnimatePresence>
            {authMode && (
              <AuthModal key="auth" mode={authMode} onClose={() => setAuthMode(null)} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
