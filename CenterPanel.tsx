import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Server, Channel, Message, User, Role } from '../types';
import { UsersIcon, SearchIcon, PaletteIcon, HashtagIcon, PlusIcon, RocketIcon } from './icons/IconComponents';

interface CenterPanelProps {
  server: Server | null;
  channel: Channel | undefined;
  currentUser: User;
  setTheme: (theme: 'cyan' | 'magenta' | 'lime') => void;
  onSendMessage: (channelId: string, content: string) => void;
}

const ThemeSwitcher: React.FC<{ setTheme: (theme: any) => void }> = ({ setTheme }) => {
    return (
        <div className="relative group">
            <PaletteIcon className="w-6 h-6 text-light-gray hover:text-white transition-colors"/>
            <div className="absolute top-full right-0 mt-2 w-40 bg-dark-tertiary rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-2">
                <div onClick={() => setTheme('cyan')} className="flex items-center p-2 hover:bg-dark-secondary/50 rounded cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-neon-cyan mr-2"></div> Mavi Neon
                </div>
                <div onClick={() => setTheme('magenta')} className="flex items-center p-2 hover:bg-dark-secondary/50 rounded cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-neon-magenta mr-2"></div> Macenta Neon
                </div>
                <div onClick={() => setTheme('lime')} className="flex items-center p-2 hover:bg-dark-secondary/50 rounded cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-neon-lime mr-2"></div> Yeşil Neon
                </div>
            </div>
        </div>
    );
};

const ChatHeader: React.FC<{ channelName: string; setTheme: any; searchQuery: string; setSearchQuery: (q: string) => void; }> = ({ channelName, setTheme, searchQuery, setSearchQuery }) => (
    <div className="flex items-center justify-between p-4 border-b border-dark-tertiary shadow-lg">
        <div className="flex items-center">
            <HashtagIcon className="w-6 h-6 text-medium-gray" />
            <h2 className="ml-2 text-xl font-bold font-orbitron">{channelName}</h2>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Akıllı Arama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-dark-tertiary w-64 h-9 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medium-gray" />
            </div>
            <UsersIcon className="w-6 h-6 text-light-gray hover:text-white transition-colors cursor-pointer" />
            <ThemeSwitcher setTheme={setTheme} />
        </div>
    </div>
);

const RoleBadge: React.FC<{ role: Role }> = ({ role }) => (
    <span className={`px-2 py-0.5 text-xs font-bold rounded-full text-white ${role.color}`}>
        {role.icon} {role.name}
    </span>
);

const MessageBubble: React.FC<{ message: Message; isOwn: boolean; roles: Role[] }> = ({ message, isOwn, roles }) => (
    <div className={`flex items-start gap-3 my-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <img src={message.author.avatarUrl} alt={message.author.name} className="w-10 h-10 rounded-full object-cover" />
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
                {!isOwn && <span className="font-bold text-light-gray">{message.author.name}</span>}
                {!isOwn && roles.map(role => <RoleBadge key={role.id} role={role} />)}
                <span className="text-xs text-medium-gray">{message.timestamp}</span>
            </div>
            <div className={`p-3 rounded-xl max-w-md ${isOwn ? 'bg-dark-tertiary text-white' : 'bg-dark-primary text-light-gray'}`}>
                <p>{message.content}</p>
            </div>
        </div>
    </div>
);

const XpBar: React.FC<{ user: User }> = ({ user }) => {
    const progress = (user.xp / user.xpToNextLevel) * 100;
    return (
        <div className="px-4 pb-2">
            <div className="flex justify-between items-center text-xs font-bold text-light-gray mb-1">
                <span className="font-orbitron">Seviye {user.level}</span>
                <span>{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-dark-tertiary rounded-full h-2.5">
                <div className="bg-neon-cyan h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const MessageInput: React.FC<{ onSend: (content: string) => void }> = ({ onSend }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSend(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 mt-auto">
            <div className="bg-dark-tertiary rounded-lg p-2 flex items-center">
                <PlusIcon className="w-8 h-8 p-1 rounded-full text-light-gray hover:bg-dark-secondary cursor-pointer transition-colors"/>
                <input
                    type="text"
                    placeholder="Mesajını yaz..."
                    className="flex-1 bg-transparent px-4 text-light-gray placeholder-medium-gray focus:outline-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </form>
    );
};


export const CenterPanel: React.FC<CenterPanelProps> = ({ server, channel, currentUser, setTheme, onSendMessage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const filteredMessages = useMemo(() => 
        channel?.messages.filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase())) || [],
    [channel, searchQuery]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [filteredMessages]);

    if (!server || !channel) {
        return (
            <div className="flex-1 flex items-center justify-center bg-dark-secondary">
                <div className="text-center text-medium-gray max-w-sm">
                    <RocketIcon className="w-24 h-24 mx-auto text-neon-magenta/50" />
                    <h2 className="mt-4 text-2xl font-bold font-orbitron text-light-gray">SohbetEvreni'ne Hoş Geldin, {currentUser.name}!</h2>
                    <p className="mt-2">Başlamak için soldaki menüden bir sunucu seç veya yeni bir tane oluştur. Ardından sohbete başlamak için bir kanala tıkla.</p>
                </div>
            </div>
        );
    }
    
    const handleSend = (content: string) => {
      onSendMessage(channel.id, content);
    };

    return (
        <div className="flex flex-col h-full">
            <ChatHeader channelName={channel.name} setTheme={setTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <div className="flex-1 overflow-y-auto p-4">
                {filteredMessages.map(msg => {
                    const authorMember = server.members.find(m => m.user.id === msg.author.id);
                    return (
                        <MessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isOwn={msg.author.id === currentUser.id} 
                            roles={authorMember?.roles || []}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <XpBar user={currentUser} />
            <MessageInput onSend={handleSend} />
        </div>
    );
};