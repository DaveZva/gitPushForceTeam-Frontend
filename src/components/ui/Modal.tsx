import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                children
                                            }) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-lg w-[90%] max-w-[400px] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2.5 right-4 bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600"
                >
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
};