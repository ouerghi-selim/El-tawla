import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n/LanguageContext';

const Toast = ({ 
  visible, 
  message, 
  type = 'success', 
  duration = 3000, 
  onDismiss,
  icon
}) => {
  const { isRTL } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        dismissToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  // Determine icon based on type
  let iconName = icon;
  if (!iconName) {
    switch (type) {
      case 'success':
        iconName = 'checkmark-circle';
        break;
      case 'error':
        iconName = 'alert-circle';
        break;
      case 'warning':
        iconName = 'warning';
        break;
      case 'info':
        iconName = 'information-circle';
        break;
      default:
        iconName = 'checkmark-circle';
    }
  }

  // Determine background color based on type
  let backgroundColor;
  let iconColor;
  switch (type) {
    case 'success':
      backgroundColor = '#4CAF50';
      iconColor = '#fff';
      break;
    case 'error':
      backgroundColor = '#F44336';
      iconColor = '#fff';
      break;
    case 'warning':
      backgroundColor = '#FFC107';
      iconColor = '#333';
      break;
    case 'info':
      backgroundColor = '#2196F3';
      iconColor = '#fff';
      break;
    default:
      backgroundColor = '#4CAF50';
      iconColor = '#fff';
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY }],
          backgroundColor
        }
      ]}
    >
      <TouchableWithoutFeedback onPress={dismissToast}>
        <View style={[styles.content, isRTL && styles.contentRTL]}>
          <Ionicons name={iconName} size={24} color={iconColor} style={styles.icon} />
          <Text style={styles.message}>{message}</Text>
          <Ionicons name="close" size={20} color={iconColor} style={styles.closeIcon} />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  closeIcon: {
    marginLeft: 12,
  },
});

export default Toast;
