import { useEffect, useState } from "react";
import ProfileUser from "./ProfileUser";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Logo from "../Nav/Logo";

export default function Sidebar({ res, onWidthChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Detect screen size
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024; // Tailwind lg breakpoint
      setIsLargeScreen(isLg);
      // Close sidebar if below lg
      if (!isLg) setIsOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    onWidthChange?.(isOpen && isLargeScreen ? 240 : 0);
  }, [isOpen, isLargeScreen, onWidthChange]);

  return (
    <div className="fixed hidden lg:flex top-0 left-0 h-full z-[101] flex items-center">
      {/* Sidebar container */}
      <div
      className={`fixed top-0 left-0 h-full w-[240px]
        bg-black border-r border-[#222]
        text-white shadow-lg
        transition-all duration-500 ease-in-out transform
        ${isOpen
          ? "translate-x-0 opacity-100 pointer-events-auto"
          : "-translate-x-full opacity-0 pointer-events-none"}
      `}
    >
      <div className="h-full px-6">
        <Logo logo={res} />
        <ProfileUser
          top_links={res?.sidebar_top_links}
          bottom_links={res?.sidebar_bottom_links}
        />
      </div>
    </div>

      {/* Toggle circle button (hidden on mobile) */}
      {isLargeScreen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute top-1/2 -translate-y-1/2
            rounded-full w-10 h-10 flex items-center justify-center cursor-pointer
            ${isOpen ? 'bg-black' : ''} hover:bg-[#d46b19] text-white
            shadow-md transition-all duration-300
            ${isOpen ? "left-[210px]" : "left-2"}
          `}
        >
          {isOpen ? <IoChevronBack size={22} /> : <IoChevronForward size={22} />}
        </button>
      )}
    </div>
  );
}

