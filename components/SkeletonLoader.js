import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonLoader = ({ width, height, style, borderRadius = 4 }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const backgroundColorInterpolation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#f0f0f0', '#e0e0e0', '#f0f0f0'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: backgroundColorInterpolation,
        },
        style,
      ]}
    />
  );
};

const SkeletonRestaurantCard = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader width={280} height={180} borderRadius={8} />
      <View style={styles.cardContent}>
        <SkeletonLoader width={200} height={20} style={styles.titleSkeleton} />
        <SkeletonLoader width={150} height={16} style={styles.subtitleSkeleton} />
        <SkeletonLoader width={180} height={16} style={styles.addressSkeleton} />
      </View>
    </View>
  );
};

const SkeletonList = ({ count = 3 }) => {
  return (
    <View style={styles.listContainer}>
      {Array(count).fill().map((_, index) => (
        <SkeletonRestaurantCard key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#f0f0f0',
  },
  card: {
    marginRight: 15,
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  cardContent: {
    padding: 12,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 8,
  },
  addressSkeleton: {
    marginBottom: 4,
  },
  listContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});

export { SkeletonLoader, SkeletonRestaurantCard, SkeletonList };
