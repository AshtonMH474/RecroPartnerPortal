import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

function NewPasswordModal({ onClose,setShowLoginModal }) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

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
    email: "",
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
    if (!allFilled) return;

    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const res = await fetch("/api/session/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("If this email exists, a reset link has been sent.");
        setFormData({ email: "" });
      } else {
        setErrors({ error: data.error || "Something went wrong." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async(e) => {
    await onClose()
    await setShowLoginModal(true)
  }

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

          {errors?.error && (
            <div className="text-red-500 text-sm">{errors.error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}
            <button
            type="button"
            className={"w-full py-2 rounded text-white hover:text-white/80 border primary-border  bg-[#1A1A1E] hover:opacity-80 cursor-pointer transition-colors duration-300"}
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            type="submit"
            disabled={!allFilled || loading}
            className={`w-full py-2 rounded text-white transition ${
              allFilled && !loading
                ? "bg-primary cursor-pointer"
                : "bg-[#B55914]/60 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default NewPasswordModal;