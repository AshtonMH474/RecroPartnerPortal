import { useAuth } from "@/context/auth"
import { useRouter } from "next/router"
import Heading from "./Heading"
import Filters from "./Filters"

function Dashboard(props){
    const {user} = useAuth()
    const router = useRouter()
    

    if(!user){
        router.push('/')
        return (
            <div style={{minHeight:'100vh'}}></div>
        )
    }
    

    return(
        <div style={{minHeight:'100vh'}}>
            <div className="mt-32 flex flex-col pl-16">
                <div>
                   <Heading props={props} user={user} />
                   <Filters props={props} user={user}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard