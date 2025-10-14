import { useRouter } from "next/router";
import { useEffect, useState } from "react";


function ContactUsForm({sidebarWidth}) {
    const router = useRouter()
    const [isCareers,setCareers] = useState(false)
    const [errors,setErrors] = useState({})
    
     // checks if ur in the careers section 
    useEffect(() => {
      if(router.query.slug?.[0] === "careers") setCareers(true)
    },[])
    
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        let formData;
        // based on careers certian data is sent through email for either people looking for jobs or companies
        if(isCareers){
                 formData = {
                    firstName:e.target.firstName.value,
                    lastName:e.target.lastName.value,
                    email:e.target.email.value,
                    phone:e.target.phone.value,
                    subject:e.target.subject.value,
                    message:e.target.message.value,
                }
                
        }else{

                formData = {
                    firstName:e.target.firstName.value,
                    lastName:e.target.lastName.value,
                    email:e.target.email.value,
                    organization:e.target.organization.value,
                    subject:e.target.subject.value,
                    message:e.target.message.value,
                  
                }
        }
                if(!formData.email || !formData.firstName || !formData.lastName || !formData.subject || !formData.message || (!formData.organization && !formData.phone)){
                 setErrors({error: 'Make sure everything is filled out'})
                 return
                }
                const res = await fetch("/api/submit-form",{
                    method:"POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })
                

                if (res.ok) {
                e.target.firstName.value = ""
                e.target.lastName.value = ""
                e.target.email.value = ""
                e.target.subject.value = ""
                e.target.message.value = ""

                if(e.target.organization){
                  e.target.organization.value = ""
                } else e.target.phone.value = ""
                

                alert("Submitted successfully!");
                setErrors({})
                return
                }

                setErrors({error: 'Make sure everything is filled out and you are using your company email'})
                return 
         
      
    }
  
    return (
    <div className="flex justify-center items-center w-screen px-4 pb-16" style={{paddingRight: sidebarWidth > 0 ? '240px' : ''}}>
      <div className="w-full max-w-[800px] bg-[#1A1A1E] rounded-[12px] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name='firstName'
              placeholder="First Name"
              className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              name="email"
              placeholder={isCareers ? "Email" : "Company Email"}
              className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
            />
            <input
              type="text"
              name={isCareers ? "phone":"organization"}
              placeholder={isCareers ? "Phone Number" : "Organization"}
              className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
            />
          </div>

          
         
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />

          <textarea
            placeholder="Message"
            name="message"
            rows={4}
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70 resize-none"
          ></textarea>
          {errors?.error && (<div className="text-red-600">{errors.error}</div>)}
        
          <button
            type="submit"
            className="hover:opacity-80 cursor-pointer w-full py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUsForm;
