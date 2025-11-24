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
                            <div className="flex items-center gap-x-2 md:gap-x-4">
                                <div
                                        style={{
                                        
                                        borderRadius: "50%",
                                        backgroundColor: "#D9D9D9",
                                        }}
                                        className="flex justify-center items-center w-10 h-10 md:w-15 md:h-15 "
                                    >
                                        <FaUser className="text-[20px] md:text-[30px] font-bold text-black" />
                                </div>
                                <h2 className="font-bold text-[18px] md:text-[26px]">Edit Profile</h2>
                            </div>
                            <p className="pt-2 pl-2 text-[14px] md:text-[18px] text-[#C2C2BC]">Make sure to add what topics you are intrested in for you below to get the best experience!</p>
                            <div className="pl-2 flex gap-y-2 sm:flex-row flex-col gap-x-4 pt-2 ">
                                <label className="text-white flex w-full sm:w-1/2 flex-col text-[14px] md:text-[18px] text-[#C2C2BC]">First Name
                                    <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full text-[14px] md:text-[18px]  p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
                                    />
                                </label>
                                <label className="text-white flex w-full sm:w-1/2 flex-col text-[14px] md:text-[18px] text-[#C2C2BC]">Last Name
                                    <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full text-[14px] md:text-[18px]  p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
                                    />
                                </label>
                            </div>
                            <div className="pt-2 flex flex-col  mx-auto">
                                {errors?.name && (<div className="pl-2 text-red-600 text-[18px]">{errors.name}</div>)}
                                {errors?.categories && (<div className="pl-2 text-red-600 text-[18px]">{errors.categories}</div>)}
                        
                            </div>
                           
        </div>
    )
}

export default EditProfileForm