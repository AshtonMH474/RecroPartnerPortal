import { useAuth } from "@/context/auth";
import { tinaField } from "tinacms/dist/react"

function ProfileUser({top_links,bottom_links}){
    const {openModal} = useAuth()
    const handleLogin = () => {
            openModal('login')
        }
    const handleRegister = () => {
        openModal('register')
    }

    return( 
    <div className="h-full w-full flex flex-col justify-between pt-30 pb-8 text-center">
        <ul className="text-lg">
            {top_links?.map((link,i) => {
                const commonProps = {
                    "data-tina-field": tinaField(bottom_links[i], "label"),
                    className: " py-2 cursor-pointer",
                };
                const spanProps = {
                    className:"relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#B55914] hover:after:w-full after:transition-all after:duration-300"
                }
                 if (link?.type === "register") {
                    return (
                    <li onClick={handleRegister} key={i} {...commonProps}>
                        <span {...spanProps}>{link.label}</span>
                    </li>
                    );
                }

                if (link?.type === "login") {
                    return (
                    <li onClick={handleLogin} key={i} {...commonProps}>
                        <span {...spanProps}>{link.label}</span>
                    </li>
                    );
                }

                if (link?.type === "link") {
                    return (
                    <li key={i} {...commonProps}>
                        <a
                        rel="noopener noreferrer"
                        href={`https://${link.link}`}
                        >
                        <span {...spanProps}>{link.label}</span>
                        </a>
                    </li>
                    );
                }

                return null;
                
            })}
        </ul>
        <ul className="text-md">
            {bottom_links?.map((link, i) => {
                const commonProps = {
                    "data-tina-field": tinaField(bottom_links[i], "label"),
                    className: " py-2 cursor-pointer",
                };

   
                const spanProps = {
                    className:"relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#B55914] hover:after:w-full after:transition-all after:duration-300"
                }


                if (link?.type === "register") {
                    return (
                    <li onClick={handleRegister} key={i} {...commonProps}>
                        <span {...spanProps}>{link.label}</span>
                    </li>
                    );
                }

                if (link?.type === "login") {
                    return (
                    <li onClick={handleLogin} key={i} {...commonProps}>
                        <span {...spanProps}>{link.label}</span>
                    </li>
                    );
                }

                if (link?.type === "link") {
                    return (
                    <li key={i} {...commonProps}>
                        <a
                        rel="noopener noreferrer"
                        href={`https://${link.link}`}
                        >
                        <span {...spanProps}>{link.label}</span>
                        </a>
                    </li>
                    );
                }

                return null;
            })}

        </ul>
    </div>
        
    )
}

export default ProfileUser