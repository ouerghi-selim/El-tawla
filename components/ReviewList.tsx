import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      
      {reviews.length === 0 ? (
        <Text style={styles.noReviews}>No reviews yet</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: review.user.image }}
                style={styles.userImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{review.user.name}</Text>
                <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
              </View>
              <View style={styles.rating}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < review.rating ? "star" : "star-outline"}
                    size={16}
                    color={index < review.rating ? "#FFD700" : "#666"}
                    style={styles.star}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.comment}>{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
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
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
  },
  star: {
    marginLeft: 2,
  },
  comment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});