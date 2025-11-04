// Soubor: src/components/ui/Modal.jsx
import React from 'react';

export const Modal = ({
                          isOpen,     // Prop, která říká, zda je modal vidět (true/false)
                          onClose,    // Funkce, která se zavolá při zavření
                          children    // Obsah, který se zobrazí uvnitř
                      }) => {

    // Pokud není isOpen true, komponentu vůbec nezobrazíme
    if (!isOpen) {
        return null;
    }

    return (
        // Overlay (překlad .auth-modal-overlay)
        // Umožní zavřít modal kliknutím vedle obsahu
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
        >
            {/* Content box (překlad .auth-modal-content) */}
            {/* Zabrání zavření modalu při kliknutí přímo na obsah */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-lg w-[90%] max-w-[400px] relative"
            >
                {/* Close Button (překlad .close-btn) */}
                <button
                    onClick={onClose}
                    className="absolute top-2.5 right-4 bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600"
                >
                    &times; {/* Toto je HTML entita pro křížek '×' */}
                </button>

                {/* Zde se zobrazí obsah, který do modalu pošleme */}
                {children}
            </div>
        </div>
    );
};