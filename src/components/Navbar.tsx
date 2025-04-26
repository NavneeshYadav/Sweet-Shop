'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'; // ✨ Import Clerk components

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const cartItems = useAppSelector(state => state.cart.items);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);

  const mainLinks = [
    { navId: 1, name: 'Home', href: '/' },
    { navId: 2, name: 'Products', href: '/products' },
    { navId: 3, name: 'About', href: '/about' },
    { navId: 4, name: 'Admin', href: '/admin' },
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
                <Link
                  key={link.navId}
                  href={link.href}
                  className={`transition ${pathname === link.href ? 'text-orange-600 font-semibold' : 'text-orange-400 hover:text-orange-300'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Cart Icon and Auth */}
          <div className="hidden md:flex space-x-4 items-center">
            <div className="relative">
              <Link href="/cart" className="text-orange-400 hover:text-orange-300 transition relative">
                <ShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Clerk Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-orange-400 hover:text-orange-300 transition">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-orange-400 text-white px-4 py-1.5 rounded-md hover:bg-orange-300 transition">
                  Signup
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/orders"
                  className="text-orange-400 hover:text-orange-300 py-2 text-center"
                >
                  My Orders
                </Link>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="text-orange-400 hover:text-orange-300 relative">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
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
            <Link
              key={link.navId}
              href={link.href}
              className={`block py-2 transition ${pathname === link.href ? 'text-orange-600 font-semibold' : 'text-orange-400 hover:text-orange-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-gray-200" />

          {/* Mobile Clerk Auth */}
          <SignedOut>
            <div className="flex flex-col space-y-2">
              <SignInButton mode="modal">
                <button className="text-orange-400 hover:text-orange-300">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-orange-400 text-white rounded-md py-2 hover:bg-orange-300">
                  Signup
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
