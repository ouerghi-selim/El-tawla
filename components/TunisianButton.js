import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

/**
 * Composant de bouton stylisé avec thème tunisien
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.text - Texte du bouton
 * @param {Function} props.onPress - Fonction appelée lors du clic
 * @param {string} props.type - Type de bouton ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Taille du bouton ('small', 'medium', 'large')
 * @param {boolean} props.isGradient - Si true, utilise un dégradé de couleurs
 * @param {boolean} props.isDisabled - Si true, le bouton est désactivé
 * @param {Object} props.style - Styles supplémentaires
 */
const TunisianButton = ({
  text,
  onPress,
  type = 'primary',
  size = 'medium',
  isGradient = false,
  isDisabled = false,
  style = {},
}) => {
  // Déterminer les styles en fonction du type et de la taille
  const buttonStyles = getButtonStyles(type, size, isDisabled);
  
  // Si c'est un bouton avec dégradé
  if (isGradient && type === 'primary' && !isDisabled) {
    return (
      <TouchableOpacity
        onPress={isDisabled ? null : onPress}
        disabled={isDisabled}
        style={[styles.buttonContainer, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={COLORS.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, buttonStyles.button]}
        >
          <Text style={buttonStyles.text}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // Pour les autres types de boutons
  return (
    <TouchableOpacity
      onPress={isDisabled ? null : onPress}
      disabled={isDisabled}
      style={[styles.buttonContainer, buttonStyles.button, style]}
      activeOpacity={0.8}
    >
      <Text style={buttonStyles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

// Fonction pour obtenir les styles en fonction du type et de la taille
const getButtonStyles = (type, size, isDisabled) => {
  // Styles de base pour chaque type
  const typeStyles = {
    primary: {
      button: {
        backgroundColor: isDisabled ? COLORS.textLight : COLORS.primary,
        borderWidth: 0,
      },
      text: {
        color: COLORS.card,
        fontWeight: TYPOGRAPHY.fontWeightBold,
      },
    },
    secondary: {
      button: {
        backgroundColor: isDisabled ? COLORS.backgroundDark : COLORS.secondary,
        borderWidth: 0,
      },
      text: {
        color: COLORS.card,
        fontWeight: TYPOGRAPHY.fontWeightBold,
      },
    },
    outline: {
      button: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: isDisabled ? COLORS.textLight : COLORS.primary,
      },
      text: {
        color: isDisabled ? COLORS.textLight : COLORS.primary,
        fontWeight: TYPOGRAPHY.fontWeightMedium,
      },
    },
    text: {
      button: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      text: {
        color: isDisabled ? COLORS.textLight : COLORS.primary,
        fontWeight: TYPOGRAPHY.fontWeightMedium,
      },
    },
  };
  
  // Styles de taille
  const sizeStyles = {
    small: {
      button: {
        paddingVertical: SPACING.tiny,
        paddingHorizontal: SPACING.small,
        borderRadius: SPACING.borderRadiusSmall,
      },
      text: {
        fontSize: TYPOGRAPHY.fontSizeSmall,
      },
    },
    medium: {
      button: {
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
        borderRadius: SPACING.borderRadiusMedium,
      },
      text: {
        fontSize: TYPOGRAPHY.fontSizeRegular,
      },
    },
    large: {
      button: {
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.large,
        borderRadius: SPACING.borderRadiusMedium,
      },
      text: {
        fontSize: TYPOGRAPHY.fontSizeMedium,
      },
    },
  };
  
  // Combiner les styles
  return {
    button: {
      ...typeStyles[type].button,
      ...sizeStyles[size].button,
    },
    text: {
      ...typeStyles[type].text,
      ...sizeStyles[size].text,
    },
  };
};

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'hidden',
    ...SPACING.elevationSmall,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TunisianButton;
