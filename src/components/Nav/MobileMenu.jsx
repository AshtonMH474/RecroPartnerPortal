import { useAuth } from "@/context/auth";
import { handleSignout } from "@/lib/auth_functions";
import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import IconRenderer from "../utils/IconRenderer";
import { useRouter } from "next/router";

function MobileMenu({ isVisible, menuOpen, menuRef, toggleMenu, res }) {
  const [links, setLinks] = useState([]);
  const { openModal, setUser } = useAuth();
  const router = useRouter()

  useEffect(() => {
    setLinks([...(res?.sidebar_top_links || []), ...(res?.links || [])]);
  }, [res?.links, res?.sidebar_top_links]);

   useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  if (!isVisible) return null;

  const handleLogin = () => {
    openModal("login");
    toggleMenu();
  };

  const handleRegister = () => {
    openModal("register");
    toggleMenu();
  };

  const handleLogout = () => {
    handleSignout(setUser);
    toggleMenu();
    router.push('/')
  };
  const handleEdit = () => {
      toggleMenu()
      openModal('Edit')
  }

  const commonClass =
    "capitalize py-2 text-white text-left w-full hover:text-white/80 transition-colors duration-300 flex items-center gap-x-2";

  return (
    <div
      ref={menuRef}
      className={`pb-10 fixed z-[9998] top-20 left-0 w-full h-[calc(100vh-80px)] bg-black z-[100]
        flex flex-col items-start px-8 py-6 gap-6 lg:hidden
        transition-opacity overflow-y-auto duration-300 ease-in-out
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      {links?.map((link, i) => {
        const icon =
          link?.icon && (
            <IconRenderer size="18px" color="currentColor" iconName={link.icon} />
          );

        const label = (
          <>
            {icon}
            <span data-tina-field={tinaField(link, "label")}>{link.label}</span>
          </>
        );

        if (link?.type === "register")
          return (
            <button key={i} onClick={handleRegister} className={commonClass}>
              {label}
            </button>
          );

        if (link?.type === "login")
          return (
            <button key={i} onClick={handleLogin} className={commonClass}>
              {label}
            </button>
          );

        if (link?.type === "logout")
          return (
            <button key={i} onClick={handleLogout} className={commonClass}>
              {label}
            </button>
          );

        if(link?.type == 'edit profile'){
                  return <li onClick={handleEdit} key={i} className={commonClass}>{link.label}</li>
        }

        if (link?.type === "link")
          return (
            <a
              key={i}
              href={link.link}
              rel="noopener noreferrer"
              onClick={toggleMenu}
              className={commonClass}
            >
              {label}
            </a>
          );
      })}
    </div>
  );
}

export default MobileMenu;
