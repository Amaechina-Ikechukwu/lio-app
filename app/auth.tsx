import { useRouter, useSegments, SplashScreen } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View } from "../components/Themed";
import GetUserID from "../apis/GetUserID";
import GetUserProfileInformation from "../apis/GetUserProfileInformation";
import { useLayoutEffect } from "react";

interface AuthContextType {
  signIn: (uid: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: string | null;
  userid: string | null;
  userinformation: any | null;
  getUserInformation: (uid: string | null) => Promise<void>;
}

SplashScreen.preventAutoHideAsync();
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

function useProtectedRoute(user: string | null): void {
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.push("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      router.push("/(home)");
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<string | null>(null);
  const [userid, setUserId] = useState<string | null>(null);
  const [userinformation, setUserInformation] = useState(null);
  const [isReady, setReady] = useState(false);
  const router = useRouter();
  const checkUser = async () => {
    SplashScreen.preventAutoHideAsync();
    await SecureStore.getItemAsync("userUID").then(async (uid) => {
      if (uid) {
        setUser(uid);
        setReady(true);
        await getUserid(uid);
        router.push("/(home)");
        SplashScreen.hideAsync();
      } else {
        router.push("/(auth)/sign-in");
        SplashScreen.hideAsync();
      }
    });
  };
  useLayoutEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    checkUser();
  }, [user]);

  const getUserid = async (uid: string) => {
    const useruid = await GetUserID(uid);
    setUserId(useruid);
    getUserInformation(uid);
  };
  const getUserInformation = async (uid: string | null) => {
    const { userprofile } = await GetUserProfileInformation(uid);
    setUserInformation(userprofile);
    if (userprofile.displayName == undefined) {
      router.push("/(profile)/editprofile");
    }
  };
  const signIn = async (uid: string): Promise<void> => {
    await SecureStore.setItemAsync("userUID", uid);
    setUser(uid);
  };

  const signOut = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userUID");
    setUser(null);
    setUserId(null);
    setUserInformation(null);
    router.push("/(auth)/sign-in");
  };

  // useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        userid,
        userinformation,
        getUserInformation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
