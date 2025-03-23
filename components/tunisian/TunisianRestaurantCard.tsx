/**
 * TunisianRestaurantCard.tsx
 * Carte de restaurant avec le style tunisien
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TUNISIAN_COLORS, TUNISIAN_BORDER_RADIUS, TUNISIAN_SHADOWS, TUNISIAN_PATTERNS } from './TunisianTheme';

interface TunisianRestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    cuisine: string;
    rating: number;
    priceRange: string;
    address: string;
    distance?: string;
  };
  onPress: (id: string) => void;
  onAddressPress?: (address: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

const { width } = Dimensions.get('window');

const TunisianRestaurantCard: React.FC<TunisianRestaurantCardProps> = ({
  restaurant,
  onPress,
  onAddressPress,
  variant = 'default',
}) => {
  const { id, name, image, cuisine, rating, priceRange, address, distance } = restaurant;

  // Choisir le motif de fond aléatoirement parmi les motifs tunisiens
  const patternKeys = Object.keys(TUNISIAN_PATTERNS).filter(key => key.includes('Pattern'));
  const randomPatternKey = patternKeys[Math.floor(Math.random() * patternKeys.length)];
  const patternImage = TUNISIAN_PATTERNS[randomPatternKey as keyof typeof TUNISIAN_PATTERNS];

  const handleAddressPress = (e: any) => {
    e.stopPropagation();
    if (onAddressPress) {
      onAddressPress(address);
    }
  };

  // Styles spécifiques selon la variante
  const getCardStyle = () => {
    switch (variant) {
      case 'compact':
        return styles.compactCard;
      case 'featured':
        return styles.featuredCard;
      default:
        return styles.card;
    }
  };

  const getImageStyle = () => {
    switch (variant) {
      case 'compact':
        return styles.compactImage;
      case 'featured':
        return styles.featuredImage;
      default:
        return styles.image;
    }
  };

  // Rendu pour la variante compacte
  if (variant === 'compact') {
    return (
      <TouchableOpacity 
        style={[styles.compactCard, styles.cardShadow]} 
        onPress={() => onPress(id)}
        activeOpacity={0.8}
      >
        <View style={styles.compactContent}>
          <Image source={{ uri: image }} style={styles.compactImage} />
          <View style={styles.compactDetails}>
            <Text style={styles.compactName} numberOfLines={1}>{name}</Text>
            <Text style={styles.compactInfo}>{cuisine} • {rating}★ • {priceRange}</Text>
            {distance && (
              <Text style={styles.compactDistance}>{distance}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Rendu pour les variantes default et featured
  return (
    <TouchableOpacity 
      style={[getCardStyle(), styles.cardShadow]} 
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <ImageBackground 
        source={{ uri: image }} 
        style={getImageStyle()}
        imageStyle={{ borderRadius: TUNISIAN_BORDER_RADIUS.medium }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.patternOverlay}>
            <Image 
              source={patternImage} 
              style={styles.patternImage} 
              resizeMode="cover" 
            />
          </View>
          
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>
            {cuisine} • {rating}★ • {priceRange}
          </Text>
          
          <TouchableOpacity 
            style={styles.locationInfo}
            onPress={handleAddressPress}
          >
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={[styles.locationText, styles.addressLink]}>
              {address}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
      
      {variant === 'featured' && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Recommandé</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: 200,
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    marginRight: 15,
    overflow: 'hidden',
  },
  featuredCard: {
    width: width * 0.9,
    height: 220,
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    marginRight: 15,
    overflow: 'hidden',
  },
  compactCard: {
    width: '100%',
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardShadow: {
    ...TUNISIAN_SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: TUNISIAN_BORDER_RADIUS.small,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  info: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addressLink: {
    textDecorationLine: 'underline',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: TUNISIAN_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: TUNISIAN_BORDER_RADIUS.small,
  },
  featuredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  compactContent: {
    flexDirection: 'row',
    padding: 10,
  },
  compactDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  compactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TUNISIAN_COLORS.text.primary,
    marginBottom: 4,
  },
  compactInfo: {
    fontSize: 14,
    color: TUNISIAN_COLORS.text.secondary,
    marginBottom: 4,
  },
  compactDistance: {
    fontSize: 12,
    color: TUNISIAN_COLORS.primary,
  },
});

export default TunisianRestaurantCard;
