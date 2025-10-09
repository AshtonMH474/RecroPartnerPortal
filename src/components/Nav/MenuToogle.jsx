export default function MenuToggle({ menuOpen, toggleMenu, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      onClick={toggleMenu}
      aria-label="Toggle menu"
      className="cursor-pointer flex flex-col justify-center items-center w-10 h-10 relative z-[200]"
    >
      <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
      <span className={`block w-6 h-[2px] bg-white my-[6px] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
      <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
    </button>
  );
}