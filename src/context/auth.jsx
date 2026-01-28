import { createContext, useCallback, useContext, useEffect, useState, lazy, Suspense } from 'react';
import { checkUser } from '@/lib/auth_functions';
const Login = lazy(() => import('@/components/Login'));
const Register = lazy(() => import('@/components/Register'));
const NewPasswordModal = lazy(() => import('@/components/New-Password'));
const ChangePassword = lazy(() => import('@/components/ChangePassword'));
const EditProfile = lazy(() => import('@/components/EditProfile/EditProfile'));

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState('loading');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const refreshUser = useCallback(() => {
    checkUser(setUser);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const openModal = (type, data = null) => {
    setActiveModal(type);
    setModalData({ data });
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, openModal, closeModal, refreshUser }}>
      {children}

      {/* ✅ Centralized modal rendering with Suspense for code splitting */}
      <Suspense fallback={null}>
        {activeModal === 'login' && (
          <Login onClose={closeModal} setUser={setUser} modalData={modalData?.data} />
        )}
        {activeModal === 'register' && <Register onClose={closeModal} />}
        {activeModal === 'newPassword' && <NewPasswordModal onClose={closeModal} />}
        {activeModal === 'changePassword' && (
          <ChangePassword token={modalData?.data?.token} onClose={closeModal} />
        )}
        {activeModal === 'Edit' && <EditProfile onClose={closeModal} />}
      </Suspense>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
