import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Entypo } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const CheckboxNew = ({ checked, onPress, color = '#2196F3', title, disabled }) => {
  // Add animation for smooth transitions
  const animatedValue = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', color]
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1]
  });

  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityState={{ checked, disabled }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.box,
          {
            borderColor: disabled ? '#E0E0E0' : (checked ? color : '#757575'),
            transform: [{ scale }],
            backgroundColor,
            opacity: disabled ? 0.5 : 1,
          }
        ]}
      >
        {checked && (
          <Animated.View style={{ opacity: animatedValue }}>
            <Entypo 
              name="check" 
              size={adjust(16)} 
              color="white"
              style={styles.checkIcon} 
            />
          </Animated.View>
        )}
      </Animated.View>
      {title && (
        <Text 
          style={[
            styles.title,
            { color: disabled ? '#9E9E9E' : '#424242' }
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: adjust(5),
  },
  box: {
    width: adjust(24),
    height: adjust(24),
    borderWidth: 2,
    borderRadius: adjust(4),
    justifyContent: "center",
    alignItems: "center",
    marginRight: adjust(8),
  },
  checkIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  title: {
    fontSize: adjust(16),
    fontWeight: '500',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default CheckboxNew;