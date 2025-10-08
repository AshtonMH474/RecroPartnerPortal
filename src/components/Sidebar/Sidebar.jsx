import { useAuth } from "@/context/auth";
import ProfileUser from "./ProfileUser";

export default function Sidebar(props){
    const {user} = useAuth()
    

    return(
        <div className=" fixed top-0 left-0 h-full w-[200px]  z-[100] bg-black flex justify-between items-center h-20 px-4 lg:px-8">
            
                <ProfileUser top_links={props.sidebar_top_links} bottom_links={props.sidebar_bottom_links}/>
            
           
        </div>
    )
}