import { useAuth } from "@/context/auth"
import Logo from "./Logo"
import ProfileUser from "./ProfileUser"
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function Nav(props){
    const {user} = useAuth()
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
    // Only redirect if the user object has a valid identifier
    if (user?.email && pathname === "/") {
      router.push("/dashboard");
    }
  }, [user, pathname, router]);

    
    
    return(
        <div className="fixed top-0 left-0 w-full z-[101] bg-black flex justify-between items-center h-20 px-4 lg:px-8">
            <Logo logo={props} />
            <ProfileUser links={props.links} />
            

        </div>
    )
}