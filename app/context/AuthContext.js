// AuthContext.js
import React, { createContext, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';

// Create the context
const AuthContext = createContext();

// Export a hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthContext provider component
export const AuthProvider = ({ children }) => {
  const { user } = useUser();

  // Prepare the value to be passed through the context
  const contextValue = {
    user: user ? {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
      // Add other user properties you need
    } : null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};