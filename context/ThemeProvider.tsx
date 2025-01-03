import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

type ColorScheme = "light" | "dark" | "no-preference";

interface ThemeContextType {
  colorScheme: ColorScheme;
  isDarkMode: boolean;
  color: keyof typeof Colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme() as ColorScheme;
  const isDarkMode = colorScheme === "dark";
  const color = colorScheme as keyof typeof Colors;

  return (
    <ThemeContext.Provider value={{ colorScheme, isDarkMode, color }}>
      {children}
    </ThemeContext.Provider>
  );
};
