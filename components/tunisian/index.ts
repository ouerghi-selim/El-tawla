/**
 * index.ts
 * Point d'entrée pour les composants tunisiens
 */

import TunisianTheme, { 
  TUNISIAN_COLORS, 
  TUNISIAN_SHADOWS, 
  TUNISIAN_BORDER_RADIUS, 
  TUNISIAN_SPACING, 
  TUNISIAN_TYPOGRAPHY,
  TUNISIAN_PATTERNS
} from './TunisianTheme';
import TunisianButton from './TunisianButton';
import TunisianRestaurantCard from './TunisianRestaurantCard';

export {
  TunisianTheme,
  TUNISIAN_COLORS,
  TUNISIAN_SHADOWS,
  TUNISIAN_BORDER_RADIUS,
  TUNISIAN_SPACING,
  TUNISIAN_TYPOGRAPHY,
  TUNISIAN_PATTERNS,
  TunisianButton,
  TunisianRestaurantCard
};

export default {
  Theme: TunisianTheme,
  Button: TunisianButton,
  RestaurantCard: TunisianRestaurantCard
};
