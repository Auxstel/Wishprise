import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
    variant?: 'default' | 'transparent';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
    const wrapperClass =
        variant === 'transparent'
            ? 'relative z-20 border-t border-white/10 py-10 px-6 text-center text-sm text-slate-400'
            : 'border-t border-white/10 py-10 px-6 text-center text-sm text-gray-500';

    return (
        <footer className={wrapperClass}>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-4">
                <Link to="/" className="hover:text-magical-300 transition-colors">Home</Link>
                <Link to="/about" className="hover:text-magical-300 transition-colors">About</Link>
                <Link to="/resources" className="hover:text-magical-300 transition-colors">Resources</Link>
                <Link to="/contact" className="hover:text-magical-300 transition-colors">Contact</Link>
                <Link to="/privacy" className="hover:text-magical-300 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-magical-300 transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-magical-300 transition-colors">Cookie Policy</Link>
            </nav>
            <p>© 2026 Wishprise. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
