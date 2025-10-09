import { useAuth } from "@/context/auth"
import Logo from "./Logo"
import ProfileUser from "./ProfileUser"
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import MenuToggle from "./MenuToogle";
import MobileMenu from "./MobileMenu";
import { CiBellOn } from "react-icons/ci";

export default function Nav(props){
  
    const {user} = useAuth()
    const router = useRouter();
    const pathname = usePathname();
    const buttonRef = useRef(null);
    const menuRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      // no user logged in → force back to homepage
      if (pathname !== "/") router.push("/");
    } else if (user?.email && pathname === "/") {
      // logged in user on homepage → go to dashboard
      router.push("/dashboard");
    }
  }, [user, pathname, router]);


  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      setIsVisible(true);
      setTimeout(() => setMenuOpen(true), 10);
    }
  };

    
    
    return(
      <>
        <div className="fixed top-0 left-0 w-full z-[101] bg-black flex justify-between lg:justify-end items-center h-20 px-4 lg:px-8">
            <div className="lg:hidden"><Logo logo={props} /></div>
            <ProfileUser links={props.links} />
            <div className="flex items-center lg:hidden">
              {user?.email && (<CiBellOn className=" text-white h-10 w-10 cursor-pointer hover:text-[#B55914] transition-all duration-200"/>)}
              <MenuToggle menuOpen={menuOpen} toggleMenu={toggleMenu} buttonRef={buttonRef} />
            </div>
            
            
        </div>
        
        <MobileMenu
        isVisible={isVisible}
        menuOpen={menuOpen}
        menuRef={menuRef}
        res={props}
        toggleMenu={toggleMenu}
        
      />
        <div className="h-10" />
      </>
    )
}