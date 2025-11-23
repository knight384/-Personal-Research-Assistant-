import { User } from '../types';

// Mock Auth Service mimicking a backend
const STORAGE_KEY_USERS = 'lumina_users';
const STORAGE_KEY_SESSION = 'lumina_session';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const sessionUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password // In a real app, this would be hashed!
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    return session ? JSON.parse(session) : null;
  }
};