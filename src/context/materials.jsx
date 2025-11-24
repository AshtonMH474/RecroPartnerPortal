import { createContext, useContext, useState, lazy, Suspense } from "react";

const CardModal = lazy(() => import("@/components/Cards/CardModal"));
const MaterialsContext = createContext();

export function MaterialsProvider({ children }) {
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState(null);


    const openModal = (type, data = null, onChange = null) => {
        setActiveModal(type);
        setModalData({ data, onChange });
    };
    const closeModal = () => {
        setActiveModal(null);
        setModalData(null);
    };

    return (
        <MaterialsContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Suspense fallback={null}>
                {activeModal === "cardModal" && <CardModal card={modalData?.data} onClose={closeModal} />}
            </Suspense>
        </MaterialsContext.Provider>
    );

}

export const useMaterials = () => useContext(MaterialsContext);

export default MaterialsProvider;