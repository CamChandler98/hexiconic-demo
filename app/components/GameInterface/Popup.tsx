import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type PopupMessageProps = {
  message: string;
  onComplete: () => void;
};

const PopupMessage = ({ message, onComplete }: PopupMessageProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  useEffect(() => {
    // Sequence: Fade In -> Wait -> Fade Out
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000), // How long the message stays visible
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete(); // Clean up state after animation finishes
    });
  }, []);

  return (
    <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
      <Text style={styles.popupText}>{message}</Text>
    </Animated.View>
  );
};

type PopupContainerProps = {
    message: string;
    onComplete: () => void;
    // Note: Do not include 'key' in the type definition here
}

export const PopupContainer = ({ message, onComplete } : PopupContainerProps) => {
    return ( // <--- 1. Added explicit return
        <View style={styles.popupOverlay} pointerEvents="none">
           <PopupMessage 
             // key is not needed here; React handles keys at the parent level
             message={message} 
             onComplete={onComplete} // <--- 2. Pass the prop through, don't call setFeedback directly
           />
        </View>
    );
}
const styles = StyleSheet.create({
  popupOverlay: {
    position: 'absolute',
    top: '10%', // Adjust this % to move the popup up/down
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999, // Ensure it sits on top of everything
    elevation: 5, // Android shadow/layering
  },
  popupContainer: {
    backgroundColor: '#333333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});