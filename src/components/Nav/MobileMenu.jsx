import { useAuth } from "@/context/auth";
import { handleSignout } from "@/lib/auth_functions";
import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";

function MobileMenu({
  isVisible,
  menuOpen,
  menuRef,
  toggleMenu,
  res,
}) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks([...(res?.sidebar_top_links || []), ...(res?.links || [])]);
  }, [res?.links, res?.sidebar_top_links]);

  if (!isVisible) return null;

  const {openModal,setUser} = useAuth()
  const handleLogin = () => {
        openModal('login')
        toggleMenu()
  }
  const handleRegister = () => {
        openModal('register')
        toggleMenu()
  }
  const handleLogout = () => {
        handleSignout(setUser)
        toggleMenu()
  }
  return (
    <div
      ref={menuRef}
      className={`pb-10 fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-black z-[100] 
        flex flex-col items-start px-8 py-6 gap-6 lg:hidden 
        transition-opacity overflow-y-auto duration-300 ease-in-out 
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      {links?.map((link, i) => {
        // handle different link styles if needed
                const commonProps = {
                  "data-tina-field": tinaField(links[i],'label'),
                  className:"capitalize py-2 text-white text-left w-full hover:text-white/80 transition-colors duration-300"
                }
                if (link?.type == 'register'){
                    return <button onClick={handleRegister} key={i} {...commonProps}>{link.label}</button>
                }
                if (link?.type == 'login'){
                    return <button onClick={handleLogin} key={i} {...commonProps}>{link.label}</button>
                }
                if(link?.type == 'logout'){
                    return <button onClick={handleLogout} key={i} {...commonProps}>{link.label}</button>
                }
                if (link?.type == 'link'){
                    return <a key={i} rel="noopener noreferrer"  href={`${link.link}`}><button  {...commonProps}>{link.label}</button></a>
                }
      })}
    </div>
  );
}

export default MobileMenu;
