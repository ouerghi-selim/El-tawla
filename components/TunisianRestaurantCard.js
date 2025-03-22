import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

/**
 * Composant de carte de restaurant avec thème tunisien
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.restaurant - Données du restaurant
 * @param {Function} props.onPress - Fonction appelée lors du clic
 * @param {string} props.size - Taille de la carte ('small', 'medium', 'large')
 * @param {Object} props.style - Styles supplémentaires
 */
const TunisianRestaurantCard = ({
  restaurant,
  onPress,
  size = 'medium',
  style = {},
}) => {
  // Obtenir les styles en fonction de la taille
  const cardStyles = getCardStyles(size);
  
  return (
    <TouchableOpacity
      onPress={() => onPress(restaurant)}
      style={[styles.container, cardStyles.container, style]}
      activeOpacity={0.9}
    >
      {/* Image du restaurant avec overlay décoratif */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: restaurant.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          {/* Motif décoratif tunisien en filigrane */}
          <Image 
            source={require('../assets/patterns/mosaic-pattern.png')} 
            style={styles.patternOverlay} 
            resizeMode="cover"
          />
        </View>
        
        {/* Badge de prix */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{restaurant.priceRange}</Text>
        </View>
      </View>
      
      {/* Informations du restaurant */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Ionicons name="star" size={14} color={COLORS.accent2} />
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.cuisineContainer}>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          </View>
          <Text style={styles.distance}>{restaurant.distance || '1.2 km'}</Text>
        </View>
        
        {size === 'large' && (
          <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
        )}
        
        {/* Indicateurs spéciaux */}
        {restaurant.specialties && restaurant.specialties.length > 0 && (
          <View style={styles.specialtiesContainer}>
            <Text style={styles.specialtiesLabel}>Spécialités:</Text>
            <View style={styles.specialtiesList}>
              {restaurant.specialties.slice(0, 2).map((specialty, index) => (
                <Text key={index} style={styles.specialty} numberOfLines={1}>
                  {specialty.name}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Fonction pour obtenir les styles en fonction de la taille
const getCardStyles = (size) => {
  const sizeStyles = {
    small: {
      container: {
        width: 160,
        height: 180,
      },
      image: {
        height: 100,
      },
    },
    medium: {
      container: {
        width: '100%',
        height: 220,
      },
      image: {
        height: 140,
      },
    },
    large: {
      container: {
        width: '100%',
        height: 280,
      },
      image: {
        height: 180,
      },
    },
  };
  
  return sizeStyles[size] || sizeStyles.medium;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SPACING.borderRadiusMedium,
    overflow: 'hidden',
    marginBottom: SPACING.medium,
    ...SPACING.elevationMedium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    opacity: 0.2,
  },
  priceBadge: {
    position: 'absolute',
    bottom: SPACING.small,
    left: SPACING.small,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: SPACING.borderRadiusSmall,
  },
  priceText: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.fontSizeSmall,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  infoContainer: {
    padding: SPACING.small,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizeMedium,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: SPACING.borderRadiusSmall,
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSizeSmall,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginRight: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  cuisineContainer: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: SPACING.borderRadiusSmall,
  },
  cuisine: {
    fontSize: TYPOGRAPHY.fontSizeSmall,
    color: COLORS.textLight,
  },
  distance: {
    fontSize: TYPOGRAPHY.fontSizeSmall,
    color: COLORS.textLight,
  },
  address: {
    fontSize: TYPOGRAPHY.fontSizeSmall,
    color: COLORS.textLight,
    marginBottom: SPACING.tiny,
  },
  specialtiesContainer: {
    marginTop: SPACING.tiny,
  },
  specialtiesLabel: {
    fontSize: TYPOGRAPHY.fontSizeXSmall,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialty: {
    fontSize: TYPOGRAPHY.fontSizeXSmall,
    color: COLORS.primary,
    marginRight: SPACING.small,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
});

export default TunisianRestaurantCard;
