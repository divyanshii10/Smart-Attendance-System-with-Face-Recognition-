
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

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

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col">

        {/* Blur BG */}
        <img
          src="/assets/face-wireframe.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />

        <div className="absolute inset-0 bg-[#0B1120]/90" />

        {/* NAVBAR */}
        <nav className="relative flex items-center justify-between px-10 py-6 border-b border-white/[0.06]">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
            SmartAttendance
          </h1>

          <div className="hidden md:flex gap-8 text-[#9CA3AF]">
            <a href="#features" className="hover:text-[#E5E7EB] transition">Features</a>
            <a href="#how" className="hover:text-[#E5E7EB] transition">How it Works</a>
            <a href="#faq" className="hover:text-[#E5E7EB] transition">FAQs</a>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium transition"
          >
            Login
          </button>

        </nav>

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
      <section id="features" className="py-24 relative overflow-hidden">

        <div className="px-10 md:px-20 relative z-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent"
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
      <section id="how" className="px-10 md:px-20 py-24">

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          How It Works
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-12 text-center"
        >

          {[
            "Capture Face",
            "Match With Database",
            "Mark Attendance"
          ].map((step, i) => (

            <motion.div key={i} variants={fadeUp}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4F46E5] flex items-center justify-center text-xl font-bold text-white">
                {i + 1}
              </div>
              <h3 className="text-[#E5E7EB] font-medium">{step}</h3>
            </motion.div>

          ))}

        </motion.div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="px-10 md:px-20 py-24">

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          FAQs
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="max-w-3xl mx-auto space-y-6"
        >

          {[
            {
              q: "Is face data stored securely?",
              a: "Yes. All biometric data is encrypted and stored securely following industry security standards."
            },
            {
              q: "Can it work in low light?",
              a: "Yes. The system uses AI-enhanced detection models optimized for low-light environments."
            },
            {
              q: "Does it support real-time reports?",
              a: "Absolutely. Attendance analytics and reports are generated instantly in real time."
            }
          ].map((faq, i) => (

            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className="
          p-6 rounded-xl
          bg-[#111827]
          border border-white/[0.06]
          hover:border-[#4F46E5]/30
          transition
        "
            >

              {/* Question */}
              <h3 className="text-lg font-semibold text-[#4F46E5] mb-2">
                {faq.q}
              </h3>

              {/* Answer */}
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                {faq.a}
              </p>

            </motion.div>

          ))}

        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative text-center py-10 border-t border-white/[0.06] text-[#6B7280]">

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          © 2026 SmartAttendance • AI Powered System
        </motion.p>

      </footer>

    </div>
  );
}