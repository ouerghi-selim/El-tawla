/**
 * TunisianButton.tsx
 * Composant de bouton avec le style tunisien
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  Image,
  View
} from 'react-native';
import { TUNISIAN_COLORS, TUNISIAN_BORDER_RADIUS, TUNISIAN_SHADOWS, TUNISIAN_PATTERNS } from './TunisianTheme';

interface TunisianButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: 'olive' | 'palm' | 'door' | null;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const TunisianButton: React.FC<TunisianButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  // Déterminer le style du bouton en fonction de la variante
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  // Déterminer le style du texte en fonction de la variante
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return styles.lightText;
      case 'outline':
        return styles.darkText;
      default:
        return styles.lightText;
    }
  };

  // Déterminer le style du bouton en fonction de la taille
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Obtenir l'icône appropriée
  const getIcon = () => {
    if (!icon) return null;
    
    switch (icon) {
      case 'olive':
        return TUNISIAN_PATTERNS.oliveIcon;
      case 'palm':
        return TUNISIAN_PATTERNS.palmIcon;
      case 'door':
        return TUNISIAN_PATTERNS.doorIcon;
      default:
        return null;
    }
  };

  const buttonIcon = getIcon();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? TUNISIAN_COLORS.primary : TUNISIAN_COLORS.text.light} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {buttonIcon && (
            <Image 
              source={buttonIcon} 
              style={styles.icon} 
              resizeMode="contain"
            />
          )}
          <Text 
            style={[
              styles.text, 
              getTextStyle(), 
              size === 'small' && styles.smallText,
              size === 'large' && styles.largeText,
              textStyle
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    ...TUNISIAN_SHADOWS.small,
  },
  primaryButton: {
    backgroundColor: TUNISIAN_COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: TUNISIAN_COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: TUNISIAN_COLORS.primary,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  lightText: {
    color: TUNISIAN_COLORS.text.light,
  },
  darkText: {
    color: TUNISIAN_COLORS.primary,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default TunisianButton;
