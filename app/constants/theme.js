// Thème de couleurs inspiré par la culture tunisienne
export const COLORS = {
  // Couleurs primaires
  primary: '#D62828', // Rouge tunisien (présent dans le drapeau)
  secondary: '#003049', // Bleu foncé (présent dans les céramiques tunisiennes)
  
  // Couleurs d'accentuation
  accent1: '#F77F00', // Orange (rappelle le soleil tunisien)
  accent2: '#FCBF49', // Jaune doré (rappelle les épices tunisiennes comme le safran)
  accent3: '#8AC926', // Vert olive (rappelle les olives tunisiennes)
  
  // Couleurs neutres
  background: '#F8F9FA',
  backgroundDark: '#E9ECEF',
  card: '#FFFFFF',
  text: '#212529',
  textLight: '#6C757D',
  border: '#DEE2E6',
  
  // Couleurs sémantiques
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Couleurs spécifiques à la culture tunisienne
  ceramicBlue: '#1A91D6', // Bleu des céramiques de Nabeul
  oliveGreen: '#606C38', // Vert des olives tunisiennes
  desertSand: '#E9C46A', // Sable du désert tunisien
  medina: '#F4A261', // Couleur des murs de la médina
  mosaicTeal: '#2A9D8F', // Turquoise des mosaïques tunisiennes
  
  // Dégradés
  gradientPrimary: ['#D62828', '#F77F00'],
  gradientSecondary: ['#003049', '#1A91D6'],
  gradientAccent: ['#F77F00', '#FCBF49'],
};

// Typographie adaptée au contexte multilingue (français, arabe, anglais)
export const TYPOGRAPHY = {
  // Tailles de police
  fontSizeXSmall: 10,
  fontSizeSmall: 12,
  fontSizeRegular: 14,
  fontSizeMedium: 16,
  fontSizeLarge: 18,
  fontSizeXLarge: 20,
  fontSizeXXLarge: 24,
  fontSizeTitle: 28,
  fontSizeHeader: 32,
  
  // Poids de police
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  
  // Familles de police
  fontFamilyRegular: 'System',
  fontFamilyBold: 'System-Bold',
  fontFamilyArabic: 'System', // Sera remplacé par une police arabe appropriée
  
  // Hauteurs de ligne
  lineHeightTight: 1.2,
  lineHeightRegular: 1.4,
  lineHeightRelaxed: 1.6,
};

// Espacement et dimensions
export const SPACING = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
  
  // Rayons de bordure
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusLarge: 16,
  borderRadiusXLarge: 24,
  
  // Élévations (ombres)
  elevationSmall: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  elevationMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  elevationLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

// Motifs et décorations inspirés par l'art tunisien
export const PATTERNS = {
  // Motifs géométriques inspirés des mosaïques tunisiennes
  mosaicPattern: require('../../assets/patterns/mosaic-pattern.jpg'),
  arabicPattern: require('../../assets/patterns/arabic-pattern.jpg'),
  berberPattern: require('../../assets/patterns/berber-pattern.jpg'),
  
  // Icônes culturelles
  oliveIcon: require('../../assets/icons/olive-icon.png'),
  palmIcon: require('../../assets/icons/palm-icon.png'),
  doorIcon: require('../../assets/icons/door-icon.png'), // Portes bleues tunisiennes
};

// Animations et transitions
export const ANIMATIONS = {
  defaultDuration: 300,
  longDuration: 500,
  
  // Courbes d'animation
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  
  // Animations spécifiques
  buttonPress: {
    scale: 0.95,
    duration: 100,
  },
  pageTransition: {
    type: 'slide',
    duration: 300,
  },
};

// Constantes pour les fonctionnalités spécifiques
export const FEATURES = {
  // Formats de date adaptés au contexte tunisien
  dateFormat: {
    short: 'DD/MM/YYYY',
    long: 'D MMMM YYYY',
    time: 'HH:mm',
  },
  
  // Devise
  currency: 'TND',
  currencySymbol: 'DT',
  
  // Langues supportées
  languages: ['fr', 'ar', 'en'],
  defaultLanguage: 'fr',
  
  // Paramètres régionaux
  region: {
    latitude: 36.8065,
    longitude: 10.1815, // Coordonnées de Tunis
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

// Thème global qui combine tous les éléments
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  patterns: PATTERNS,
  animations: ANIMATIONS,
  features: FEATURES,
  
  // Mode sombre (à implémenter ultérieurement)
  dark: false,
};

export default THEME;
