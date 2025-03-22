import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';
import RatingInput from '../../components/RatingInput';
import AnimatedButton from '../../components/AnimatedButton';
import Toast from '../../components/Toast';

const RestaurantReviewsTab = ({ restaurant, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Display only top 3 reviews initially
  const displayedReviews = showAllReviews 
    ? restaurant.reviews 
    : restaurant.reviews.slice(0, 3);

  const handleViewAllReviews = () => {
    if (restaurant.reviews.length > 3) {
      navigation.navigate('restaurant/reviews', { restaurantId: restaurant.id });
    }
  };

  const handleHelpful = (reviewId) => {
    // In a real app, this would call an API to mark the review as helpful
    setToast({
      visible: true,
      message: t('reviews.submitSuccess'),
      type: 'success'
    });
  };

  const renderReviewItem = (review, index) => {
    return (
      <View key={index} style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
          <View style={styles.reviewHeaderText}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <RatingInput initialValue={review.rating} readOnly={true} size={16} />
        </View>
        
        <Text style={styles.reviewComment}>{review.comment}</Text>
        
        {review.photos && review.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {review.photos.map((photo, photoIndex) => (
              <Image key={photoIndex} source={{ uri: photo }} style={styles.reviewPhoto} />
            ))}
          </ScrollView>
        )}
        
        <View style={styles.reviewActions}>
          <Pressable 
            style={styles.helpfulButton}
            onPress={() => handleHelpful(review.id)}
          >
            <Ionicons name="thumbs-up-outline" size={16} color="#666" />
            <Text style={styles.helpfulText}>
              {review.helpful} {t('reviews.helpful')}
            </Text>
          </Pressable>
        </View>
        
        {review.ownerReply && (
          <View style={styles.ownerReply}>
            <View style={styles.ownerReplyHeader}>
              <Ionicons name="restaurant" size={16} color="#E3735E" />
              <Text style={styles.ownerReplyTitle}>{t('reviews.ownerReply')}</Text>
            </View>
            <Text style={styles.ownerReplyText}>{review.ownerReply.text}</Text>
            <Text style={styles.ownerReplyDate}>{review.ownerReply.date}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Toast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onDismiss={() => setToast({ ...toast, visible: false })} 
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.ratingOverview}>
          <Text style={styles.averageRating}>{restaurant.rating}</Text>
          <RatingInput 
            initialValue={Math.round(restaurant.rating)} 
            readOnly={true} 
            size={24} 
          />
          <Text style={styles.totalReviews}>
            {restaurant.reviews.length} {t('reviews.totalReviews')}
          </Text>
        </View>
      </View>
      
      <AnimatedButton
        text={t('reviews.writeReview')}
        icon="create-outline"
        onPress={() => navigation.navigate('restaurant/reviews', { 
          restaurantId: restaurant.id,
          showReviewForm: true 
        })}
        style={styles.writeReviewButton}
      />
      
      <View style={styles.reviewsList}>
        {displayedReviews.map(renderReviewItem)}
        
        {restaurant.reviews.length > 3 && (
          <AnimatedButton
            text={t('reviews.allReviews')}
            icon="list-outline"
            onPress={handleViewAllReviews}
            style={styles.viewAllButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingOverview: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalReviews: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  writeReviewButton: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  reviewsList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  ratingContainer: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  photosContainer: {
    marginBottom: 10,
  },
  reviewPhoto: {
    width: 120,
    height: 80,
    borderRadius: 4,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  ownerReply: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  ownerReplyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerReplyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 6,
  },
  ownerReplyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 5,
  },
  ownerReplyDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 5,
  },
});

export default RestaurantReviewsTab;
