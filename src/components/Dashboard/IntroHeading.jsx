import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
function IntroHeading({props,user}){
    return(
        <>
            {props.heading && user?.firstName && (
                <div data-tina-field={tinaField(props,'heading')}>
                    <TinaMarkdown
                    content={props.heading}
                    components={{
                        bold:(p) => <span className="primary-color" {...p} />,
                        h1: (p) => (
                            <h1 className="text-[32px]  lg:text-[40px] xl:text-[50px] font-bold mb-4">
                                {p.children}
                                {user ? `, ${user?.firstName}` : ""}
                            </h1>
                    ), 
                    }}
                    /> 
                </div>
            )}
        </>
    )
}
export default IntroHeading