import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020617] text-white scroll-smooth">

      {/* ================= HERO ================= */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col"
      >

        {/* 🔵 BLUR BACKGROUND IMAGE */}
        <img
          src="/assets/face-wireframe.jpeg"
          alt="bg"
          className="
            absolute inset-0
            w-full h-full object-cover
            opacity-20
            blur-2xl
            scale-110
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#020617]/90"></div>

        {/* NAVBAR */}
        <nav className="relative flex items-center justify-between px-10 py-6 border-b border-white/10">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            SmartAttendance
          </h1>

          <div className="hidden md:flex gap-8 text-gray-300">

            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#how" className="hover:text-white transition">
              How it Works
            </a>

            <a href="#faq" className="hover:text-white transition">
              FAQs
            </a>

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
          <div>

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

          </div>


          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">

            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-3xl"></div>

            <img
              src="/assets/face-wireframe.jpeg"
              alt="Face Scan"
              className="relative rounded-2xl border border-cyan-400/40 shadow-[0_0_80px_rgba(34,211,238,0.35)]"
            />

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="px-10 md:px-20 py-24 bg-[#020617]"
      >

        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

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
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-violet-500/40 transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-violet-400">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how"
        className="px-10 md:px-20 py-24 bg-[#020617]"
      >

        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-12 text-center">

          {[
            "Capture Face",
            "Match With Database",
            "Mark Attendance"
          ].map((step, i) => (
            <div key={i}>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-600 flex items-center justify-center text-xl font-bold">
                {i + 1}
              </div>

              <h3 className="text-lg font-semibold">
                {step}
              </h3>

            </div>
          ))}

        </div>

      </section>


      {/* ================= FAQ ================= */}
      <section
        id="faq"
        className="px-10 md:px-20 py-24 bg-[#020617]"
      >

        <h2 className="text-4xl font-bold text-center mb-16">
          FAQs
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">

          {[
            "Is face data stored securely?",
            "Can it work in low light?",
            "Does it support real-time reports?"
          ].map((q, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#0B1220] border border-white/10"
            >
              {q}
            </div>
          ))}

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="text-center py-10 border-t border-white/10 text-gray-400">
        © 2026 SmartAttendance • AI Powered System
      </footer>

    </div>
  );
}