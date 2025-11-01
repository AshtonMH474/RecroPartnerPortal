
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Login from "@/components/Login";
import Register from "@/components/Register";
import NewPasswordModal from "@/components/New-Password";
import ChangePassword from "@/components/ChangePassword";
import { checkUser } from "@/lib/auth_functions";
import OppModal from "@/components/Opportunites/OppModal";
import EditProfile from "@/components/EditProfile/EditProfile";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState("loading");
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  


const refreshUser = useCallback(() => {
    checkUser(setUser);
  }, []);

  // Run once on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

 const openModal = (type, data = null, onChange = null) => {
  setActiveModal(type);
  setModalData({ data, onChange }); // ✅ store both the opp and the callback
};


  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

 

  return (
    <AuthContext.Provider value={{ user, setUser, openModal, closeModal,refreshUser }}>
      {children}

      {/* Centralized modal rendering */}
      {activeModal === "login" && (
        <Login onClose={closeModal} setUser={setUser} modalData={modalData?.data} />
      )}
      {activeModal === "register" && (
        <Register onClose={closeModal} />
      )}
      {activeModal === "newPassword" && (
        <NewPasswordModal onClose={closeModal} />
      )}
      {activeModal === "changePassword" && (
        <ChangePassword token={modalData?.data?.token} onClose={closeModal} />
      )}
      {activeModal == 'Opp' && (
        <OppModal opp={modalData.data} onClose={closeModal} onSaveChange={modalData?.onChange}/>
      )}
      {activeModal == 'Edit' && (
        <EditProfile onClose={closeModal}/>
      )}
      
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);