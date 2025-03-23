/**
 * TunisianTheme.ts
 * Définition des couleurs et styles pour le thème tunisien
 */

export const TUNISIAN_COLORS = {
  primary: '#E3735E', // Couleur principale (terracotta/orange-rouge)
  secondary: '#1A5276', // Bleu foncé (portes de Sidi Bou Said)
  accent: '#F4D03F', // Jaune doré (sable du désert)
  background: '#F8F9FA', // Fond blanc cassé
  text: {
    primary: '#1A1A1A', // Texte principal
    secondary: '#666666', // Texte secondaire
    light: '#FFFFFF', // Texte clair
  },
  border: '#E0E0E0', // Bordures
  success: '#2ECC71', // Vert succès
  error: '#E74C3C', // Rouge erreur
  warning: '#F39C12', // Orange avertissement
  info: '#3498DB', // Bleu information
};

export const TUNISIAN_SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
};

export const TUNISIAN_BORDER_RADIUS = {
  small: 5,
  medium: 10,
  large: 15,
  round: 50,
};

export const TUNISIAN_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TUNISIAN_TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

export const TUNISIAN_PATTERNS = {
  // Motifs géométriques inspirés des mosaïques tunisiennes
  mosaicPattern: require('../../assets/patterns/mosaic-pattern.jpg'),
  arabicPattern: require('../../assets/patterns/arabic-pattern.jpg'),
  berberPattern: require('../../assets/patterns/berber-pattern.jpg'),
  
  // Icônes culturelles
  oliveIcon: require('../../assets/icons/olive-icon.png'),
  palmIcon: require('../../assets/icons/palm-icon.png'),
  doorIcon: require('../../assets/icons/door-icon.png'), // Portes bleues tunisiennes
};

export default {
  colors: TUNISIAN_COLORS,
  shadows: TUNISIAN_SHADOWS,
  borderRadius: TUNISIAN_BORDER_RADIUS,
  spacing: TUNISIAN_SPACING,
  typography: TUNISIAN_TYPOGRAPHY,
  patterns: TUNISIAN_PATTERNS,
};
