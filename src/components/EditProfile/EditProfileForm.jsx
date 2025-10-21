import { FaUser } from "react-icons/fa";

function EditProfileForm({errors,formData,setFormData}){
     const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    };
    return(
        <div className="w-auto md:w-[70%] mx-auto ">
                            <div className="flex items-center gap-x-4">
                                <div
                                        style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: "#D9D9D9",
                                        }}
                                        className="flex justify-center items-center  "
                                    >
                                        <FaUser className="text-[30px] font-bold text-black" />
                                </div>
                                <h2 className="font-bold text-[26px]">Edit Profile</h2>
                            </div>
                            <p className="pt-2 pl-2 text-[#C2C2BC]">Make sure to add what topics you are intrested in for you below to get the best experience!</p>
                            <div className="pl-2 flex gap-y-2 sm:flex-row flex-col gap-x-4 pt-2 ">
                                <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
                                />
                                <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
                                />
                            </div>
                            <div className="pt-2 flex flex-col  mx-auto">
                                {errors?.name && (<div className="pl-2 text-red-600 text-[18px]">{errors.name}</div>)}
                                {errors?.categories && (<div className="pl-2 text-red-600 text-[18px]">{errors.categories}</div>)}
                        
                            </div>
                           
        </div>
    )
}

export default EditProfileForm