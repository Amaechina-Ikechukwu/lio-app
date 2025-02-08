import { SplashScreen, Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "../components/Themed";
import { AuthProvider, useAuth } from "./auth";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  useColorScheme,
} from "react-native";
import { AlertProvider } from "../context/AlertProvider";
import { ThemeProvider } from "../context/ThemeProvider";
import Colors from "../constants/Colors";
import React from "react";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
function Root() {
  const [isReady, setReady] = useState(false);
  const [auth, setAuth] = useState<string | null>(null);
  useEffect(() => {
    // Perform some sort of async data or asset fetching.
    setTimeout(() => {
      // When all loading is setup, unmount the splash screen component.
      SplashScreen.hideAsync();
      setReady(true);
    }, 2000);
  }, []);
  const [fontsLoaded, fontError] = useFonts({
    light: OpenSans_300Light,
    regular: OpenSans_400Regular,
    semibold: OpenSans_600SemiBold,
  });
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  useLayoutEffect(() => {
    // Fetch user UID from SecureStore here
    // useProtectedRoute();
    SecureStore.getItemAsync("userUID").then((uid) => {
      if (uid) {
        // console.log(UserID(uid));
        setAuth(uid);
      }
      // No need to setAuth(null) if uid is not available
    });
    setReady(true);
  }, []);
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  // Determine the status bar style based on the color scheme
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return (
      <>
        <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <ActivityIndicator />
      </>
    );
  }
  if (!isReady) {
    return (
      <>
        <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <ActivityIndicator />
      </>
    );
  }

  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <StatusBar
            backgroundColor={
              colorScheme === "dark"
                ? Colors.dark.background
                : Colors.light.background
            }
            barStyle={statusBarStyle}
          />
          <SafeAreaView />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(home)" />
            <Stack.Screen name="(auth)/sign-in" />
            <Stack.Screen name="createportfolio" />
          </Stack>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
export default Sentry.wrap(Root);