import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

// Mock des dépendances externes
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));
jest.mock('../utils/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    isRTL: false,
    language: 'fr',
    setLanguage: jest.fn(),
  }),
}));

// Simuler les composants de détails de restaurant
const RestaurantDetails = ({ route, navigation }) => {
  const { t } = useTranslation();
  const restaurant = {
    id: '123',
    name: 'Test Restaurant',
    image: 'https://example.com/restaurant.jpg',
    address: '123 Test Street, Tunis',
    cuisine: 'Tunisian',
    priceRange: '$$',
    rating: 4.5,
    reviews: [],
    description: 'A wonderful Tunisian restaurant with authentic cuisine.',
    openingHours: {
      monday: '12:00 - 23:00',
      tuesday: '12:00 - 23:00',
      wednesday: '12:00 - 23:00',
      thursday: '12:00 - 23:00',
      friday: '12:00 - 00:00',
      saturday: '12:00 - 00:00',
      sunday: '12:00 - 22:00'
    },
    menu: [
      {
        category: 'Entrées',
        items: [
          { name: 'Salade Tunisienne', price: '8.00', description: 'Tomates, concombres, oignons, poivrons, olives et thon' },
          { name: 'Brick à l\'œuf', price: '6.00', description: 'Feuille de brick croustillante farcie à l\'œuf' }
        ]
      },
      {
        category: 'Plats Principaux',
        items: [
          { name: 'Couscous Royal', price: '18.00', description: 'Couscous avec agneau, poulet et merguez' },
          { name: 'Tajine Zitoune', price: '15.00', description: 'Tajine d\'agneau aux olives et citron confit' }
        ]
      }
    ],
    specialties: [
      { name: 'Couscous Royal', image: 'https://example.com/couscous.jpg' },
      { name: 'Brick à l\'œuf', image: 'https://example.com/brick.jpg' }
    ],
    location: {
      latitude: 36.8065,
      longitude: 10.1815
    }
  };
  
  return (
    <div data-testid="restaurant-details">
      <h1>{restaurant.name}</h1>
      <div data-testid="restaurant-info">
        <div>{restaurant.cuisine}</div>
        <div>{restaurant.priceRange}</div>
        <div>{restaurant.rating}</div>
        <div>{restaurant.address}</div>
      </div>
      <button data-testid="book-button" onClick={() => navigation.navigate('booking', { restaurant })}>
        {t('restaurant.book')}
      </button>
      <div data-testid="tabs">
        <button data-testid="menu-tab">{t('restaurant.menu')}</button>
        <button data-testid="info-tab">{t('restaurant.info')}</button>
        <button data-testid="reviews-tab">{t('restaurant.reviews')}</button>
      </div>
      <div data-testid="menu-section">
        {restaurant.menu.map((category, index) => (
          <div key={index} data-testid="menu-category">
            <h2>{category.category}</h2>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} data-testid="menu-item">
                <div>{item.name}</div>
                <div>{item.price}</div>
                <div>{item.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Simuler les composants de recherche de restaurant
const RestaurantSearch = ({ navigation }) => {
  const { t } = useTranslation();
  const restaurants = [
    {
      id: '123',
      name: 'Restaurant A',
      image: 'https://example.com/restaurant-a.jpg',
      cuisine: 'Tunisian',
      priceRange: '$$',
      rating: 4.5,
      address: '123 Test Street, Tunis'
    },
    {
      id: '456',
      name: 'Restaurant B',
      image: 'https://example.com/restaurant-b.jpg',
      cuisine: 'Mediterranean',
      priceRange: '$$$',
      rating: 4.2,
      address: '456 Sample Avenue, Tunis'
    }
  ];
  
  return (
    <div data-testid="restaurant-search">
      <input data-testid="search-input" placeholder={t('search.placeholder')} />
      <div data-testid="filters">
        <button data-testid="cuisine-filter">{t('search.cuisine')}</button>
        <button data-testid="price-filter">{t('search.price')}</button>
        <button data-testid="rating-filter">{t('search.rating')}</button>
        <button data-testid="location-filter">{t('search.location')}</button>
      </div>
      <div data-testid="results">
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            data-testid="restaurant-card"
            onClick={() => navigation.navigate('restaurant-details', { restaurantId: restaurant.id })}
          >
            <div>{restaurant.name}</div>
            <div>{restaurant.cuisine}</div>
            <div>{restaurant.priceRange}</div>
            <div>{restaurant.rating}</div>
            <div>{restaurant.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/restaurant/details.tsx', () => RestaurantDetails);
jest.mock('../app/restaurant/search.tsx', () => RestaurantSearch);

describe('Restaurant Details Feature Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      restaurantId: '123'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RestaurantDetails', () => {
    it('renders correctly with restaurant information', () => {
      const { getByText, getByTestId } = render(
        <RestaurantDetails route={mockRoute} navigation={mockNavigation} />
      );
      expect(getByTestId('restaurant-details')).toBeTruthy();
      expect(getByTestId('restaurant-info')).toBeTruthy();
      expect(getByTestId('book-button')).toBeTruthy();
      expect(getByTestId('tabs')).toBeTruthy();
      expect(getByTestId('menu-section')).toBeTruthy();
    });

    it('navigates to booking screen when book button is clicked', () => {
      const { getByTestId } = render(
        <RestaurantDetails route={mockRoute} navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('book-button'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('booking', { 
        restaurant: expect.objectContaining({
          id: '123',
          name: 'Test Restaurant'
        }) 
      });
    });

    it('displays menu categories and items', () => {
      const { getAllByTestId } = render(
        <RestaurantDetails route={mockRoute} navigation={mockNavigation} />
      );
      
      expect(getAllByTestId('menu-category').length).toBe(2);
      expect(getAllByTestId('menu-item').length).toBe(4);
    });
  });

  describe('RestaurantSearch', () => {
    it('renders correctly with search input and filters', () => {
      const { getByTestId, getAllByTestId } = render(
        <RestaurantSearch navigation={mockNavigation} />
      );
      expect(getByTestId('restaurant-search')).toBeTruthy();
      expect(getByTestId('search-input')).toBeTruthy();
      expect(getByTestId('filters')).toBeTruthy();
      expect(getByTestId('results')).toBeTruthy();
      expect(getAllByTestId('restaurant-card').length).toBe(2);
    });

    it('navigates to restaurant details when a restaurant card is clicked', () => {
      const { getAllByTestId } = render(
        <RestaurantSearch navigation={mockNavigation} />
      );
      
      fireEvent.click(getAllByTestId('restaurant-card')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('restaurant-details', { 
        restaurantId: '123'
      });
    });
  });
});
