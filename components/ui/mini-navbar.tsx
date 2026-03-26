import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { Menu, MenuTrigger, MenuPopup, MenuItem } from './menu';
import { ChevronDown, Heart, Users, User, Smile, Briefcase } from 'lucide-react';
import { HiSparkles } from 'react-icons/hi2';


const AnimatedNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-400';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-[13px] md:text-sm';
  const linkHeight = 'h-[20px]'; // Fixed height for the container

  return (
    <Link
      to={to}
      className={`group relative inline-block overflow-hidden ${linkHeight} ${textSizeClass} font-semibold tracking-wide whitespace-nowrap`}
    >
      <div className="flex flex-col transition-transform duration-500 ease-out transform group-hover:-translate-y-1/2">
        <span className={`${defaultTextColor} flex items-center ${linkHeight} leading-none italic`}>{children}</span>
        <span className={`${hoverTextColor} flex items-center ${linkHeight} leading-none italic`}>{children}</span>
      </div>
    </Link>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-[2rem]');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const navLinksData = [
    { label: 'AI Wish Generator', href: '/ai-wishes' },
    { label: 'NASA Feature', href: '/space-birthday' },
    { label: 'Products', href: '/gifts' },
    { label: 'Poster Studio', href: '/poster' },
  ];

  return (
    <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       backdrop-blur-3xl
                       ${headerShapeClass}
                       border border-white/10 bg-slate-950/80
                       w-[calc(100%-2.5rem)] md:w-max
                       transition-all duration-500 ease-in-out
                       shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]
                       overflow-hidden`}>

      <div className="flex items-center justify-between gap-x-8 md:gap-x-12 px-8 py-4 h-16">
        <div className="flex items-center shrink-0">
          <Logo size="sm" className="scale-90 md:scale-110 origin-left" />
        </div>

        <div className="flex items-center ml-2 md:ml-4">
          <Menu>
            <MenuTrigger className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-sm font-medium text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10 group">
              <HiSparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Popular Wishes</span>
              <span className="sm:hidden">Wishes</span>
              <ChevronDown className="w-2.5 h-2.5 md:w-3 md:h-3 transition-transform group-data-[popup-open]:rotate-180" />
            </MenuTrigger>
            <MenuPopup align="start" className="min-w-[200px] bg-slate-900/95 backdrop-blur-xl border-white/10 text-gray-200">
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/whatsapp-birthday-surprise" className="flex items-center w-full px-2 py-1.5">
                  <HiSparkles className="w-4 h-4 mr-2 text-white" />
                  Popular Surprises
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/friend" className="flex items-center w-full px-2 py-1.5">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  Wishes for Best Friend
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/sister" className="flex items-center w-full px-2 py-1.5">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Wishes for Sister
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/boyfriend" className="flex items-center w-full px-2 py-1.5">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Wishes for Boyfriend
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/mom" className="flex items-center w-full px-2 py-1.5">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  Wishes for Mom
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/brother" className="flex items-center w-full px-2 py-1.5">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Wishes for Brother
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/crush" className="flex items-center w-full px-2 py-1.5">
                  <Smile className="w-4 h-4 mr-2 text-orange-500" />
                  Wishes for Crush
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white/10 cursor-pointer p-0">
                <Link to="/birthday-wishes-for/my/boss" className="flex items-center w-full px-2 py-1.5">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                  Wishes for Boss
                </Link>
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>

        <nav className="hidden xl:flex items-center space-x-10">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} to={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <button className="xl:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`xl:hidden flex flex-col items-center w-full transition-all ease-in-out duration-500 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="w-full h-px bg-white/5 mb-6" />
        <nav className="flex flex-col items-center space-y-6 text-xl p-8 pt-0 font-sans italic">
          {navLinksData.map((link) => (
            <Link key={link.href} to={link.href} className="text-gray-400 hover:text-white transition-all w-full text-center font-bold tracking-tight uppercase">
              {link.label}
            </Link>
          ))}
          <div className="w-full h-px bg-white/5 my-2" />
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Popular Wishes</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
            {[
              { label: 'Best Friend', href: '/birthday-wishes-for/my/friend' },
              { label: 'Sister', href: '/birthday-wishes-for/my/sister' },
              { label: 'Mom', href: '/birthday-wishes-for/my/mom' },
              { label: 'Boyfriend', href: '/birthday-wishes-for/my/boyfriend' },
              { label: 'Colleague', href: '/birthday-wishes-for/my/colleague' },
              { label: 'Bhabhi', href: '/birthday-wishes-for/my/bhabhi' },
              { label: 'Son/Daughter', href: '/birthday-wishes-for/my/daughter' },
              { label: 'Explore All', href: '/whatsapp-birthday-surprise' }
            ].map((item) => (
              <Link key={item.label} to={item.href} className="text-sm text-gray-400 hover:text-magical-300 transition-all text-left font-semibold">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
