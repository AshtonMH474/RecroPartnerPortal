import { useAuth } from "@/context/auth";
import { tinaField } from "tinacms/dist/react";
import IconRenderer from "../utils/IconRenderer";
import { handleSignout } from "@/lib/auth_functions";
import { useRouter } from "next/router";

export default function ProfileUser({ top_links, bottom_links }) {
  const { openModal, setUser } = useAuth();
  const router = useRouter()
  const handleLogin = () => openModal("login");
  const handleRegister = () => openModal("register");
  const handleLogout = () => {
      handleSignout(setUser)
      router.push('/')
    }

  const renderLink = (link, i, isBottom = false) => {
    const commonProps = {
      "data-tina-field": tinaField(isBottom ? bottom_links[i] : top_links[i], "label"),
      className:
        "flex items-center gap-3 py-2 pl-2  text-lg rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:text-[#d46b19] backdrop-blur-sm",
    };

    const spanProps = {
      className:
        "relative pt-[1px] inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#d46b19] hover:after:w-full after:transition-all after:duration-300",
    };

    const icon = link.icon && (
      <IconRenderer size="22px" color="white" iconName={link.icon} />
    );

    const handleClick = () => {
      if (link?.type === "register") return handleRegister();
      if (link?.type === "login") return handleLogin();
      if (link?.type === "logout") return handleLogout;
    };

    if (link?.type === "link") {
      return (
        <li key={i} {...commonProps}>
          <a
            href={link.link.startsWith("http") ? link.link : `${link.link}`}
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full"
          >
            {icon}
            <span {...spanProps}>{link.label}</span>
          </a>
        </li>
      );
    }

    return (
      <li key={i} {...commonProps} onClick={handleClick}>
        {icon}
        <span {...spanProps}>{link.label}</span>
      </li>
    );
  };

  return (
    <div className="flex flex-col  justify-between h-[95%] w-full  pb-6 text-center text-gray-200">
      <ul className="space-y-8">
        {top_links?.map((link, i) => renderLink(link, i))}
      </ul>

      <ul className="space-y-2 pb-20 border-t border-white/10 pt-6">
        {bottom_links?.map((link, i) => renderLink(link, i, true))}
      </ul>
    </div>
  );
}
