import React, { useMemo } from 'react';
import type { User, Server, ServerMember, Role, XpEvent } from '../types';
import { TrendingUpIcon, LogoutIcon } from './icons/IconComponents';

interface RightPanelProps {
  user: User;
  server: Server | null;
  onLogout: () => void;
}

const RoleBadge: React.FC<{ role: Role }> = ({ role }) => (
    <span title={role.name} className={`h-5 w-5 flex items-center justify-center rounded-full text-sm text-white ${role.color}`}>
        {role.icon}
    </span>
);

const XpHistory: React.FC<{events: XpEvent[]}> = ({ events }) => (
    <div className="mt-4">
        <h4 className="flex items-center text-xs text-medium-gray uppercase font-bold tracking-wider mb-2">
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            XP Akışı
        </h4>
        <div className="space-y-1 text-sm">
            {events.map((event, index) => (
                <div key={index} className="flex justify-between items-center text-light-gray/80">
                    <span>{event.reason}</span>
                    <span className="font-bold text-neon-lime/80">+{event.amount} XP</span>
                </div>
            ))}
        </div>
    </div>
);

const UserProfile: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="p-4 bg-dark-tertiary rounded-lg">
    <div className="text-center">
        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-neon-cyan shadow-neon-cyan" />
        <div className="flex items-center justify-center gap-3">
            <h3 className="font-orbitron text-2xl font-bold">{user.name}</h3>
            <button onClick={onLogout} title="Çıkış Yap" className="text-light-gray hover:text-red-500 transition-colors">
                <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
        <p className="text-sm text-neon-cyan/80 capitalize">{user.status}</p>
        <div className="flex justify-center gap-2 mt-2">
            {user.badges.map(badge => (
                <span key={badge.id} title={badge.description} className="text-2xl cursor-pointer">{badge.icon}</span>
            ))}
        </div>
    </div>
    <XpHistory events={user.xpHistory} />
  </div>
);

const MemberListItem: React.FC<{ member: ServerMember }> = ({ member }) => {
    const statusColor = member.user.status === 'online' ? 'bg-green-400' : member.user.status === 'idle' ? 'bg-yellow-400' : 'bg-gray-500';
    return (
        <div className="flex items-center p-2 rounded-md hover:bg-dark-tertiary/50 transition-colors duration-200">
            <div className="relative">
                <img src={member.user.avatarUrl} alt={member.user.name} className="w-10 h-10 rounded-full object-cover" />
                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${statusColor} border-2 border-dark-secondary`}></span>
            </div>
            <div className="ml-3 flex-1">
                <p className="font-semibold text-light-gray">{member.user.name}</p>
                <p className="text-xs text-medium-gray">Seviye {member.user.level}</p>
            </div>
            <div className="flex gap-1">
                {member.roles.map(role => <RoleBadge key={role.id} role={role} />)}
            </div>
        </div>
    );
};

const Leaderboard: React.FC<{ members: ServerMember[] }> = ({ members }) => {
    const sortedMembers = useMemo(() => 
        [...members].sort((a, b) => b.user.level - a.user.level || b.user.xp - a.user.xp).slice(0, 3), 
    [members]);

    return (
        <div className="mt-6">
            <h3 className="text-light-gray text-sm font-bold tracking-wider uppercase mb-2">🏆 Lider Tablosu</h3>
            <div className="space-y-2">
                {sortedMembers.map((member, index) => (
                    <div key={member.user.id} className="flex items-center bg-dark-tertiary/50 p-2 rounded-lg">
                        <span className="font-orbitron text-lg font-bold w-6">{index + 1}</span>
                        <img src={member.user.avatarUrl} alt={member.user.name} className="w-8 h-8 rounded-full mx-2"/>
                        <div className="flex-1">
                            <p className="font-semibold text-light-gray text-sm">{member.user.name}</p>
                            <p className="text-xs text-neon-cyan/70">Seviye {member.user.level} - {member.user.xp} XP</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const RightPanel: React.FC<RightPanelProps> = ({ user, server, onLogout }) => {
  return (
    <div className="w-80 bg-dark-secondary p-4 border-l border-dark-tertiary flex flex-col">
      <UserProfile user={user} onLogout={onLogout}/>
      
      {server && (
        <>
            <Leaderboard members={server.members} />
            <div className="mt-6 flex-1 flex flex-col overflow-hidden">
                <h3 className="text-light-gray text-sm font-bold tracking-wider uppercase mb-2">Üyeler ({server.members.length})</h3>
                <div className="flex-1 overflow-y-auto pr-1">
                {server.members.map(member => (
                    <MemberListItem key={member.user.id} member={member} />
                ))}
                </div>
            </div>
        </>
      )}
    </div>
  );
};