import Link from "next/link"

function Buttons({buttons}){
    return(
        <div className="flex justify-center">
           {buttons?.map((button,i) => (
                <div key={i}>
                    {button.style == 'border' && (<Link href={button.link}><button className="px-8 capitalize py-2 border primary-border rounded hover:text-white/80 transition-colors duration-300">{button.label}</button></Link>)}
                    {button.style == 'button' && (<Link href={button.link}><button className="bg-primary capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white ">{button.label}</button></Link>)}
                </div>
           ))}
        </div>
    )
}

export default Buttons