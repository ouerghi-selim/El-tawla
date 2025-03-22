import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

const RatingInput = ({
  initialValue = 0,
  maxRating = 5,
  size = 30,
  activeColor = '#FFC107',
  inactiveColor = '#e0e0e0',
  onChange,
  readOnly = false,
  showLabel = true,
  labelStyle,
  style,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [rating, setRating] = useState(initialValue);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    setRating(initialValue);
  }, [initialValue]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();
  }, [rating]);

  const handlePress = (selectedRating) => {
    if (readOnly) return;
    
    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
    
    // Reset animation and start again
    animation.setValue(0);
  };

  const getRatingLabel = () => {
    if (rating === 0) return t('common.notRated');
    if (rating === 1) return t('ratings.poor');
    if (rating === 2) return t('ratings.fair');
    if (rating === 3) return t('ratings.good');
    if (rating === 4) return t('ratings.veryGood');
    if (rating === 5) return t('ratings.excellent');
    return '';
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const filled = i <= rating;
      
      // Calculate scale animation for the current star
      const scale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, filled && i === rating ? 1.5 : 1, 1],
      });
      
      stars.push(
        <Pressable
          key={i}
          onPress={() => handlePress(i)}
          style={styles.starContainer}
          disabled={readOnly}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? activeColor : inactiveColor}
            />
          </Animated.View>
        </Pressable>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.starsContainer, isRTL && styles.starsContainerRTL]}>
        {renderStars()}
      </View>
      {showLabel && (
        <Text style={[styles.ratingLabel, labelStyle]}>
          {getRatingLabel()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainerRTL: {
    flexDirection: 'row-reverse',
  },
  starContainer: {
    padding: 2,
  },
  ratingLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default RatingInput;
