import { useState,useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { motion, number } from "framer-motion";
import { handleSignup } from "@/lib/auth_functions";
import { useAuth } from "@/context/auth";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
function Register({onClose}){
    const { openModal } = useAuth();
    const [errors,setErrors] = useState({})
    const [loading,setLoading] = useState(false)
    const [formData, setFormData] = useState({
    email: "",
    password:'',
    organization:'',
    firstName:'',
    lastName:'',
    confirmPassword:''
    });
    const [verified,setVerified] = useState(false)
    const [phone, setPhone] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
    if (cooldown > 0) {
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }
    }, [cooldown]);

    useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!allFilled){
        alert("Please Fill All the Fields")
        return
    }
    const obj = {}
    if(formData?.password?.length < 8){
        obj.pass = 'Password Must be 8 Characters or More'
    }
    if(formData.password !== formData.confirmPassword){
        obj.password = 'Make Sure Passwords Match'
    }
    if(obj.password || obj.pass){
        setErrors(obj)
        return
    }
    if(!phone || !isValidPhoneNumber(phone)){
        obj.number = 'Please Enter a Valid Phone Number'
        setErrors(obj)
        return
    }
    
    try {
      setLoading(true); // <-- show "Sending..."
      let res = await handleSignup(formData,phone);

      if (res.verified === false) {
        setVerified(true);
      }
      if (res.error) {
        obj.error = res.error;
        setErrors(obj);
        return;
      }

      setVerified(true);
      setErrors({});
    } catch {
      alert("Failed to submit.");
    } finally {
      setLoading(false); // <-- reset back
    }
  }

  const handleLoginModal = async() => {
    onClose()
    openModal("login")
  }
  const allFilled = Object.values(formData).every((val) => val.trim() !== "");

    return(
        <div
      className="fixed inset-0 z-[1000] flex justify-center items-center"
      onClick={onClose}
    >
      {/* Backdrop */}
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
        className="relative z-[1001] w-[90%] max-w-[800px] max-h-[90%] overflow-y-auto bg-[#1A1A1E] rounded-[12px] p-6"
      >
        {/* Header */}
        <div className="flex justify-end mb-8">
          <button onClick={onClose} aria-label="Close Modal">
            <IoMdClose className="cursor-pointer text-white text-[24px] hover:text-primary transition" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}  className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Company Email"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />

          <div className="flex flex-col sm:flex-row gap-4">
             <PhoneInput
              placeholder="Enter phone number"
              value={phone}
              onChange={setPhone}
              defaultCountry="US" // or whatever default
              className="w-[50%] p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
              containerStyle={{ border: '2px solid blue', borderRadius: '5px' }}
              inputStyle={{ backgroundColor: 'lightblue', color: 'darkblue', padding: '10px' }}
            />

            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Company"
              className="w-full sm:w-1/2 p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
            />
          </div>
         
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter Password"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />
          {errors?.number && <div className="text-red-600">{errors.number}</div>}
          {errors?.password && <div className="text-red-600">{errors.password}</div>}
          {errors?.pass && <div className="text-red-600">{errors.pass}</div>}
          {errors?.error && <div className="text-red-600">{errors.error}</div>}
          {(verified ) && (
  <div className="text-green-400 space-y-2">
    <p>Check your email to verify and then login</p>
    <button
      disabled={cooldown > 0}
      type="button"
      onClick={async () => {
        const res = await fetch("/api/session/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (res.ok) {
          setCooldown(60);
        } else {
          setErrors({ error: data.error });
        }
      }}
      className={`px-4 py-2 rounded text-white ${
        cooldown > 0 ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:opacity-80 cursor-pointer"
      }`}
    >
      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
    </button>
  </div>
)}

        <div className="flex gap-4">
            <button
  type="submit"
  disabled={!allFilled || loading}
  className={`w-full py-2 rounded text-white transition ${
    allFilled && !loading
      ? "bg-primary2 bg-primary cursor-pointer"
      : "bg-[#B55914]/60 cursor-not-allowed"
  }`}
>
  {loading ? "Sending..." : "Register"}
</button>

            <button type="button" onClick={handleLoginModal} className="w-full py-2 rounded text-white hover:text-white/80 border primary-border  bg-[#1A1A1E] hover:opacity-80 cursor-pointer transition-colors duration-300">
                Login
            </button>
        </div>
        
        </form>
      </motion.div>
    </div>
    )
}

export default Register