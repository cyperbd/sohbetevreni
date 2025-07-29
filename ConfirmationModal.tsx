import React from 'react';
import { CloseIcon } from './icons/IconComponents';

interface ConfirmationModalProps {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, onClose, onConfirm }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-dark-secondary rounded-lg w-full max-w-md p-8 shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>
                 <button onClick={onClose} className="absolute top-4 right-4 text-medium-gray hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-center font-orbitron text-xl font-bold mb-6">{title}</h2>
                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={onClose} className="bg-dark-tertiary text-light-gray px-8 py-2 rounded-md hover:bg-medium-gray transition-colors">Hayır, İptal</button>
                    <button onClick={handleConfirm} className="bg-red-600 text-white font-bold px-8 py-2 rounded-md hover:bg-red-700 transition-colors">Evet, Onayla</button>
                </div>
            </div>
        </div>
    );
};
