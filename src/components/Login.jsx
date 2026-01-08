

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { handleLogin } from "@/lib/auth_functions";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/router";
import { fetchWithCsrf } from "@/lib/csrf";
import { isValidEmail } from "@/lib/sanitize";

function Login({ onClose,modalData }) {
  const { setUser, openModal } = useAuth();
  const [errors, setErrors] = useState({});
  const [isToken,setToken] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  
    useEffect(() => {
        const verify = async(token) => {
            if(token){
                 
                setToken(true)
                await fetchWithCsrf(`/api/session/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              });
                
            }
        }
        verify(modalData?.token)
    },[])
  // Lock body scroll when modal opens
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = () => {
    onClose();
    openModal("register");
  };

  const handleForgotPassword = () => {
    onClose();
    openModal("newPassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allFilled) {
      alert("Please fill all the fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      setErrors({ error: "Please enter a valid email address" });
      return;
    }

    try {
      setLoading(true)
      const res = await handleLogin(setUser, formData);
      if (res && res.error) {
        setErrors({ error: res.error });
        return;
      }
      onClose();
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to submit.");
    }finally{
        setLoading(false)
    }
  };

  const allFilled = Object.values(formData).every((val) => val.trim() !== "");

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
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70"
          />

          {errors?.error && (
            <div className="text-red-600">{errors.error}</div>
          )}
          {isToken && (
            <div className="pl-2 text-green-500 text-sm">Verification successful! You can now log in.</div>
          )}

          <button
            type="button"
            onClick={handleForgotPassword}
            className="pl-2 text-sm text-blue-400 hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!allFilled || loading}
              className={`w-full py-2 rounded text-white transition ${
                allFilled && !loading
                  ? "bg-primary cursor-pointer"
                  : "bg-[#B55914]/60 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2 rounded text-white hover:text-white/80 border primary-border bg-[#1A1A1E] hover:opacity-80 cursor-pointer transition-colors duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;