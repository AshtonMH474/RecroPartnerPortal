import Link from "next/link"
import { tinaField } from "tinacms/dist/react"

function Buttons({buttons}){
    return(
        <div className="  flex justify-center gap-x-4">
           {buttons?.map((button,i) => (
                <div key={i}>
                    {button.style == 'border' && (<Link href={button.link}><button data-tina-field={tinaField(button,'label')} className="px-8 text-[18px] capitalize py-2 border primary-border rounded hover:text-white/80 transition-colors duration-300">{button.label}</button></Link>)}
                    {button.style == 'button' && (<Link href={button.link}><button data-tina-field={tinaField(button,'label')} className="bg-primary text-[18px] capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white ">{button.label}</button></Link>)}
                </div>
           ))}
        </div>
    )
}

export default Buttons