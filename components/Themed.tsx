/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React from "react";
import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";

import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";

import Colors from "../constants/Colors";
import { useTheme } from "../context/ThemeProvider";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};
interface TextProps {
  children: React.ReactNode;
  style?: any; // Use 'any' type for style prop
  variant?: "light" | "regular" | "semibold";
  lightColor?: string;
  darkColor?: string;
  inverse?: boolean;
}

interface CustomInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  style?: any;
  focus?: boolean;
  others?: any;
  cap?: boolean;
  type?: string;
}
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, children, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: "rgba(255,255,255,0.8)", dark: "rgba(0,0,0,0.9)" },
    "background"
  );

  return (
    <DefaultView
      style={[
        {
          backgroundColor,
          padding: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </DefaultView>
  );
}
export function CustomText(props: TextProps) {
  const {
    children,
    style,
    variant = "regular",
    lightColor,
    darkColor,
    inverse,
  } = props;

  const [fontsLoaded] = useFonts({
    light: OpenSans_300Light,
    regular: OpenSans_400Regular,
    semibold: OpenSans_600SemiBold,
  });
  const theme = useColorScheme();
  const color = useThemeColor(
    {
      light: theme == "light" ? (!inverse ? "#334155" : "#e2e8f0") : "#334155",
      dark: theme == "dark" ? (!inverse ? "#e2e8f0" : "black") : "#e2e8f0",
    },
    "text"
  );

  const textStyle = [
    styles.text,
    styles[variant], // Apply the selected variant's style
    { color }, // Apply theme-based text color
    style,
  ];

  return <DefaultText style={textStyle}>{children}</DefaultText>;
}

export function CustomButton({
  text,
  onPress,
  inverse,
  style,
  variant,
  disabled,
  icon, // Add the icon prop
  position = "start", // Add the position prop with a default value
}: {
  text?: string;
  onPress?: () => void;
  style?: any;
  inverse?: boolean;
  variant?: string;
  disabled?: boolean;
  icon?: React.ReactNode; // Define the icon prop as a ReactNode
  position?: "start" | "end"; // Define the position prop with "start" or "end"
}) {
  const { isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, style, icon && { gap: 20 }]}
      onPress={disabled ? undefined : onPress}
    >
      {position === "start" && icon && icon}
      <CustomText inverse={inverse} variant={"regular"}>
        {text}
      </CustomText>
      {position === "end" && icon && icon}
    </TouchableOpacity>
  );
}
export const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  cap = "sentences", // Default to a valid autoCapitalize value
  style,
  focus,
  others,
  type,
}) => {
  const { isDarkMode, colorScheme } = useTheme();
  const color = colorScheme as keyof typeof Colors;

  return (
    <TextInput
      {...others}
      autoFocus={focus}
      autoCapitalize={cap}
      textContentType={type}
      style={[
        styles.input,
        {
          backgroundColor: isDarkMode
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.4)",
          color: Colors[color].text,
        },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={
        !isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"
      }
      cursorColor={Colors[color].primary}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "regular", // Default to regular variant
  },
  light: {
    fontFamily: "light",
  },
  regular: {
    fontFamily: "regular",
  },
  semibold: {
    fontFamily: "semibold",
  },

  button: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
});
