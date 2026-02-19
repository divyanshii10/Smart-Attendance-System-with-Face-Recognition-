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
    <div className="bg-[#020617] text-white scroll-smooth">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col">

        {/* Blur BG */}
        <img
          src="/assets/face-wireframe.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />

        <div className="absolute inset-0 bg-[#020617]/90" />

        {/* NAVBAR */}
        <nav className="relative flex items-center justify-between px-10 py-6 border-b border-white/10">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            SmartAttendance
          </h1>

          <div className="hidden md:flex gap-8 text-gray-300">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <a href="#faq">FAQs</a>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600"
          >
            Login
          </button>

        </nav>

        {/* HERO CONTENT */}
        <div className="relative grid md:grid-cols-2 gap-16 items-center px-10 md:px-16 py-24 flex-1">

          {/* LEFT */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">

            <div className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300">
              AI Face Recognition Powered
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Mark Attendance
              <span className="block bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                Just By Scanning Faces
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg max-w-xl">
              Real-time face recognition attendance system with analytics,
              reports, and automated tracking.
            </p>

            <div className="flex gap-6 mt-10">

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600"
              >
                Get Started
              </button>

              <a
                href="#features"
                className="px-6 py-3 rounded-xl border border-violet-500 text-violet-300 hover:bg-violet-500/10"
              >
                Explore Features
              </a>

            </div>

          </motion.div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">

            {/* Glow */}
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-3xl" />

            <div className="relative">

              {/* IMAGE */}
              <img
                src="/assets/face-wireframe.jpeg"
                className="relative rounded-2xl border border-purple-500/40 "
              />

              {/* SCAN LINE */}
              <motion.div
                className="absolute left-0 w-full h-1 bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.9)]"
                animate={{ top: ["0%", "100%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* RADAR RING */}
              <motion.div
                className="absolute inset-0 border-2 border-purple-500/30 rounded-2xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 0, 0.6]
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
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-purple-500/40 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm">
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                {i + 1}
              </div>
              <h3>{step}</h3>
            </motion.div>

          ))}

        </motion.div>
      </section>

      {/* ================= FAQ ================= */}
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
          bg-[#0B1220]
          border border-white/10
          hover:border-purple-500/40
          transition
        "
      >

        {/* Question */}
        <h3 className="text-lg font-semibold text-purple-400 mb-2">
          {faq.q}
        </h3>

        {/* Answer */}
        <p className="text-gray-400 text-sm leading-relaxed">
          {faq.a}
        </p>

      </motion.div>

    ))}

  </motion.div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="relative text-center py-10 border-t border-white/10 text-gray-400">

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

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