import React, { useState } from 'react';
import type { Server, Role, ServerMember } from '../types';
import { CloseIcon, PlusIcon, CopyIcon, CheckIcon, RocketIcon } from './icons/IconComponents';

interface ServerSettingsModalProps {
    server: Server;
    onClose: () => void;
    onUpdate: (server: Server) => void;
    onOpenInputModal: (title: string, onConfirm: (value: string) => void) => void;
    onOpenConfirmationModal: (title: string, onConfirm: () => void) => void;
}

type ActiveTab = 'overview' | 'roles' | 'members' | 'invites';

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({ server, onClose, onUpdate, onOpenInputModal, onOpenConfirmationModal }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [editedServer, setEditedServer] = useState<Server>(server);
    const [invites, setInvites] = useState<string[]>([]);
    const [copiedInvite, setCopiedInvite] = useState<string | null>(null);

    const handleSave = () => {
        onUpdate(editedServer);
        onClose();
    };

    const handleServerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedServer(prev => ({...prev, name: e.target.value}));
    };

    const handleAddRole = () => {
       onOpenInputModal("Yeni Rol Adı", (name) => {
            const newRole: Role = {
                id: `role-${Date.now()}`,
                name,
                color: 'bg-gray-400',
                icon: '▫️',
                permissions: [],
            };
            setEditedServer(prev => ({
                ...prev,
                roles: [...prev.roles, newRole],
            }));
       });
    };
    
    const handleKickMember = (memberId: string) => {
        onOpenConfirmationModal("Bu üyeyi sunucudan atmak istediğinize emin misiniz?", () => {
             setEditedServer(prev => ({
                ...prev,
                members: prev.members.filter(m => m.user.id !== memberId)
            }));
        });
    }

    const handleAssignRole = (memberId: string, roleId: string) => {
        setEditedServer(prev => ({
            ...prev,
            members: prev.members.map(member => {
                if (member.user.id === memberId) {
                    const hasRole = member.roles.some(r => r.id === roleId);
                    if (hasRole) {
                         return {...member, roles: member.roles.filter(r => r.id !== roleId)};
                    } else {
                        const roleToAdd = prev.roles.find(r => r.id === roleId);
                        return roleToAdd ? {...member, roles: [...member.roles, roleToAdd]} : member;
                    }
                }
                return member;
            })
        }));
    };

    const handleCreateInvite = () => {
        const inviteLink = `${window.location.origin}${window.location.pathname}#invite=${editedServer.inviteCode}`;
        setInvites(prev => [...prev, inviteLink]);
    };
    
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedInvite(url);
        setTimeout(() => setCopiedInvite(null), 2000);
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Sunucu Genel Bakış</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-light-gray mb-1">Sunucu Adı</label>
                                <input 
                                    type="text"
                                    value={editedServer.name}
                                    onChange={handleServerNameChange}
                                    className="w-full bg-dark-primary p-2 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-gray mb-1">Sunucu İkonu</label>
                                 <div className="flex items-center gap-4">
                                    <img src={editedServer.imageUrl} alt="server icon" className="w-20 h-20 rounded-full object-cover"/>
                                    <button className="bg-dark-tertiary px-4 py-2 rounded-md text-sm hover:bg-medium-gray">Resim Yükle</button>
                                 </div>
                            </div>
                        </div>
                    </div>
                );
            case 'roles':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Rolleri Yönet</h3>
                             <button onClick={handleAddRole} className="flex items-center gap-2 bg-neon-cyan text-dark-primary px-3 py-1 rounded-md text-sm font-bold">
                                <PlusIcon className="w-5 h-5" /> Yeni Rol
                            </button>
                        </div>
                        <div className="space-y-2">
                            {editedServer.roles.map(role => (
                                <div key={role.id} className="flex items-center p-2 bg-dark-primary rounded-md">
                                    <span className={`${role.color} w-4 h-4 rounded-full mr-3`}></span>
                                    <span className="font-semibold">{role.icon} {role.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
             case 'members':
                 return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Üyeler ({editedServer.members.length})</h3>
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                            {editedServer.members.map(member => (
                                <div key={member.user.id} className="flex items-center justify-between p-2 bg-dark-primary rounded-md">
                                    <div className="flex items-center">
                                        <img src={member.user.avatarUrl} alt={member.user.name} className="w-10 h-10 rounded-full mr-3"/>
                                        <div>
                                            <p className="font-semibold">{member.user.name}</p>
                                            <div className="flex gap-1 mt-1">
                                                {member.roles.map(r => <span key={r.id} title={r.name} className={`h-4 w-4 flex items-center justify-center text-xs rounded-full ${r.color}`}>{r.icon}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <div className="relative group">
                                            <button className="bg-dark-tertiary px-3 py-1 text-sm rounded-md">Rol Ata</button>
                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-dark-tertiary p-2 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                                                {editedServer.roles.map(role => (
                                                    <div key={role.id} onClick={() => handleAssignRole(member.user.id, role.id)} className="flex items-center gap-2 p-1 hover:bg-dark-secondary rounded cursor-pointer">
                                                        <input type="checkbox" readOnly checked={member.roles.some(r => r.id === role.id)} className="form-checkbox bg-dark-primary border-medium-gray"/>
                                                        <span>{role.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                       </div>
                                        <button onClick={() => handleKickMember(member.user.id)} className="bg-red-600/50 hover:bg-red-600 px-3 py-1 text-sm rounded-md">At</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 );
            case 'invites':
                return (
                     <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Davetler</h3>
                             <button onClick={handleCreateInvite} className="flex items-center gap-2 bg-neon-cyan text-dark-primary px-3 py-1 rounded-md text-sm font-bold">
                                <RocketIcon className="w-5 h-5" /> Yeni Davet Oluştur
                            </button>
                        </div>
                        <p className="text-sm text-medium-gray mb-4">Arkadaşlarınızı sunucunuza davet etmek için bir davet bağlantısı oluşturun.</p>
                        <div className="space-y-2">
                            {invites.map((invite, index) => (
                                 <div key={index} className="bg-dark-tertiary p-2 rounded-lg flex items-center justify-between text-sm">
                                   <p className="text-light-gray/90 truncate flex-1 mr-2 font-mono">
                                      {invite}
                                   </p>
                                   <button onClick={() => copyToClipboard(invite)} className="p-1.5 rounded-md hover:bg-dark-primary transition-colors">
                                       {copiedInvite === invite 
                                           ? <CheckIcon className="w-5 h-5 text-neon-lime" /> 
                                           : <CopyIcon className="w-5 h-5 text-light-gray" />
                                       }
                                   </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const TabButton: React.FC<{tabId: ActiveTab, children: React.ReactNode}> = ({tabId, children}) => (
        <button onClick={() => setActiveTab(tabId)} className={`w-full text-left p-2 rounded-md font-semibold ${activeTab === tabId ? 'bg-neon-cyan/20 text-neon-cyan' : 'hover:bg-dark-tertiary/50'}`}>
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-secondary rounded-lg w-full max-w-4xl h-full max-h-[700px] flex overflow-hidden shadow-2xl shadow-black">
                {/* Sidebar */}
                <div className="w-64 bg-dark-primary/50 p-4 flex flex-col">
                    <h2 className="font-orbitron text-lg font-bold mb-4 truncate">{editedServer.name} Ayarları</h2>
                    <div className="space-y-1">
                        <TabButton tabId="overview">Genel Bakış</TabButton>
                        <TabButton tabId="roles">Roller</TabButton>
                        <TabButton tabId="members">Üyeler</TabButton>
                        <TabButton tabId="invites">Davetler</TabButton>
                    </div>
                    <div className="mt-auto">
                        <button onClick={onClose} className="w-16 h-16 rounded-full border-2 border-medium-gray text-medium-gray flex items-center justify-center mx-auto hover:border-red-500 hover:text-red-500 transition-colors">
                            <CloseIcon className="w-8 h-8"/>
                        </button>
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {renderTabContent()}
                    </div>
                    <div className="mt-6 pt-4 border-t border-dark-tertiary flex justify-end gap-4">
                         <button onClick={onClose} className="bg-transparent text-light-gray px-6 py-2 rounded-md hover:bg-dark-tertiary">İptal</button>
                         <button onClick={handleSave} className="bg-neon-lime text-dark-primary font-bold px-6 py-2 rounded-md hover:shadow-neon-lime transition-all">Değişiklikleri Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    );
};