import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButton = ({
  icon = 'add',
  size = 56,
  color = '#E3735E',
  actions = [],
  onPress,
  position = { bottom: 20, right: 20 },
  shadow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [backgroundOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(backgroundOpacity, {
      toValue: isOpen ? 0.5 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const toggleMenu = () => {
    if (actions.length === 0 && onPress) {
      onPress();
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleActionPress = (action) => {
    action.onPress();
    setIsOpen(false);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {isOpen && (
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backgroundOpacity },
          ]}
          onTouchEnd={() => setIsOpen(false)}
        />
      )}
      <View style={[styles.container, position]}>
        {isOpen &&
          actions.map((action, index) => {
            const translateY = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10 - (index + 1) * 60],
            });

            const scale = animation.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [0, 0.8, 1],
            });

            const opacity = animation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.5, 1],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.actionButton,
                  {
                    transform: [{ translateY }, { scale }],
                    opacity,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.actionButtonInner,
                    { backgroundColor: action.color || '#E3735E' },
                    shadow && styles.shadow,
                  ]}
                  onPress={() => handleActionPress(action)}
                >
                  <Ionicons name={action.icon} size={20} color="#fff" />
                </Pressable>
                {action.label && (
                  <View style={styles.actionLabel}>
                    <Text style={styles.actionLabelText}>{action.label}</Text>
                  </View>
                )}
              </Animated.View>
            );
          })}

        <Animated.View
          style={[
            styles.button,
            { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
            shadow && styles.shadow,
            { transform: [{ rotate: rotation }] },
          ]}
        >
          <Pressable style={styles.buttonInner} onPress={toggleMenu}>
            <Ionicons name={icon} size={24} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 998,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  actionButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    position: 'absolute',
    right: 55,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default FloatingActionButton;
