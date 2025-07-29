import React, { useState } from 'react';
import type { User } from '../types';

interface AuthPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ users, onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      const user = users.find(u => u.name === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Geçersiz kullanıcı adı veya şifre.');
      }
    } else {
      if (users.some(u => u.name === username)) {
        setError('Bu kullanıcı adı zaten alınmış.');
        return;
      }
      if (password.length < 4) {
        setError('Şifre en az 4 karakter olmalıdır.');
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: username,
        password: password,
        avatarUrl: `https://picsum.photos/seed/${username}/100/100`,
        status: 'online',
        level: 1,
        xp: 0,
        xpToNextLevel: 50,
        xpHistory: [],
        badges: [],
        serverIds: [],
      };
      onRegister(newUser);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-dark-secondary p-4">
      <div className="w-full max-w-md bg-dark-primary rounded-2xl shadow-2xl shadow-neon-cyan/10 border border-dark-tertiary p-8">
        <h1 className="font-orbitron text-4xl font-bold text-center text-neon-cyan mb-2">SohbetEvreni</h1>
        <p className="text-center text-light-gray mb-8">Dijital Dünyanıza Giriş Yapın</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-light-gray text-sm font-bold mb-2" htmlFor="username">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark-secondary p-3 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-light-gray text-sm font-bold mb-2" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-secondary p-3 rounded-md border border-dark-tertiary focus:border-neon-cyan focus:ring-neon-cyan text-white"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-neon-cyan text-dark-primary font-bold py-3 px-8 rounded-lg hover:shadow-neon-cyan transition-all duration-300 transform hover:scale-105"
          >
            {isLoginView ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-medium-gray text-sm mt-6">
          {isLoginView ? "Hesabın yok mu?" : "Zaten bir hesabın var mı?"}
          <button onClick={() => { setIsLoginView(!isLoginView); setError('')}} className="ml-2 font-bold text-neon-cyan hover:underline">
            {isLoginView ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
