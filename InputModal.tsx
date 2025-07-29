import React, { useState } from 'react';
import { CloseIcon } from './icons/IconComponents';

interface InputModalProps {
    title: string;
    onClose: () => void;
    onConfirm: (value: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({ title, onClose, onConfirm }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onConfirm(value.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-dark-secondary rounded-lg w-full max-w-md p-8 shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-medium-gray hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-center font-orbitron text-2xl font-bold mb-4">{title}</h2>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-dark-primary p-3 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan text-white"
                        autoFocus
                        required
                    />
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="text-sm text-light-gray hover:underline px-6 py-2">İptal</button>
                        <button type="submit" className="bg-neon-lime text-dark-primary font-bold px-6 py-2 rounded-md hover:shadow-neon-lime transition-all">Onayla</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
