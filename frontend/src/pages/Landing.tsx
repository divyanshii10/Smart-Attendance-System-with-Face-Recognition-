import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Linkedin, Github, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypewriterKey((prev) => prev + 1);
    }, 6000); // 6 seconds loop
    return () => clearInterval(interval);
  }, []);

  const handleProtectedNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  /* ================= ANIMATIONS ================= */

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const stagger = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#0B1120] text-white scroll-smooth">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/[0.04] bg-[#0B1120]/60 backdrop-blur-xl">

        {/* LEFT SIDE: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
            <span className="text-white text-lg">📸</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Attend<span className="text-[#06B6D4]">Ease</span>
          </h1>
        </div>

        {/* RIGHT SIDE: Links + CTA */}
        <div className="hidden lg:flex items-center gap-6">

          {/* Links */}
          <div className="flex items-center gap-8">
            <button onClick={() => handleProtectedNav("/live-attendance")} className="text-lg font-medium text-[#9CA3AF] hover:text-white transition-colors">Live Attendance</button>
            <a href="#how" className="text-lg font-medium text-[#9CA3AF] hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="text-lg font-medium text-[#9CA3AF] hover:text-white transition-colors">Features</a>
            <a href="#faq" className="text-lg font-medium text-[#9CA3AF] hover:text-white transition-colors">FAQs</a>
          </div>

          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* CTA / PROFILE */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-3 px-4 py-2 bg-[#111827] border border-white/[0.06] rounded-lg cursor-pointer transition shadow-lg shadow-black/20"
              >
                <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm leading-tight text-left">
                  <p className="font-medium text-[#E5E7EB]">{user?.name || 'Admin'}</p>
                  <p className="text-[#6B7280] text-xs capitalize">{user?.role || 'Administrator'}</p>
                </div>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-white font-medium hover:text-[#06B6D4] transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium transition shadow-lg shadow-[#4F46E5]/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>

      </nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col">

        {/* Blur BG */}
        <img
          src="/assets/face-wireframe.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />

        <div className="absolute inset-0 bg-[#0B1120]/90" />

        {/* Subtle Polka-Dot Tech Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* HERO CONTENT */}
        <div className="relative grid md:grid-cols-2 gap-16 items-center px-10 md:px-16 py-24 flex-1">

          {/* LEFT */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">

            <div className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-[#4F46E5]/15 border border-[#4F46E5]/30 text-[#06B6D4]">
              AI Face Recognition Powered
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#E5E7EB]">
              Mark Attendance
              <span className="block bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
                Just By Scanning Faces
              </span>
            </h1>

            <p className="mt-6 text-[#9CA3AF] text-lg max-w-xl">
              Real-time face recognition attendance system with analytics,
              reports, and automated tracking.
            </p>

            <div className="flex gap-6 mt-10">

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium transition"
              >
                Get Started
              </button>

              <a
                href="#features"
                className="px-6 py-3 rounded-xl border border-[#4F46E5]/50 text-[#4F46E5] hover:bg-[#4F46E5]/10 transition"
              >
                Explore Features
              </a>

            </div>

          </motion.div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">

            {/* Subtle ambient glow — no neon */}
            <div className="absolute inset-0 bg-[#4F46E5]/8 blur-3xl rounded-3xl" />

            <div className="relative">

              {/* IMAGE */}
              <img
                src="/assets/face-wireframe.jpeg"
                className="relative rounded-2xl border border-[#4F46E5]/25"
              />

              {/* SCAN LINE */}
              <motion.div
                className="absolute left-0 w-full h-0.5 bg-[#4F46E5]/70"
                animate={{ top: ["0%", "100%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* RADAR RING */}
              <motion.div
                className="absolute inset-0 border border-[#4F46E5]/20 rounded-2xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />

            </div>

          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 relative overflow-hidden bg-[#0A0F1C] border-y border-white/[0.02]">

        {/* Subtle Polka-Dot Tech Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="px-10 md:px-20 relative z-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#E5E7EB] bg-clip-text text-transparent"
          >
            Powerful Features
          </motion.h2>
        </div>

        {/* Cinematic Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#0B1120] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#0B1120] to-transparent z-10 pointer-events-none" />

        {/* Camera Roll Track Container */}
        <div className="relative flex overflow-hidden group">
          <motion.div
            className="flex gap-6 w-max px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 36, // Slow, premium speed
              repeat: Infinity,
            }}
            // Pause animation on hover for better UX
            whileHover={{ animationPlayState: "paused" }}
          >
            {[
              {
                title: "Live Face Attendance",
                desc: "Millisecond-level real-time face detection using high-accuracy AI models.",
                image: "/assets/attendance-ui.png",
              },
              {
                title: "Analytics Dashboard",
                desc: "Visual insights of attendance trends and department-wise tracking in an intuitive interface.",
                image: "/assets/dashboard-ui.png",
              },
              {
                title: "Automated Reports",
                desc: "Generate and export daily & monthly reports instantly with one click.",
                image: "/assets/reports-ui.png",
              },
              {
                title: "Duplicate Detection",
                desc: "Intelligently prevents proxy or duplicate attendance marking within the same active session.",
                image: "/assets/face-scan-bg.jpeg",
              },
              {
                title: "Multi-Admin Security",
                desc: "Fully isolated tenant accounts with distinct databases for records and settings.",
                image: "/assets/attendance-bg.png",
              }
            ].concat([
              {
                title: "Live Face Attendance",
                desc: "Millisecond-level real-time face detection using high-accuracy AI models.",
                image: "/assets/attendance-ui.png",
              },
              {
                title: "Analytics Dashboard",
                desc: "Visual insights of attendance trends and department-wise tracking in an intuitive interface.",
                image: "/assets/dashboard-ui.png",
              },
              {
                title: "Automated Reports",
                desc: "Generate and export daily & monthly reports instantly with one click.",
                image: "/assets/reports-ui.png",
              },
              {
                title: "Duplicate Detection",
                desc: "Intelligently prevents proxy or duplicate attendance marking within the same active session.",
                image: "/assets/face-scan-bg.jpeg",
              },
              {
                title: "Multi-Admin Security",
                desc: "Fully isolated tenant accounts with distinct databases for records and settings.",
                image: "/assets/attendance-bg.png",
              }
            ]).map((f, i) => (

              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: i * 0.15, // Staggered floating effect
                }}
                className="
                  relative w-[85vw] md:w-[420px] h-[320px] md:h-[400px]
                  shrink-0 rounded-3xl overflow-hidden
                  border border-white/[0.08]
                  shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                  hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]
                  hover:border-[#4F46E5]/50
                  transition-all duration-500 cursor-default group/card
                "
              >
                {/* Visual Image Background */}
                <img
                  src={f.image}
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 group-hover/card:rotate-1 transition-transform duration-700 opacity-60 group-hover/card:opacity-90"
                  alt={f.title}
                />

                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent" />

                {/* Inner Content */}
                <div className="absolute bottom-8 left-8 right-8 text-white translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-3 text-[#E5E7EB] group-hover/card:text-white drop-shadow-md">
                    {f.title}
                  </h3>
                  <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed group-hover/card:text-[#D1D5DB] drop-shadow-lg opacity-90">
                    {f.desc}
                  </p>
                </div>
              </motion.div>

            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section id="how" className="px-10 md:px-20 py-24 relative bg-[#0B1120]">
        <div className="max-w-6xl mx-auto">

          {/* Animated Typewriter Heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {}
            }}
            className="flex justify-center mb-4"
          >
            {Array.from("Here's How It Works").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, display: "none" },
                  visible: { opacity: 1, display: "inline-block" }
                }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-[#E5E7EB] bg-clip-text text-transparent"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-[#4F46E5] ml-1"
            >
              |
            </motion.span>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center text-[#9CA3AF] text-lg max-w-2xl mx-auto mb-20"
          >
            A frictionless, automated pipeline. From the moment a face is scanned to the final exported compliance report, AttendEase handles the heavy lifting.
          </motion.p>

          {/* Staggered Interactive Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Capture Face",
                desc: "Students stand in front of the camera. The system detects their face instantly in real-time.",
                step: "01"
              },
              {
                title: "Match & Verify",
                desc: "High-speed AI compares the 128-point facial encoding against the secure PostgreSQL database.",
                step: "02"
              },
              {
                title: "Log Attendance",
                desc: "The session is updated, dashboard metrics refresh, and the presence is timestamped automatically.",
                step: "03"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.21, 0.47, 0.32, 0.98], // Custom premium easing curve
                  delay: i * 0.2 // Sequential staggering (0s, 0.2s, 0.4s)
                }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="
                  relative p-8 rounded-2xl
                  bg-[#111827] 
                  border border-white/[0.05] 
                  hover:border-[#4F46E5]/20
                  shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                  transition-colors duration-300
                  flex flex-col
                "
              >
                {/* Step Number Badge */}
                <div className="text-sm font-bold text-[#4F46E5] mb-6 tracking-wider">
                  STEP {step.step}
                </div>

                <motion.h3
                  key={typewriterKey} // Forces re-animation on interval
                  className="text-2xl font-semibold text-white mb-3 flex flex-wrap h-16 md:h-8" // Fixed height prevents layout shift during typing
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                    hidden: {}
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {Array.from(step.title).map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      variants={{
                        hidden: { opacity: 0, display: "none" },
                        visible: { opacity: 1, display: "inline-block" }
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-[#4F46E5] ml-1 font-light"
                  >
                    |
                  </motion.span>
                </motion.h3>

                <p className="text-[#9CA3AF] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="px-10 md:px-20 py-24 relative bg-[#0A0F1C] border-t border-white/[0.02]">
        {/* Ambient top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[#4F46E5]/40 to-transparent" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#E5E7EB] bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                q: "Is the biometric face data stored securely?",
                a: "Absolutely. We do not store raw images in a way that can be reverse-engineered. All 128-point biometric encodings are encrypted and stored within our secure, isolated PostgreSQL database."
              },
              {
                q: "Can the scanner recognize faces in low light environments?",
                a: "Yes. Our computer vision models are trained dynamically to normalize exposure, allowing for high-accuracy recognition even in dimly lit classrooms or hallways."
              },
              {
                q: "How does the enterprise multi-tenant system work?",
                a: "Each admin account creates an entirely isolated data silo. When you upload a student, their biometric data and attendance records are strictly locked to your specific admin ID. No data is ever crossed between organizations."
              },
              {
                q: "Can I export the attendance data?",
                a: "Yes. The analytics dashboard provides real-time insights, while the Reports tab allows you to generate and export comprehensive daily or monthly Excel (.csv) sheets with a single click."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="overflow-hidden border-b border-white/[0.05] last:border-0"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                >
                  <span className="text-lg font-medium text-[#E5E7EB] group-hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaqIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-4 text-[#4F46E5] text-xl font-light"
                  >
                    ↓
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <p className="pb-6 text-[#9CA3AF] leading-relaxed pr-8">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative border-t border-white/[0.04] bg-[#050810] pt-20 pb-6 px-6 md:px-12">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4F46E5]/50 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
                <span className="text-white text-sm">📸</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Attend<span className="text-[#06B6D4]">Ease</span>
              </h2>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
              The next-generation biometric attendance platform. Automating compliance and security for modern enterprises with edge-AI facial recognition.
            </p>
            {/* Social Links Moved Here */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#6B7280] hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#6B7280] hover:text-white hover:bg-white/10 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/" className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#6B7280] hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-4 text-sm text-[#9CA3AF]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Helps & Support</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li> */}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Legal</h3>
            <ul className="space-y-4 text-sm text-[#9CA3AF]">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Terms of Service</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Security</a></li> */}
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.04] flex items-center justify-center text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} AttendEase Technologies Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}