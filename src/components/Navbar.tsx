'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const mainLinks = [
    { id: 1, name: 'Home', href: '/' },
    { id: 2, name: 'Products', href: '/products' },
    { id: 3, name: 'About', href: '/about' },
  ];

  const authLinks = [
    { id: 4, name: 'Login', href: '/login', style: 'text-orange-400 hover:text-orange-300 transition' },
    { id: 5, name: 'Signup', href: '/signup', style: 'bg-orange-400 text-white px-4 py-1.5 rounded-md hover:bg-orange-300 transition' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Main Links */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-orange-400">Lalu Cake Wale</div>
            <div className="hidden md:flex space-x-6">
              {mainLinks.map((link) => (
                <Link key={link.id} href={link.href} className="text-orange-400 hover:text-orange-300 transition">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {authLinks.map((link) => (
              <Link key={link.id} href={link.href} className={link.style}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-orange-400 hover:text-orange-300 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 transition-all duration-300 ease-in-out">
          {mainLinks.map((link) => (
            <Link key={link.id} href={link.href} className="block py-2 text-orange-400 hover:text-orange-300">
              {link.name}
            </Link>
          ))}
          <hr className="border-gray-200" />
          {authLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`block py-2 ${link.name === 'Signup' ? 'bg-orange-400 text-white rounded-md text-center hover:bg-orange-300' : 'text-orange-400 hover:text-orange-300'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
