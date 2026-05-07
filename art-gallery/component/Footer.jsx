import React from 'react';
import { Mail, MapPin, Phone, Palette, Globe, Layout } from 'lucide-react';

const Footer = ({ onNavigate }) => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-indigo-900 via-indigo-950 to-violet-950 text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16">
          <div className="md:col-span-5 space-y-8">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate?.('gallery')}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-900 transition-transform group-hover:scale-110 shadow-2xl">
                <Palette size={24} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Helen Art
              </h1>
            </div>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-sm">
              Discover exceptional artwork from talented artists around the world. Elevate your space with timeless pieces.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Dribbble'].map(social => (
                <button key={social} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white hover:text-indigo-900 transition-all shadow-xl">
                  <span className="sr-only">{social}</span>
                  {social === 'Twitter' && <Globe size={20} />}
                  {social === 'Instagram' && <Palette size={20} />}
                  {social === 'Dribbble' && <Layout size={20} />}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'The Gallery', page: 'gallery' },
                { label: 'Your Collection', page: 'my-orders' },
                { label: 'Join as Artist', page: 'artisan-dashboard' },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate?.(page)}
                    className="text-indigo-100/60 hover:text-white font-bold transition-colors text-[1rem]"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Connect</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Email Us</p>
                  <p className="text-white font-black text-lg">curator@helenart.com</p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Visit Gallery</p>
                  <p className="text-white font-black text-lg">Lagos, Nigeria</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-indigo-200/40 font-medium text-sm">
            © {currentYear} Helen Art Gallery. Built with passion.
          </p>
          <div className="flex gap-8">
            <button className="text-indigo-200/40 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Privacy</button>
            <button className="text-indigo-200/40 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
