import { useAuth } from "@/context/auth";
import { FaUser } from "react-icons/fa";
import { tinaField } from "tinacms/dist/react";

function ProfileUser({links}) {
    const {openModal} = useAuth()
    const handleLogin = () => {
            openModal('login')
        }
    const handleRegister = () => {
        openModal('register')
    }
  return (
    <div className="relative inline-block group">
      {/* Circle */}
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#D9D9D9",
        }}
        className="flex justify-center items-center cursor-pointer hover:bg-gray-300"
      >
        <FaUser className="text-[30px] font-bold text-black" />
      </div>

      {/* Menu (hidden until hover) */}
      <div className="absolute right-0 mt-2 min-w-40 bg-black border border-white/15 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <ul className="text-md">
            {links?.map((link,i) => {
                const commonProps = {
                    "data-tina-field": tinaField(links[i],'label'),
                    className:"px-4 py-2 cursor-pointer"
                }
                const spanProps = {
                    className:"relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#B55914] hover:after:w-full after:transition-all after:duration-300"
                }

                if (link?.type == 'register'){
                    return <li onClick={handleRegister} key={i} {...commonProps}><span {...spanProps}>{link.label}</span></li>
                }
                if (link?.type == 'login'){
                    return <li onClick={handleLogin} key={i} {...commonProps}><span {...spanProps}>{link.label}</span></li>
                }
                if (link?.type == 'link'){
                    return <li key={i} {...commonProps}><a  rel="noopener noreferrer"  href={`https://${link.link}`}><span {...spanProps}>{link.label}</span></a></li>
                }
                else return null
            })}
        </ul>

      </div>
    </div>
  );
}

export default ProfileUser;