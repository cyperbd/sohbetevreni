
import React, { useState, useEffect, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import type { User, Server } from './types';

const generateInviteCode = () => Math.random().toString(36).substring(2, 8);

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('users') || '[]'));
    const [servers, setServers] = useState<Server[]>(() => {
        const storedServers: Server[] = JSON.parse(localStorage.getItem('servers') || '[]');
        // Migration step for servers created before inviteCode existed
        return storedServers.map(server => {
            if (!server.inviteCode) {
                return { ...server, inviteCode: generateInviteCode() };
            }
            return server;
        });
    });
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUserId = localStorage.getItem('currentUserId');
        if (!storedUserId) return null;
        const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        return allUsers.find(u => u.id === storedUserId) || null;
    });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('servers', JSON.stringify(servers));
    }, [servers]);

    const handleJoinServerWithInvite = useCallback((inviteCode: string, userToJoin: User) => {
        const serverToJoin = servers.find(s => s.inviteCode === inviteCode);
        if (!serverToJoin) {
            alert("Geçersiz davet kodu!");
            return;
        }

        const isAlreadyMember = serverToJoin.members.some(m => m.user.id === userToJoin.id);
        if (isAlreadyMember) {
            alert("Bu sunucuya zaten üyesiniz.");
            return;
        }

        const newbieRole = serverToJoin.roles.find(r => r.id.includes('newbie'));
        const newMember = { user: userToJoin, roles: newbieRole ? [newbieRole] : [] };
        
        const updatedServer = {
            ...serverToJoin,
            members: [...serverToJoin.members, newMember]
        };

        const updatedUser = {
            ...userToJoin,
            serverIds: [...userToJoin.serverIds, serverToJoin.id]
        };
        
        setServers(prevServers => prevServers.map(s => s.id === updatedServer.id ? updatedServer : s));
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    }, [servers, users, currentUser]);


    const handleLogin = useCallback((user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUserId', user.id);

        const inviteCode = sessionStorage.getItem('pendingInviteCode');
        if (inviteCode) {
            handleJoinServerWithInvite(inviteCode, user);
            sessionStorage.removeItem('pendingInviteCode');
        }

    }, [handleJoinServerWithInvite]);

    const handleRegister = useCallback((newUser: User) => {
        setUsers(prev => [...prev, newUser]);
        handleLogin(newUser);
    }, [handleLogin]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUserId');
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#invite=')) {
                const code = hash.substring('#invite='.length);
                if (currentUser) {
                    handleJoinServerWithInvite(code, currentUser);
                } else {
                    sessionStorage.setItem('pendingInviteCode', code);
                    alert("Sunucuya katılmak için lütfen giriş yapın veya kayıt olun.");
                }
                 // Clear the hash to prevent re-joining on refresh and avoid security errors
                history.replaceState("", document.title, window.location.pathname + window.location.search);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on initial load

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [currentUser, handleJoinServerWithInvite]);


    if (!currentUser) {
        return <AuthPage users={users} onLogin={handleLogin} onRegister={handleRegister} />;
    }

    return (
        <Dashboard
            key={currentUser.id} // Re-mounts dashboard on user change
            currentUser={currentUser}
            users={users}
            servers={servers}
            onLogout={handleLogout}
            setServers={setServers}
            setUsers={setUsers}
            setCurrentUser={setCurrentUser}
        />
    );
};

export default App;