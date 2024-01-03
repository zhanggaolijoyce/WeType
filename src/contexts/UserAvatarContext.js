// 创建一个新文件 UserAvatarContext.js
import React, { useState, createContext, useContext } from 'react';

const UserAvatarContext = createContext();

export function UserAvatarProvider({ children }) {
  const [userAvatar, setUserAvatar] = useState(null);

  return (
    <UserAvatarContext.Provider value={{ userAvatar, setUserAvatar }}>
      {children}
    </UserAvatarContext.Provider>
  );
}

export function useUserAvatar() {
    const context = useContext(UserAvatarContext);
    if (context === undefined) {
      throw new Error('useUserAvatar must be used within a UserAvatarProvider');
    }
    return context;
  }