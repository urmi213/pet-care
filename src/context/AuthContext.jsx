// context/AuthContext.jsx - CORRECTED VERSION
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  auth,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  getGoogleRedirectResult,
  signOutUser,
  onAuthStateChangedListener
} from '../firebase/firebase.config';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Check for Google redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result?.user) {
          await handleFirebaseUser(result.user);
        }
      } catch (error) {
        console.log('No redirect result or error:', error.message);
      }
    };

    checkRedirectResult();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        handleFirebaseUser(firebaseUser);
      } else {
        // Check localStorage for regular user
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            localStorage.removeItem('userData');
          }
        } else {
          setUser(null);
        }
      }
      
      setFirebaseInitialized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFirebaseUser = async (firebaseUser) => {
    try {
      const googleUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        role: 'user',
        phone: firebaseUser.phoneNumber || '',
        address: '',
        bio: 'Signed in with Google',
        photoURL: firebaseUser.photoURL || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.email.split('@')[0])}&background=random`,
        googleUser: true,
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date().toISOString(),
        firebaseUser: true
      };

      localStorage.setItem('userData', JSON.stringify(googleUser));
      setUser(googleUser);
      return googleUser;
    } catch (error) {
      console.error('Error handling Firebase user:', error);
      return null;
    }
  };

  // Regular email/password sign in
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const mockUsers = [
        { email: 'demo@pawmart.com', password: 'Demo@123', name: 'Demo User', role: 'user' },
        { email: 'admin@pawmart.com', password: 'Admin@123', name: 'Admin User', role: 'admin' }
      ];
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userObj = {
        id: Date.now().toString(),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        googleUser: false,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('userData', JSON.stringify(userObj));
      setUser(userObj);
      
      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In - Try popup first, fallback to redirect
  const googleSignIn = async () => {
    setLoading(true);
    try {
      // Try popup first
      const result = await signInWithGooglePopup();
      if (result?.user) {
        await handleFirebaseUser(result.user);
        return { success: true };
      }
    } catch (popupError) {
      console.log('Popup failed, trying redirect:', popupError.message);
      
      // If popup fails, use redirect
      try {
        await signInWithGoogleRedirect();
        return { success: true, redirect: true };
      } catch (redirectError) {
        console.error('Redirect also failed:', redirectError);
        
        let errorMessage = 'Google sign in failed';
        if (redirectError.code === 'auth/popup-blocked') {
          errorMessage = 'Popup blocked. Please allow popups for this site.';
        } else if (redirectError.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign in cancelled.';
        }
        
        return { success: false, error: errorMessage };
      }
    } finally {
      setLoading(false);
    }
  };

  // Create user (registration)
  const createUser = async (email, password, userData) => {
    setLoading(true);
    try {
      const newUser = {
        id: `local_${Date.now().toString()}`,
        email: email,
        name: userData.name || email.split('@')[0],
        role: 'user',
        phone: userData.phone || '',
        address: userData.address || '',
        bio: userData.bio || '',
        password: password,
        googleUser: false,
        createdAt: new Date().toISOString()
      };

      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      if (user?.firebaseUser) {
        await signOutUser();
      }
      setUser(null);
      localStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('userData');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    loading,
    firebaseInitialized,
    signIn,
    googleSignIn,
    createUser,
    logOut,
    updateUser: (data) => {
      if (user) {
        const updatedUser = { ...user, ...data };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, error: 'No user found' };
    },
    hasRole: (role) => {
      return user?.role === role || user?.role === 'admin';
    },
    isAuthenticated: () => !!user
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;