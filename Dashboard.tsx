import React, { useState, useMemo } from 'react';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { BottomBar } from './BottomBar';
import { ROLES, DEFAULT_SERVER_ICON } from '../constants';
import type { Server, User, Message, Role } from '../types';
import { VideoPreview } from './VideoPreview';
import { ServerSettingsModal } from './ServerSettingsModal';
import { AddServerModal } from './AddServerModal';
import { InputModal } from './InputModal';
import { ConfirmationModal } from './ConfirmationModal';

interface DashboardProps {
    currentUser: User;
    users: User[];
    servers: Server[];
    onLogout: () => void;
    setServers: React.Dispatch<React.SetStateAction<Server[]>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUser, servers, setServers, setCurrentUser, onLogout }) => {
    const [selectedServerId, setSelectedServerId] = useState<string | null>(currentUser.serverIds[0] || null);
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isAddServerModalOpen, setAddServerModalOpen] = useState(false);
    
    const [modalState, setModalState] = useState<{type: 'input' | 'confirmation' | null; title: string; onConfirm: (value?: any) => void;}>({type: null, title: '', onConfirm: () => {}});

    const userServers = useMemo(() => servers.filter(s => currentUser.serverIds.includes(s.id)), [servers, currentUser.serverIds]);
    const selectedServer = useMemo(() => servers.find(s => s.id === selectedServerId), [servers, selectedServerId]);
    const selectedChannel = selectedServer?.channels.find(c => c.id === selectedChannelId);

    const handleSelectServer = (serverId: string) => {
        setSelectedServerId(serverId);
        const server = servers.find(s => s.id === serverId);
        setSelectedChannelId(server?.channels[0]?.id || null);
    };

    const handleCreateServer = (name: string) => {
        const adminRole = ROLES.ADMIN;
        const newbieRole = ROLES.NEWBIE;
        const generateInviteCode = () => Math.random().toString(36).substring(2, 8);
        
        const newServer: Server = {
            id: `server-${Date.now()}`,
            inviteCode: generateInviteCode(),
            name,
            imageUrl: `${DEFAULT_SERVER_ICON}?random=${Date.now()}`,
            theme: 'cyan',
            roles: [adminRole, newbieRole],
            members: [{ user: currentUser, roles: [adminRole] }],
            channels: [{ id: `ch-${Date.now()}`, name: 'genel', messages: [] }],
        };
        setServers(prev => [...prev, newServer]);
        
        const updatedUser = { ...currentUser, serverIds: [...currentUser.serverIds, newServer.id] };
        setCurrentUser(updatedUser);
        
        setSelectedServerId(newServer.id);
        setSelectedChannelId(newServer.channels[0].id);
    };
    
    const handleJoinServer = (codeOrUrl: string) => {
        const trimmedCode = codeOrUrl.trim();
        const invitePart = trimmedCode.split('#invite=')[1];
        const code = invitePart ? invitePart.split('&')[0] : trimmedCode;

        if (code) {
             window.location.hash = `#invite=${code}`;
        }
    };

    const handleSelectChannel = (channelId: string) => {
        setSelectedChannelId(channelId);
    };
    
    const handleSetTheme = (newTheme: 'cyan' | 'magenta' | 'lime') => {
        if (!selectedServerId) return;
        setServers(prevServers => prevServers.map(s => s.id === selectedServerId ? { ...s, theme: newTheme } : s));
    };

    const handleCreateChannel = (name: string) => {
        if (!selectedServer) return;
        const newChannel = { id: `ch-${Date.now()}`, name, messages: [] };
        const updatedServer = { ...selectedServer, channels: [...selectedServer.channels, newChannel] };
        setServers(prev => prev.map(s => s.id === selectedServer.id ? updatedServer : s));
        setSelectedChannelId(newChannel.id);
    };
    
    const handleSendMessage = (channelId: string, content: string) => {
      if (!selectedServer) return;
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      const newChannels = selectedServer.channels.map(channel => {
          if (channel.id === channelId) {
              return { ...channel, messages: [...channel.messages, newMessage] };
          }
          return channel;
      });
      setServers(prev => prev.map(s => s.id === selectedServer.id ? { ...s, channels: newChannels } : s));

      setCurrentUser(prevUser => {
          if (!prevUser) return null;
          let newXp = prevUser.xp + 5;
          let newLevel = prevUser.level;
          let newXpToNextLevel = prevUser.xpToNextLevel;

          if (newXp >= newXpToNextLevel) {
              newLevel += 1;
              newXp -= newXpToNextLevel;
              newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
          }
          
          const newXpHistory = [
              { reason: 'Mesaj gönderdi', amount: 5, timestamp: 'şimdi' },
              ...prevUser.xpHistory
          ].slice(0, 5);

          return { ...prevUser, xp: newXp, level: newLevel, xpToNextLevel: newXpToNextLevel, xpHistory: newXpHistory };
      });
    };

    const handleToggleCamera = async () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraStream(stream);
            } catch (err) {
                console.error("Camera access denied:", err);
                alert("Kamera erişimi reddedildi. Lütfen tarayıcı ayarlarınızı kontrol edip SohbetEvreni'ne kamera izni verdiğinizden emin olun. Sayfayı yenilemeniz gerekebilir.");
            }
        }
    };
    
    const updateServer = (updatedServer: Server) => {
        setServers(prev => prev.map(s => s.id === updatedServer.id ? updatedServer : s));
    }

    const openInputModal = (title: string, onConfirm: (value: string) => void) => {
        setModalState({ type: 'input', title, onConfirm });
    };

    const openConfirmationModal = (title: string, onConfirm: () => void) => {
        setModalState({ type: 'confirmation', title, onConfirm });
    };

    const closeModal = () => {
        setModalState({ type: null, title: '', onConfirm: () => {} });
    };

    return (
        <div className={`theme-${selectedServer?.theme || 'cyan'} h-screen w-full flex flex-col bg-dark-primary font-sans`}>
            {isSettingsModalOpen && selectedServer &&
                <ServerSettingsModal 
                    server={selectedServer} 
                    onClose={() => setSettingsModalOpen(false)}
                    onUpdate={updateServer}
                    onOpenInputModal={openInputModal}
                    onOpenConfirmationModal={openConfirmationModal}
                />
            }
             {isAddServerModalOpen && (
                <AddServerModal 
                    onClose={() => setAddServerModalOpen(false)}
                    onCreateServer={handleCreateServer}
                    onJoinServer={handleJoinServer}
                />
            )}
            {modalState.type === 'input' && (
                <InputModal 
                    title={modalState.title}
                    onClose={closeModal}
                    onConfirm={modalState.onConfirm}
                />
            )}
            {modalState.type === 'confirmation' && (
                <ConfirmationModal 
                    title={modalState.title}
                    onClose={closeModal}
                    onConfirm={modalState.onConfirm}
                />
            )}
            <div className="flex flex-1 overflow-hidden">
                <LeftPanel
                  userServers={userServers}
                  selectedServer={selectedServer}
                  selectedChannelId={selectedChannelId}
                  onSelectChannel={handleSelectChannel}
                  onSelectServer={handleSelectServer}
                  onCreateChannel={() => openInputModal("Yeni Kanal Adı", handleCreateChannel)}
                  onOpenSettings={() => setSettingsModalOpen(true)}
                  onOpenAddServerModal={() => setAddServerModalOpen(true)}
                />
                <div className="flex flex-col flex-1 bg-dark-secondary">
                    <CenterPanel
                      server={selectedServer}
                      channel={selectedChannel}
                      currentUser={currentUser}
                      setTheme={handleSetTheme}
                      onSendMessage={handleSendMessage}
                    />
                </div>
                <RightPanel user={currentUser} server={selectedServer} onLogout={onLogout} />
            </div>
            {cameraStream && <VideoPreview stream={cameraStream} />}
            <BottomBar 
                isCameraOn={!!cameraStream}
                onToggleCamera={handleToggleCamera}
                isScreenSharing={isScreenSharing}
                onToggleScreenSharing={() => setIsScreenSharing(p => !p)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(p => !p)}
            />
        </div>
    );
};