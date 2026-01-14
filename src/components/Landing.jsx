import { useAuth } from "@/context/auth"
import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";

function Landing(props){
    const {openModal} = useAuth()
    const [inlineWidth, setInlineWidth] = useState('100%');

    const handleLogin = () => {
        openModal('login')
    }
    const handleRegister = () => {
        openModal('register')
    }

    useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth >= 1024 && props.width) {
        setInlineWidth(`${props.width}%`);
      } else {
        setInlineWidth("100%");
      }
    };

    updateWidth(); // run on mount
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [props.width]);

    return (
        <div
        style={{ minHeight: '100vh' }}
        data-testid="landing-block"
        className={`landing flex flex-col items-center justify-center w-full text-center`}
        > 
            <div className=" px-4" style={{ width: inlineWidth }}>
                {props.heading && (
                <div data-tina-field={tinaField(props, 'heading')}>
                    <TinaMarkdown
                    content={props.heading}
                    components={{
                        bold: (p) => <span className="primary-color" {...p} />,
                        h1: (p) => (
                        <h1
                            className="text-[32px] md:text-[40px] lg:text-[60px] font-bold text-center mb-4"
                            {...p}
                        />
                        ),
                        h2:(p) =><h2 className="text-[26px] md:text-[32px] lg:text-[45px]  text-center mb-6" {...p}/> ,
                        h3: (p) => (
                        <h3 className="text-[16px] secondary-text mb-6" {...p} />
                        ),
                        p: (p) => (
                        <p className="text-[16px] secondary-text mb-6" {...p} />
                        ),
                    }}
                    />
                </div>
                )}
            </div>

            <div className="flex gap-x-8 ">
                {props.buttons?.map((button, i) => {
                    const commonProps = {
                        "data-tina-field": tinaField(props.buttons[i], "label"),
                        className:
                        button.style === "border"
                            ? "px-8 capitalize py-2 border primary-border rounded hover:text-white/80 transition-colors duration-300"
                            : "bg-primary capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white",
                    };

                    // LINK buttons
                    if (button?.type === "link" && button.link) {
                        return (
                        <Link href={button.link} key={i}>
                            <button {...commonProps}>{button.label}</button>
                        </Link>
                        );
                    }

                    // REGISTER button
                    if (button?.type === "register") {
                        return (
                        <button key={i} {...commonProps} data-type="register" onClick={handleRegister}>
                            {button.label}
                        </button>
                        );
                    }

                    // LOGIN button
                    if (button?.type === "login") {
                        return (
                        <button key={i} {...commonProps} data-type="login" onClick={handleLogin}>
                            {button.label}
                        </button>
                        );
                    }

                    return null;
                    })}
            </div>
        </div>
    )
}

export default Landing