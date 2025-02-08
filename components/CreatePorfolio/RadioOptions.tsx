import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useTheme } from "../../context/ThemeProvider";
import { CustomText } from "../Themed";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const RadioOptions: React.FC<RadioButtonGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
}) => {
  const { color, isDarkMode } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        padding: 10,
        backgroundColor: isDarkMode
          ? "rgba(0,0,0,0.6)"
          : "rgba(255,255,255,0.4)",
        borderRadius: 2.5,
      }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onValueChange(option.value)}
          style={styles.radioButton}
        >
          <View
            style={[
              styles.radioButtonCircle,
              {
                backgroundColor:
                  selectedValue === option.value ? "gray" : "#E6E6E6",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              },
            ]}
          >
            {selectedValue === option.value && (
              <View
                style={[
                  styles.radioButtonInnerCircle,
                  { backgroundColor: Colors[color].primaryFaded },
                ]}
              />
            )}
          </View>
          <CustomText style={styles.radioButtonLabel}>
            {option.label}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButtonCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(191, 255, 141, 1)",
  },
  radioButtonLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});
export default RadioOptions;
