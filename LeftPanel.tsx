import React, { useState, useRef, useEffect } from 'react';
import type { Server, Channel } from '../types';
import { HashtagIcon, PlusIcon, SettingsIcon, ChevronDownIcon } from './icons/IconComponents';

interface LeftPanelProps {
  userServers: Server[];
  selectedServer: Server | null;
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  onSelectServer: (serverId: string) => void;
  onCreateChannel: () => void;
  onOpenSettings: () => void;
  onOpenAddServerModal: () => void;
}

const ServerIcon: React.FC<{ server: Server, isSelected: boolean, onSelect: () => void }> = ({ server, isSelected, onSelect }) => (
    <div className="relative group mb-2" onClick={onSelect}>
        <div className={`
            w-14 h-14 rounded-3xl bg-dark-tertiary flex items-center justify-center 
            cursor-pointer transition-all duration-200 ease-in-out
            group-hover:rounded-2xl
            ${isSelected ? 'rounded-2xl ring-4 ring-white' : 'group-hover:bg-neon-cyan'}
        `}>
            <img src={server.imageUrl} alt={server.name} className="w-full h-full object-cover rounded-inherit" />
        </div>
        <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-dark-primary text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
            {server.name}
        </span>
    </div>
);


const ServerHeader: React.FC<{server: Server, onOpenSettings: () => void}> = ({ server, onOpenSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-4 border-b border-dark-tertiary cursor-pointer hover:bg-dark-tertiary/50">
                <h2 className="font-orbitron text-xl font-bold truncate">{server.name}</h2>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-dark-primary shadow-2xl rounded-b-lg z-10 p-2">
                    <button onClick={() => { onOpenSettings(); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-dark-tertiary transition-colors">
                        <SettingsIcon className="w-5 h-5 text-light-gray" />
                        Sunucu Ayarları
                    </button>
                </div>
            )}
        </div>
    );
};

const ChannelList: React.FC<{
    channels: Channel[];
    selectedChannelId: string | null;
    onSelectChannel: (id: string) => void;
    onCreateChannel: () => void;
}> = ({ channels, selectedChannelId, onSelectChannel, onCreateChannel}) => (
    <div className="flex-1 overflow-y-auto p-3">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-light-gray text-sm font-bold tracking-wider uppercase">Kanallar</h3>
           <button onClick={onCreateChannel} className="text-medium-gray hover:text-light-gray">
              <PlusIcon className="w-5 h-5"/>
           </button>
        </div>
        {channels.map(channel => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-dark-tertiary transition-colors duration-200 mb-1 ${selectedChannelId === channel.id ? 'bg-dark-tertiary/70' : ''}`}
          >
            <HashtagIcon className="w-5 h-5 text-medium-gray mr-2" />
            <span className="text-light-gray font-medium">{channel.name}</span>
          </div>
        ))}
    </div>
);


export const LeftPanel: React.FC<LeftPanelProps> = ({ userServers, selectedServer, selectedChannelId, onSelectChannel, onSelectServer, onCreateChannel, onOpenSettings, onOpenAddServerModal }) => {

  return (
    <div className="flex h-full">
      <div className="w-20 bg-dark-primary p-2 flex flex-col items-center border-r border-dark-tertiary">
        <div className="w-full flex-grow overflow-y-auto">
            {userServers.map(server => (
                <ServerIcon 
                    key={server.id}
                    server={server}
                    isSelected={selectedServer?.id === server.id}
                    onSelect={() => onSelectServer(server.id)}
                />
            ))}
        </div>
        <div className="mt-2">
           <div className="relative group mb-2" onClick={onOpenAddServerModal}>
                <div className={`
                    w-14 h-14 rounded-3xl bg-dark-tertiary flex items-center justify-center 
                    cursor-pointer transition-all duration-200 ease-in-out group-hover:rounded-2xl group-hover:bg-neon-lime
                `}>
                    <PlusIcon className="w-7 h-7 text-neon-lime group-hover:text-dark-primary" />
                </div>
                 <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-dark-primary text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                    Sunucu Ekle
                </span>
            </div>
        </div>
      </div>

      {selectedServer && (
          <div className="w-64 bg-dark-secondary flex flex-col">
            <ServerHeader server={selectedServer} onOpenSettings={onOpenSettings} />
            <ChannelList 
                channels={selectedServer.channels} 
                selectedChannelId={selectedChannelId} 
                onSelectChannel={onSelectChannel} 
                onCreateChannel={onCreateChannel}
            />
          </div>
      )}
    </div>
  );
};