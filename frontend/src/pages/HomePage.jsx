import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="font-sans overflow-x-hidden">
      {/* Main Hero Section (Takes up full viewport height to force scroll) */}
      <main className="relative min-h-screen flex flex-col items-center justify-center">
        
        {/* Background Image with Dark Overlay & Parallax (bg-fixed) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: "url('/martin-martz-3_x1FRGAEwY-unsplash.jpg')" }}
        >
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-[-5vh]">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Prep.AI
            </span>
          </h1>
          
          <p className="mb-10 text-xl md:text-2xl text-gray-300 font-medium max-w-2xl">
            Your personal Gen-AI mock interview teacher...
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-6">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 rounded-full font-semibold text-white border border-gray-400 hover:border-white hover:bg-white/10 transition-all duration-200">
                Login
              </button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/30 transition-all duration-200">
                Signup
              </button>
            </Link>
          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 hidden sm:flex flex-col items-center opacity-70">
          <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">Scroll</span>
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </main>

      {/* Footer Section (Now sits below the hero, requiring a scroll) */}
      <footer className="footer sm:footer-horizontal bg-slate-950 text-slate-300 p-10 border-t border-slate-800 relative z-10">
        <nav>
          <h6 className="footer-title font-bold text-white uppercase tracking-wider">Services</h6>
          <a className="link link-hover hover:text-white transition-colors">Branding</a>
          <a className="link link-hover hover:text-white transition-colors">Design</a>
          <a className="link link-hover hover:text-white transition-colors">Marketing</a>
          <a className="link link-hover hover:text-white transition-colors">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title font-bold text-white uppercase tracking-wider">Company</h6>
          <a className="link link-hover hover:text-white transition-colors">About us</a>
          <a className="link link-hover hover:text-white transition-colors">Contact</a>
          <a className="link link-hover hover:text-white transition-colors">Jobs</a>
          <a className="link link-hover hover:text-white transition-colors">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title font-bold text-white uppercase tracking-wider">Social</h6>
          <div className="grid grid-flow-col gap-4 mt-2">
            <a className="hover:text-blue-400 cursor-pointer transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a className="hover:text-blue-500 cursor-pointer transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a className="hover:text-pink-500 cursor-pointer transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default HomePage;