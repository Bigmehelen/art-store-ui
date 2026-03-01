import React from 'react';

const Footer = ({ onNavigate }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-linear-to-br from-[#2c3e50] to-[#3d4e60] text-white pt-12 pb-6 mt-auto">
            <div className="max-w-350 mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-white/10">

                    <div className="flex flex-col gap-3 max-w-sm">
                        <h2
                            className="text-[1.6rem] font-bold cursor-pointer hover:text-[#667eea] transition-colors duration-300"
                            onClick={() => onNavigate?.('gallery')}
                        >
                            🎨 Helen Art Gallery
                        </h2>
                        <p className="text-[0.9rem] text-white/70 leading-relaxed">
                            Discover exceptional artwork from talented artists around the world.
                            Order originals and prints delivered to your door.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-[1rem] font-semibold uppercase tracking-widest text-white/60">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {[
                                { label: 'Gallery', page: 'gallery' },
                                { label: 'Login', page: 'login' },
                                { label: 'Register', page: 'register' },
                            ].map(({ label, page }) => (
                                <li key={page}>
                                    <button
                                        onClick={() => onNavigate?.(page)}
                                        className="text-white/70 hover:text-[#667eea] transition-colors duration-200 text-[0.95rem] bg-transparent border-none cursor-pointer p-0"
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-[1rem] font-semibold uppercase tracking-widest text-white/60">
                            Contact
                        </h3>
                        <ul className="flex flex-col gap-2 text-[0.95rem] text-white/70">
                            <li>📧 hello@helenartgallery.com</li>
                            <li>📍 Lagos, Nigeria</li>
                            <li>📞 +234 800 000 0000</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[0.85rem] text-white/50">
                    <p>© {currentYear} Helen Art Gallery. All rights reserved.</p>
                    <p>Built with ❤️ for art lovers everywhere.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
