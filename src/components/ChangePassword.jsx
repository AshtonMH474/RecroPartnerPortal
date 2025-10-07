import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";



function ChangePassword({onClose,token}){
    const [errors,setErrors] = useState({})
    const [success, setSuccess] = useState(null);
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

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword:''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const allFilled = Object.values(formData).every((val) => val.trim() !== "");
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {}
    if(formData?.newPassword?.length < 8){
        obj.pass = 'Password Must be 8 Characters or More'
    }
    if(formData.newPassword !== formData.confirmPassword){
        obj.password = 'Make Sure Passwords Match'
    }

    if(obj.password || obj.pass) {
        setErrors(obj)
        return
    }
    setErrors({});
    setSuccess("");
    

    try {
      const res = await fetch("/api/session/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ error: data.error || "Something went wrong" });
      } else {
        setSuccess("Password has been reset successfully!");
        // Optional: auto-close modal or redirect after success
        // setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      setErrors({ error: "Network error, please try again." });
    } 
  };
    return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />
            {errors?.password && <div className="text-red-600">{errors.password}</div>}
          {errors?.pass && <div className="text-red-600">{errors.pass}</div>}
          {errors?.error && (
            <div className="text-red-500 text-sm">{errors.error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}

          <button
            type="submit"
            disabled={!allFilled}
            className={`w-full py-2 rounded text-white transition ${
              allFilled 
                ? "bg-primary cursor-pointer"
                : "bg-[#B55914]/60 cursor-not-allowed"
            }`}
          >
             Change Password
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ChangePassword