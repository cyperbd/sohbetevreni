import React, { useState } from 'react';
import { CloseIcon, PlusIcon, RocketIcon } from './icons/IconComponents';

interface AddServerModalProps {
    onClose: () => void;
    onCreateServer: (name: string) => void;
    onJoinServer: (code: string) => void;
}

export const AddServerModal: React.FC<AddServerModalProps> = ({ onClose, onCreateServer, onJoinServer }) => {
    const [view, setView] = useState<'main' | 'create' | 'join'>('main');
    const [serverName, setServerName] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (serverName.trim()) {
            onCreateServer(serverName.trim());
            onClose();
        }
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteCode.trim()) {
            onJoinServer(inviteCode.trim());
            onClose();
        }
    };

    const renderContent = () => {
        if (view === 'create') {
            return (
                <form onSubmit={handleCreate}>
                    <h2 className="text-center font-orbitron text-2xl font-bold mb-2">Sunucunu Oluştur</h2>
                    <p className="text-center text-medium-gray mb-6">Sunucuna bir isim vererek topluluğunu başlat.</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-light-gray mb-2">SUNUCU ADI</label>
                        <input
                            type="text"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            className="w-full bg-dark-primary p-2 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan"
                            placeholder="Siber Kafe"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <button type="button" onClick={() => setView('main')} className="text-sm text-light-gray hover:underline">Geri</button>
                        <button type="submit" className="bg-neon-lime text-dark-primary font-bold px-6 py-2 rounded-md hover:shadow-neon-lime transition-all">Oluştur</button>
                    </div>
                </form>
            );
        }

        if (view === 'join') {
            return (
                <form onSubmit={handleJoin}>
                    <h2 className="text-center font-orbitron text-2xl font-bold mb-2">Sunucuya Katıl</h2>
                    <p className="text-center text-medium-gray mb-6">Aşağıya bir davet kodu girerek bir sunucuya katıl.</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-light-gray mb-2">DAVET KODU</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="w-full bg-dark-primary p-2 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan"
                            placeholder="aB1c2D"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <button type="button" onClick={() => setView('main')} className="text-sm text-light-gray hover:underline">Geri</button>
                        <button type="submit" className="bg-neon-lime text-dark-primary font-bold px-6 py-2 rounded-md hover:shadow-neon-lime transition-all">Sunucuya Katıl</button>
                    </div>
                </form>
            );
        }

        return (
            <div>
                <h2 className="text-center font-orbitron text-3xl font-bold mb-4">Bir Sunucuya Başla</h2>
                <p className="text-center text-medium-gray mb-8">Eylemin bir davetle başlamış olabilir veya sen başlatabilirsin.</p>
                <div className="space-y-4">
                     <button onClick={() => setView('create')} className="w-full flex items-center gap-4 p-4 border border-dark-tertiary rounded-lg hover:bg-dark-tertiary transition-colors">
                        <PlusIcon className="w-8 h-8 text-neon-lime" />
                        <div>
                            <h3 className="font-bold text-lg text-left">Kendi Sunucunu Oluştur</h3>
                            <p className="text-sm text-medium-gray text-left">Yeni bir topluluk kur.</p>
                        </div>
                    </button>
                     <button onClick={() => setView('join')} className="w-full flex items-center gap-4 p-4 border border-dark-tertiary rounded-lg hover:bg-dark-tertiary transition-colors">
                        <RocketIcon className="w-8 h-8 text-neon-cyan" />
                        <div>
                            <h3 className="font-bold text-lg text-left">Bir Sunucuya Katıl</h3>
                            <p className="text-sm text-medium-gray text-left">Zaten bir davet kodun mu var?</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-dark-secondary rounded-lg w-full max-w-lg p-8 shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-medium-gray hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                {renderContent()}
            </div>
        </div>
    );
};