import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';
import AnimatedButton from './AnimatedButton';

const ReviewForm = ({
  onSubmit,
  initialRating = 0,
  initialComment = '',
  style,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        { opacity, transform: [{ translateY }] }
      ]}
    >
      <Text style={styles.title}>{t('reviews.leaveReview')}</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.label}>{t('reviews.yourRating')}</Text>
        <View style={[styles.starsContainer, isRTL && styles.starsContainerRTL]}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              style={styles.starContainer}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={30}
                color={star <= rating ? '#FFC107' : '#e0e0e0'}
              />
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.commentContainer}>
        <Text style={styles.label}>{t('reviews.yourComment')}</Text>
        <TextInput
          style={[styles.commentInput, isRTL && styles.textRTL]}
          placeholder={t('reviews.commentPlaceholder')}
          placeholderTextColor="#999"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <AnimatedButton
        text={t('common.submit')}
        onPress={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        style={styles.submitButton}
        icon="paper-plane-outline"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainerRTL: {
    flexDirection: 'row-reverse',
  },
  starContainer: {
    marginRight: 4,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
  },
  textRTL: {
    textAlign: 'right',
  },
  submitButton: {
    marginTop: 8,
  },
});

export default ReviewForm;
