import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

const { width } = Dimensions.get('window');

const TabBar = ({ tabs, activeTab, onTabChange, style }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [indicatorWidth] = useState(new Animated.Value(0));
  const [tabWidths, setTabWidths] = useState([]);

  useEffect(() => {
    if (tabWidths.length > 0 && activeTab < tabWidths.length) {
      // Calculate the position of the indicator
      const position = tabWidths.slice(0, activeTab).reduce((acc, width) => acc + width, 0);
      
      // Animate the indicator to the new position and width
      Animated.parallel([
        Animated.timing(indicatorPosition, {
          toValue: position,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorWidth, {
          toValue: tabWidths[activeTab],
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [activeTab, tabWidths]);

  const measureTab = (index, width) => {
    const newTabWidths = [...tabWidths];
    newTabWidths[index] = width;
    setTabWidths(newTabWidths);
  };

  return (
    <View style={[styles.container, style, isRTL && styles.containerRTL]}>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          style={styles.tab}
          onPress={() => onTabChange(index)}
          onLayout={({ nativeEvent }) => measureTab(index, nativeEvent.layout.width)}
        >
          {tab.icon && (
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === index ? '#E3735E' : '#666'}
              style={styles.tabIcon}
            />
          )}
          <Text
            style={[
              styles.tabText,
              activeTab === index && styles.activeTabText,
            ]}
          >
            {typeof tab === 'string' ? tab : tab.label}
          </Text>
        </Pressable>
      ))}
      <Animated.View
        style={[
          styles.indicator,
          {
            left: indicatorPosition,
            width: indicatorWidth,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E3735E',
    fontWeight: '600',
  },
  tabIcon: {
    marginRight: 6,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#E3735E',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default TabBar;
