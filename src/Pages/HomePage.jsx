import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"; 
import '../css/HomePage.css';

// Import icons from lucide-react
import { 
  MessageCircle,
  ScanFace,
  Sprout,
  Star,
  ThumbsUp,
  ArrowRight,
  Menu,
  X,
  Leaf,
  Bird,
  CircleDashed
} from 'lucide-react';

const reviews = [
  {
    text: "Finally a space where I can be honest about my struggles without fear. Seeing my 'problem plant' grow with community support gave me real hope.",
    author: "Alex M.",
    title: "Peer Supporter",
    rating: 5
  },
  {
    text: "The garden metaphor makes helping others feel therapeutic. I water advice that resonates, and it's amazing to see what blooms!",
    author: "Sam R.",
    title: "Community Gardener",
    rating: 5
  },
  {
    text: "Never thought giving advice could be this rewarding. The swipe system makes it easy to engage when I have limited energy.",
    author: "Jordan T.",
    title: "Mental Health Advocate",
    rating: 5
  }
];

const HomePage = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Auto-rotate testimonials - Fixed the duplicate comments and syntax
// After (fixed):
useEffect(() => {
  const interval = setInterval(() => {
    setActiveTestimonial(prev => (prev + 1) % reviews.length);
  }, 5000);
  return () => clearInterval(interval);
}, []); // Empty dependency array since no component state/props are used

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setHideHeader(currentScroll > lastScrollTop && currentScroll > 100);
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Garden Guide', icon: <Sprout size={20} /> , onClick: () => navigate('/guide'),},
    { label: 'Log in', onClick: () => navigate('/Login'), highlight: true }
  ];

  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: "Anonymous Sharing",
      description: "Safely express your struggles without revealing your identity"
    },
    {
      icon: <ScanFace size={32} />,
      title: "Swipe to Support",
      description: "Quickly browse and engage with others' experiences through intuitive card swiping"
    },
    {
      icon: <Sprout size={32} />,
      title: "Grow Your Garden",
      description: "Watch collective wisdom blossom as community nurtures each challenge"
    },
    {
      icon: <ThumbsUp size={32} />,
      title: "Crowd-Voted Advice",
      description: "The most helpful responses rise to the top through community watering"
    }
  ];

  const statistics = [
    { value: "500+", label: "Daily Seeds Planted" },
    { value: "1000+", label: "Advice Waters Given" },
    { value: "94%", label: "Feel Supported" }
  ];

  return (
    <div className='main-div'>
      {/* Header with Mobile Responsiveness */}
      <motion.div 
        className={`header-div ${hideHeader ? "hide" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className='leftside'>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='logo'
          >
            <span className="logo-text">Aid<span className="logo-accent">Bud</span></span>
          </motion.div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <motion.div 
          className='mobile-menu-toggle' 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>

        {/* Desktop and Mobile Navigation */}
        <AnimatePresence>
          {(isMobileMenuOpen || window.innerWidth > 768) && (
            <motion.div 
              className={`rightside ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
              initial={isMobileMenuOpen ? { opacity: 0, x: "100%" } : { opacity: 0 }}
              animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 1 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
            >
              {navigationItems.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, color: "#2E71AC" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className={`nav-item ${item.highlight ? 'nav-highlight' : ''}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.icon}
                  {item.label}
                </motion.div>
              ))}
              {isMobileMenuOpen && (
                <motion.div 
                  className="mobile-close-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content Sections */}
      <div className='bottom-part'>
        {/* Hero Section with Parallax Effect */}
        <motion.div 
          className='hero-section'
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-overlay"></div>
          <div className='hero-content'>
            <motion.h1 
              className='hero-title'
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything your mind needs
            </motion.h1>
            <motion.p 
              className='hero-subtitle'
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
               Share your struggles anonymously, discover compassionate advice through swiping, 
               and watch collective wisdom blossom in our therapeutic community garden
            </motion.p>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to='/SignUp' className='hero-cta'>
              Plant Your Seed <Sprout size={24} />
              </Link>
            </motion.div>
          </div>
          <div className="scroll-indicator">
            <motion.div 
              className="scroll-icon"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className='stats-section'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="stats-container">
            {statistics.map((stat, index) => (
              <motion.div 
                key={index} 
                className="stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="stat-value">{stat.value}</h2>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className='features-section'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className='section-title'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
             How Our Community Grows
          </motion.h2>
          <motion.p 
            className='section-subtitle'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
             A safe ecosystem where shared struggles become opportunities for collective healing
          </motion.p>
          
          <div className='features-grid'>
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className='feature-card'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              >
                <div className='feature-icon'>{feature.icon}</div>
                <h3 className='feature-title'>{feature.title}</h3>
                <p className='feature-desc'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className='learn-more-button'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => navigate('/guide')}
          >
            Learn more <ArrowRight size={20} />
          </motion.div>
        </motion.div>

        {/* Member Reviews Section */}
        <motion.div 
          className='testimonials-section'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className='section-title'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Members are discovering happier, healthier lives
          </motion.h2>

          <div className='testimonials-carousel'>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                className='testimonial-card'
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className='testimonial-quote'>"</div>
                <p className='testimonial-text'>{reviews[activeTestimonial].text}</p>
                <div className='testimonial-rating'>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < reviews[activeTestimonial].rating ? "#FFD700" : "none"} 
                      stroke={i < reviews[activeTestimonial].rating ? "#FFD700" : "#CBD5E0"} 
                    />
                  ))}
                </div>
                <div className='testimonial-author'>{reviews[activeTestimonial].author}</div>
                <div className='testimonial-title'>{reviews[activeTestimonial].title}</div>
              </motion.div>
            </AnimatePresence>
            
            <div className='testimonial-dots'>
              {reviews.map((_, index) => (
                <motion.div 
                  key={index}
                  className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>
          
          <div className='desktop-testimonials'>
            {reviews.map((review, index) => (
              <motion.div 
                key={index} 
                className='testimonial-card-desktop'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              >
                <div className='testimonial-quote'>"</div>
                <p>{review.text}</p>
                <div className='testimonial-rating'>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < review.rating ? "#FFD700" : "none"} 
                      stroke={i < review.rating ? "#FFD700" : "#CBD5E0"} 
                    />
                  ))}
                </div>
                <div className='testimonial-author'>{review.author}</div>
                <div className='testimonial-title'>{review.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          className='how-it-works-section'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className='section-title'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How AidBud Works
          </motion.h2>
          
          <div className='steps-container'>
            {[
              { 
                number: 1, 
                title: "Plant Your Seed", 
                desc: "Anonymously share your advice - it becomes a seed in the community garden",
                icon: <CircleDashed size={24} />
              },
              { 
                number: 2, 
                title: "Swipe to Nurture", 
                desc: "Browse others' seeds - swipe right to water with advice, left to pass",
                icon: <Leaf size={24} />
              },
              { 
                number: 3, 
                title: "Watch Growth", 
                desc: "See which advice gets watered most - top responses bloom into flowers",
                icon: <Bird size={24} />
              }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className='step-card'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className='step-number'>{step.number}</div>
                <h3 className='step-title'>{step.title}</h3>
                <p className='step-desc'>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className='cta-section'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className='cta-content'>
            <motion.h2 
              className='cta-title'
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Start Your Journey Today
            </motion.h2>
            <motion.p 
              className='cta-subtitle'
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands who have transformed their mental wellness
            </motion.p>
            <motion.div 
              className='cta-features'
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
             
            </motion.div>
            <motion.button 
              className='cta-button'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              onClick={() => navigate('/SignUp')}
            >
              Join AidBud <ArrowRight size={24} />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className='footer-section'>
          <div className='footer-logo'>AidBud</div>
          <div className='footer-links'>
            <div className='footer-column'>
              <div className='ftc'>
                <div className='cftc' onClick={() => navigate('/guide')}>Garden Guidelines</div>
                <div className='cftc' onClick={() => navigate('/terms')}>Terms and Conditions</div >
                <div className='cftc' onClick={() => navigate('/privacy')}>Privacy Policy</div >
                <div className='cftc' onClick={() => navigate('/cookie')}>CookiePolicy</div >
              </div >
            </div>
          </div>
          <div className='footer-bottom'>
            <p>Where struggles become seeds for collective growth</p>
            <p>© 2025 AidBud. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;