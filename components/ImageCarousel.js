import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

const { width } = Dimensions.get('window');

const ImageCarousel = ({
  images,
  autoPlay = true,
  showDots = true,
  showArrows = true,
  interval = 5000,
  height = 200,
  borderRadius = 8,
  renderItem,
  style
}) => {
  const { isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef(null);

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        if (activeIndex === images.length - 1) {
          scrollToIndex(0);
        } else {
          scrollToIndex(activeIndex + 1);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [activeIndex, autoPlay, images.length]);

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        if (index !== activeIndex) {
          setActiveIndex(index);
        }
      },
    }
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderArrows = () => {
    return (
      <>
        {activeIndex > 0 && (
          <Animated.View style={[styles.arrowContainer, styles.leftArrow]}>
            <Ionicons
              name={isRTL ? "chevron-forward" : "chevron-back"}
              size={24}
              color="#fff"
              onPress={() => scrollToIndex(activeIndex - 1)}
            />
          </Animated.View>
        )}
        {activeIndex < images.length - 1 && (
          <Animated.View style={[styles.arrowContainer, styles.rightArrow]}>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={24}
              color="#fff"
              onPress={() => scrollToIndex(activeIndex + 1)}
            />
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { height }, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.scrollView, { borderRadius }]}
      >
        {images.map((item, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            {renderItem ? renderItem(item, index) : null}
          </View>
        ))}
      </ScrollView>
      {showDots && renderDots()}
      {showArrows && renderArrows()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    overflow: 'hidden',
  },
  slide: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
});

export default ImageCarousel;
