import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet, Animated } from "react-native";
import { CustomText, useThemeColor } from "../components/Themed";
import { useTheme } from "./ThemeProvider";
import { ViewStyle } from "react-native";
import Colors from "../constants/Colors";

interface AlertContextType {
  showAlert: (message: string) => void;
  hideAlert: () => void;
  alert: string | null; // Use string type for alert
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<string | null>(null); // Use string type for currentAlert
  const [animation] = useState(new Animated.Value(0));

  const showAlert = (message: string) => {
    setCurrentAlert(message);
  };

  const hideAlert = () => {
    if (currentAlert) {
      setCurrentAlert(null);
    }
  };

  useEffect(() => {
    if (currentAlert) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => hideAlert(), 5000);
      });
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Animation finished, no need to do anything here
      });
    }
  }, [currentAlert, animation]);

  const alertStyle: Animated.WithAnimatedValue<ViewStyle> = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };
  const theme = useTheme();
  const themeKey = theme.colorScheme as keyof typeof Colors;
  // Get border color from theme
  return (
    <AlertContext.Provider
      value={{ showAlert, alert: currentAlert, hideAlert }}
    >
      {children}
      {currentAlert && (
        <Animated.View style={[styles.alertContainer, alertStyle]}>
          <View
            style={{
              width: "90%",
              backgroundColor: "rgba(191, 255 ,141, 1)",
              padding: 20,
              borderRadius: 5,
              borderWidth: 3,
              borderColor: Colors[themeKey].text,
            }}
          >
            <CustomText style={{ color: Colors.light.text }} variant="semibold">
              {currentAlert}
            </CustomText>
          </View>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    alignItems: "center",
  },
});
