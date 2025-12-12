import { motion } from "framer-motion"
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { MdSaveAlt } from "react-icons/md";
import EditProfileForm from "./EditProfileForm";
import EditCategories from "./EditCategories";
import { checkUser } from "@/lib/auth_functions";
import { getCategories } from "@/lib/service_functions";
import { fetchWithCsrf } from "@/lib/csrf";
function EditProfile({onClose}){
    const {user,setUser} = useAuth()

    if(!user) return null

    useEffect(() => {
    // Lock scrolling when modal opens
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        // ✅ Cleanup when modal unmounts or closes
        return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        };
    }, []);
    
    const [formData, setFormData] = useState({
        firstName:user.firstName,
        lastName:user.lastName,
        });


    const [categories,setCategories] = useState([])
    const [activeCategories, setActiveCategories] = useState([]);
    const [errors,setErrors] = useState({})



    const toggleCategory = (catName) => {
    setActiveCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((name) => name !== catName)
        : [...prev, catName]
    );
  };

  const handleClose = async () => {
    if(!user.interests){
        let obj = {};
        if(!activeCategories.length){
            obj.categories = 'You Must Select at Least One Interest'
        }
        if(!formData.firstName.length || !formData.lastName.length){
            obj.name = 'First Name and Last Name must be filled'
        }
        if(obj.name || obj.categories){
            setErrors(obj)
            return
        }
        await handleSubmit()
    }
     await onClose()
        
    }

  const  handleSubmit = async () => {
     let obj = {};
     if(!activeCategories.length){
        obj.categories = 'You Must Select at Least One Interest'
     }
     if(!formData.firstName.length || !formData.lastName.length){
        obj.name = 'First Name and Last Name must be filled'
     }
     if(obj.name || obj.categories){
        setErrors(obj)
        return
     }

     try{
        const res = await fetchWithCsrf('/api/userInfo/save', {
            method:'PUT',
            headers: {"Content-Type": 'application/json'},
            body:JSON.stringify({
                interests:activeCategories,
                firstName:formData.firstName,
                lastName:formData.lastName,
                email:user.email
            })

        })

        if(res.ok){
            await checkUser(setUser)
            await onClose()
        }
     }catch(e){
        console.error('Error:' + e)
     }

  }


    useEffect(() => {
       getCategories(setCategories)
    },[])

    useEffect(() => {
        setActiveCategories(user.interests || [])
    },[user])
    

    return(
        <div
      className="fixed inset-0 z-[1000] flex justify-center items-center"
      onClick={handleClose}
    >
            <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        />

        {/* Modal Content */}
        <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="relative z-[1001] w-[90%] max-w-[1500px] max-h-[90%] overflow-y-auto bg-[#1A1A1E] rounded-[12px] p-6"
        >
            <div className="flex justify-end">
                <IoMdClose onClick={handleClose} className="cursor-pointer text-white text-[24px] hover:text-primary transition" />
            </div>
            
            <EditProfileForm errors={errors} formData={formData} setFormData={setFormData}/>
            <EditCategories categories={categories} activeCategories={activeCategories} toggleCategory={toggleCategory} user={user}/>
           
            <div className="flex justify-center pt-8 ">
                <button onClick={handleSubmit} className="flex justify-center items-center bg-primary capitalize cursor-pointer text-[18px] md:text-[22px] px-4 py-2 w-auto md:w-[160px] rounded-xl hover:opacity-80 text-white flex items-center gap-x-1">Save <MdSaveAlt className="text-[20px] md:text-[26px] mb-1"/></button>
            </div>
            
        </motion.div>

      </div>
    )
}

export default EditProfile