import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class AnimatedButton extends React.Component {
  constructor(props) {
    super(props);
    this.scaleValue = new Animated.Value(1);
    this.opacityValue = new Animated.Value(1);
  }

  handlePressIn = () => {
    Animated.parallel([
      Animated.timing(this.scaleValue, {
        toValue: 0.95,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(this.opacityValue, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  handlePressOut = () => {
    Animated.parallel([
      Animated.timing(this.scaleValue, {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(this.opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  render() {
    const { 
      onPress, 
      text, 
      style, 
      textStyle, 
      icon, 
      iconPosition = 'left',
      iconSize = 20,
      iconColor = '#fff',
      disabled = false
    } = this.props;

    const animatedStyle = {
      transform: [{ scale: this.scaleValue }],
      opacity: disabled ? 0.6 : this.opacityValue,
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={disabled ? null : onPress}
        onPressIn={disabled ? null : this.handlePressIn}
        onPressOut={disabled ? null : this.handlePressOut}
        style={[styles.container, disabled && styles.disabled, style]}
      >
        <Animated.View style={[styles.buttonContent, animatedStyle, iconPosition === 'right' && styles.reverseContent]}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.leftIcon} />
          )}
          <Text style={[styles.text, textStyle]}>{text}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.rightIcon} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E3735E',
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reverseContent: {
    flexDirection: 'row-reverse',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default AnimatedButton;
