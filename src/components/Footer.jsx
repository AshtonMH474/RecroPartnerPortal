import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ContactUsForm from "./ContactUsForm";
import { tinaField } from "tinacms/dist/react";

function Footer({res}) {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm((prev) => !prev);

  return (
    <div className="bg-black w-full  z-40"  >
        <div className="border-t border-b border-white/50 mb-16">
            <div className="flex justify-center">
            <div className="relative flex-col sm:flex-row bottom-10 inline-flex items-center justify-center bg-primary h-auto  mx-auto py-2  px-6 rounded-[12px]">
                <h3 data-tina-field={tinaField(res,'footerMessage')} className="text-center text-white pr-4 pb-2 sm:pb-0 text-[16px]">{res.footerMessage}</h3>
                <div className="flex gap-x-4">
                {res.buttons?.map((button,i) => {
                  if (button.style === 'border') {
                    return (
                    <button
                        onClick={toggleForm}
                        key={i}
                        data-tina-field={tinaField(res.buttons[i], 'label')}
                        className="cursor-pointer px-4 capitalize py-2 border border-white rounded hover:text-white/80 transition-colors duration-300"
                    >
                        {button.label}
                    </button>
                    );
                } else if (button.style === 'button') {
                    return (
                    <button
                        onClick={toggleForm}
                        key={i}
                        data-tina-field={tinaField(res.buttons[i], 'label')}
                        className="cursor-pointer bg-[#3F3F38] capitalize cursor-pointer px-4 py-2 w-auto rounded hover:opacity-80 text-white"
                    >
                        {button.label}
                    </button>
                    );
                }
                    return null;
                })}
                </div>
            </div>
            </div>

            {/* Animated Contact Form */}
            <AnimatePresence>
            {showForm && (
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                <ContactUsForm />
                </motion.div>
            )}
            </AnimatePresence>
            
                {/* Links */}
                    <motion.div key={showForm ? "withForm" : "noForm"}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    className="relative bottom-5 flex  gap-6 sm:flex-row items-center justify-center sm:gap-30">
                        {res.links?.map((link,i) => 
                            link.link ? (
                                <Link data-tina-field={tinaField(res.links[i], 'label')} key={i} href={link.link}>{link.label}</Link>
                            ) : null
                        )}
                    </motion.div>
        </div>

            {/* Footer Text */}
            <motion.div key={showForm ? "withForm" : "noForm"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }} className="flex justify-center">
                <h3 data-tina-field={tinaField(res,'copyright')} className="relative bottom-8 text-center">
                    {res.copyright}
                </h3>
            </motion.div>
        
    </div>
  );
}

export default Footer;
