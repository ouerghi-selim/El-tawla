import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';
import RatingInput from '../../components/RatingInput';
import ReviewForm from '../../components/ReviewForm';
import Toast from '../../components/Toast';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import AnimatedButton from '../../components/AnimatedButton';

const ReviewsScreen = ({ restaurantId }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [filter, setFilter] = useState('all'); // 'all', 'positive', 'negative'
  const [sort, setSort] = useState('recent'); // 'recent', 'rating'

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be a Supabase query
      // For now, we'll simulate the data loading with a timeout
      setTimeout(() => {
        const mockReviews = [
          {
            id: 1,
            userId: 'user1',
            userName: 'Ahmed Ben Ali',
            userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 5,
            comment: 'Excellent restaurant avec une ambiance authentique. La nourriture était délicieuse et le service impeccable. Je recommande vivement le couscous royal et les briks à l\'œuf.',
            date: '2025-03-15',
            helpful: 12,
            photos: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'],
            ownerReply: {
              text: 'Merci beaucoup pour votre avis positif ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous. Au plaisir de vous revoir bientôt !',
              date: '2025-03-16'
            }
          },
          {
            id: 2,
            userId: 'user2',
            userName: 'Leila Trabelsi',
            userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 4,
            comment: 'Très bon restaurant, cuisine savoureuse et personnel attentionné. Seul bémol, l\'attente était un peu longue. Je reviendrai quand même !',
            date: '2025-03-10',
            helpful: 8,
            photos: [],
            ownerReply: null
          },
          {
            id: 3,
            userId: 'user3',
            userName: 'Karim Mejri',
            userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
            rating: 2,
            comment: 'Déçu par mon expérience. Le service était lent et la nourriture moyenne. Les prix sont trop élevés pour la qualité proposée.',
            date: '2025-03-05',
            helpful: 3,
            photos: [],
            ownerReply: {
              text: 'Nous sommes désolés de votre mauvaise expérience. Nous prenons votre feedback très au sérieux et allons travailler à améliorer nos services. Nous espérons que vous nous donnerez une seconde chance.',
              date: '2025-03-06'
            }
          },
          {
            id: 4,
            userId: 'user4',
            userName: 'Fatma Riahi',
            userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            rating: 5,
            comment: 'Une expérience culinaire exceptionnelle ! Les plats traditionnels tunisiens sont préparés avec soin et les saveurs sont authentiques. Le cadre est également très agréable.',
            date: '2025-02-28',
            helpful: 15,
            photos: ['https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop'],
            ownerReply: {
              text: 'Merci infiniment pour votre avis chaleureux ! Nous sommes heureux que vous ayez apprécié l\'authenticité de notre cuisine tunisienne. Nous espérons vous revoir bientôt !',
              date: '2025-03-01'
            }
          },
          {
            id: 5,
            userId: 'user5',
            userName: 'Mohamed Sassi',
            userAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            rating: 3,
            comment: 'Restaurant correct mais sans plus. Les plats manquent un peu de saveur et l\'ambiance pourrait être améliorée. Le service était toutefois rapide et efficace.',
            date: '2025-02-20',
            helpful: 5,
            photos: [],
            ownerReply: null
          }
        ];
        
        setReviews(mockReviews);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      // In a real implementation, this would be a Supabase insert
      // For now, we'll simulate the submission with a timeout
      return new Promise((resolve) => {
        setTimeout(() => {
          const newReview = {
            id: reviews.length + 1,
            userId: 'currentUser',
            userName: 'Vous',
            userAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
            rating: reviewData.rating,
            comment: reviewData.comment,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            photos: [],
            ownerReply: null
          };
          
          setReviews([newReview, ...reviews]);
          setShowReviewForm(false);
          setToast({
            visible: true,
            message: t('reviews.submitSuccess'),
            type: 'success'
          });
          
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({
        visible: true,
        message: t('reviews.submitError'),
        type: 'error'
      });
      throw error;
    }
  };

  const handleMarkHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Apply filter
    if (filter === 'positive') {
      filtered = filtered.filter(review => review.rating >= 4);
    } else if (filter === 'negative') {
      filtered = filtered.filter(review => review.rating <= 2);
    }
    
    // Apply sort
    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    
    return distribution.reverse(); // 5 stars first
  };

  const renderRatingDistribution = () => {
    const distribution = getRatingDistribution();
    const max = Math.max(...distribution);
    
    return (
      <View style={styles.distributionContainer}>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <View key={rating} style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>{rating} ★</Text>
            <View style={styles.distributionBarContainer}>
              <View 
                style={[
                  styles.distributionBar, 
                  { width: `${distribution[index] ? (distribution[index] / max) * 100 : 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.distributionCount}>{distribution[index]}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewItem = (review) => {
    return (
      <View key={review.id} style={styles.reviewItem}>
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
        
        {review.photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            {review.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
            ))}
          </ScrollView>
        )}
        
        <View style={styles.reviewActions}>
          <Pressable 
            style={styles.helpfulButton}
            onPress={() => handleMarkHelpful(review.id)}
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E3735E" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.summaryContainer}>
            <View style={styles.ratingOverview}>
              <Text style={styles.averageRating}>{getAverageRating()}</Text>
              <RatingInput 
                initialValue={Math.round(getAverageRating())} 
                readOnly={true} 
                size={24} 
              />
              <Text style={styles.totalReviews}>
                {reviews.length} {t('reviews.totalReviews')}
              </Text>
            </View>
            
            {renderRatingDistribution()}
          </View>
          
          {!showReviewForm ? (
            <AnimatedButton
              text={t('reviews.writeReview')}
              icon="create-outline"
              onPress={() => setShowReviewForm(true)}
              style={styles.writeReviewButton}
            />
          ) : (
            <ReviewForm 
              onSubmit={handleSubmitReview}
              style={styles.reviewForm}
            />
          )}
          
          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContent}
            >
              <Pressable
                style={[styles.filterChip, filter === 'all' && styles.activeFilterChip]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                  {t('reviews.allReviews')}
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.filterChip, filter === 'positive' && styles.activeFilterChip]}
                onPress={() => setFilter('positive')}
              >
                <Text style={[styles.filterText, filter === 'positive' && styles.activeFilterText]}>
                  {t('reviews.positiveReviews')}
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.filterChip, filter === 'negative' && styles.activeFilterChip]}
                onPress={() => setFilter('negative')}
              >
                <Text style={[styles.filterText, filter === 'negative' && styles.activeFilterText]}>
                  {t('reviews.negativeReviews')}
                </Text>
              </Pressable>
              
              <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>{t('reviews.sortBy')}:</Text>
                <Pressable
                  style={[styles.sortChip, sort === 'recent' && styles.activeSortChip]}
                  onPress={() => setSort('recent')}
                >
                  <Text style={[styles.sortText, sort === 'recent' && styles.activeSortText]}>
                    {t('reviews.mostRecent')}
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[styles.sortChip, sort === 'rating' && styles.activeSortChip]}
                  onPress={() => setSort('rating')}
                >
                  <Text style={[styles.sortText, sort === 'rating' && styles.activeSortText]}>
                    {t('reviews.highestRated')}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
          
          <View style={styles.reviewsList}>
            {getFilteredReviews().length === 0 ? (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#ccc" />
                <Text style={styles.noReviewsText}>
                  {t('reviews.noReviewsFound')}
                </Text>
              </View>
            ) : (
              getFilteredReviews().map(review => renderReviewItem(review))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    marginBottom: 20,
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
  distributionContainer: {
    marginTop: 10,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionLabel: {
    width: 40,
    fontSize: 14,
    color: '#666',
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 4,
  },
  distributionCount: {
    width: 30,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  writeReviewButton: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  reviewForm: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filtersScrollContent: {
    paddingHorizontal: 15,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterChip: {
    backgroundColor: '#E3735E',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortChip: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeSortChip: {
    backgroundColor: '#f0f0f0',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortText: {
    color: '#1a1a1a',
    fontWeight: '500',
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
  noReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noReviewsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ReviewsScreen;
