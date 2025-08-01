import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { addActivityLog } from '../utils/activityLog';

interface AuthResult {
  user: FirebaseUser;
  hasPin: boolean;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<FirebaseUser>;
  logIn: (email: string, password: string) => Promise<AuthResult>;
  logInWithGoogle: () => Promise<AuthResult>;
  logOut: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  hasSetupPin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSetupPin, setHasSetupPin] = useState(false);

  // Check if the current user has set up a PIN
  const checkPinSetup = async (user: FirebaseUser) => {
    try {
      const pinRef = ref(db, `users/${user.uid}/pin`);
      const snapshot = await get(pinRef);
      setHasSetupPin(snapshot.exists());
    } catch (error) {
      console.error('Error checking PIN setup:', error);
      setHasSetupPin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkPinSetup(user);
      } else {
        setHasSetupPin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up new user
  const signUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create initial user data
    await set(ref(db, `users/${user.uid}/storeInfo`), {
      name: 'My Store',
      address: '',
      phone: ''
    });
    
    // Log activity
    await addActivityLog(user.uid, 'Account created');
    
    return user;
  };

  // Log in existing user
  const logIn = async (email: string, password: string): Promise<AuthResult> => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await addActivityLog(user.uid, 'Logged in');
    const pinRef = ref(db, `users/${user.uid}/pin`);
    const snapshot = await get(pinRef);
    const hasPin = snapshot.exists();
    setHasSetupPin(hasPin);
    return { user, hasPin };
  };

  // Log in with Google
  const logInWithGoogle = async (): Promise<AuthResult> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);

    if (additionalInfo?.isNewUser) {
      // Create initial user data for new Google users
      await set(ref(db, `users/${result.user.uid}/storeInfo`), {
        name: 'My Store',
        address: '',
        phone: ''
      });
      await addActivityLog(result.user.uid, 'Account created with Google');
      setHasSetupPin(false);
      return { user: result.user, hasPin: false };
    } else {
      await addActivityLog(result.user.uid, 'Logged in with Google');
      const pinRef = ref(db, `users/${result.user.uid}/pin`);
      const snapshot = await get(pinRef);
      const hasPin = snapshot.exists();
      setHasSetupPin(hasPin);
      return { user: result.user, hasPin };
    }
  };

  // Log out user
  const logOut = async () => {
    if (currentUser) {
      await addActivityLog(currentUser.uid, 'Logged out');
    }
    return signOut(auth);
  };

  // Set up PIN for user
  const setupPin = async (pin: string) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    await set(ref(db, `users/${currentUser.uid}/pin`), pin);
    setHasSetupPin(true);
    await addActivityLog(currentUser.uid, 'PIN created');
  };

  // Verify user PIN
  const verifyPin = async (pin: string) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    const pinRef = ref(db, `users/${currentUser.uid}/pin`);
    const snapshot = await get(pinRef);
    
    if (snapshot.exists()) {
      const storedPin = snapshot.val();
      return storedPin === pin;
    }
    
    return false;
  };

  const value = {
    currentUser,
    loading,
    signUp,
    logIn,
    logInWithGoogle,
    logOut,
    setupPin,
    verifyPin,
    hasSetupPin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};