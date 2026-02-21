import React from "react";
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
      <section id="features" className="px-10 md:px-20 py-24">

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          Powerful Features
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-8"
        >

          {[
            {
              title: "Live Face Attendance",
              desc: "Real-time face detection & attendance marking."
            },
            {
              title: "Analytics Dashboard",
              desc: "Visual insights of attendance trends."
            },
            {
              title: "Automated Reports",
              desc: "Generate daily & monthly reports instantly."
            }
          ].map((f, i) => (

            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] hover:border-[#4F46E5]/30 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all"
            >
              <h3 className="text-xl font-semibold mb-3 text-[#4F46E5]">
                {f.title}
              </h3>
              <p className="text-[#9CA3AF] text-sm">
                {f.desc}
              </p>
            </motion.div>

          ))}

        </motion.div>
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