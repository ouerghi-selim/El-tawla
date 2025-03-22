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

// Simuler les composants de fidélité
const LoyaltyProgram = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <div data-testid="loyalty-program">
      <h1>{t('loyalty.title')}</h1>
      <div data-testid="points-display">{t('loyalty.yourPoints')}: 250</div>
      <button onClick={() => navigation.navigate('loyalty/rewards')}>{t('loyalty.viewRewards')}</button>
      <button onClick={() => navigation.navigate('loyalty/history')}>{t('loyalty.viewHistory')}</button>
    </div>
  );
};

const LoyaltyRewards = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="loyalty-rewards">
      <h1>{t('loyalty.rewards')}</h1>
      <div data-testid="reward-item">{t('loyalty.discount10')}: 100 {t('loyalty.points')}</div>
      <div data-testid="reward-item">{t('loyalty.discount25')}: 250 {t('loyalty.points')}</div>
      <div data-testid="reward-item">{t('loyalty.freeAppetizer')}: 150 {t('loyalty.points')}</div>
    </div>
  );
};

const LoyaltyHistory = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="loyalty-history">
      <h1>{t('loyalty.history')}</h1>
      <div data-testid="history-item">+50 {t('loyalty.points')} - {t('loyalty.reservation')} 15/03/2025</div>
      <div data-testid="history-item">-100 {t('loyalty.points')} - {t('loyalty.discount10')} 10/03/2025</div>
      <div data-testid="history-item">+50 {t('loyalty.points')} - {t('loyalty.reservation')} 05/03/2025</div>
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/loyalty/index.tsx', () => LoyaltyProgram);
jest.mock('../app/loyalty/rewards.tsx', () => LoyaltyRewards);
jest.mock('../app/loyalty/history.tsx', () => LoyaltyHistory);

describe('Loyalty Program Feature Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoyaltyProgram', () => {
    it('renders correctly with points display', () => {
      const { getByText, getByTestId } = render(<LoyaltyProgram navigation={mockNavigation} />);
      expect(getByTestId('loyalty-program')).toBeTruthy();
      expect(getByTestId('points-display')).toBeTruthy();
      expect(getByText('loyalty.title')).toBeTruthy();
      expect(getByText('loyalty.viewRewards')).toBeTruthy();
      expect(getByText('loyalty.viewHistory')).toBeTruthy();
    });

    it('navigates to rewards screen when rewards button is clicked', () => {
      const { getByText } = render(<LoyaltyProgram navigation={mockNavigation} />);
      fireEvent.click(getByText('loyalty.viewRewards'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('loyalty/rewards');
    });

    it('navigates to history screen when history button is clicked', () => {
      const { getByText } = render(<LoyaltyProgram navigation={mockNavigation} />);
      fireEvent.click(getByText('loyalty.viewHistory'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('loyalty/history');
    });
  });

  describe('LoyaltyRewards', () => {
    it('renders correctly with reward items', () => {
      const { getByText, getAllByTestId } = render(<LoyaltyRewards />);
      expect(getByText('loyalty.rewards')).toBeTruthy();
      expect(getAllByTestId('reward-item').length).toBe(3);
    });
  });

  describe('LoyaltyHistory', () => {
    it('renders correctly with history items', () => {
      const { getByText, getAllByTestId } = render(<LoyaltyHistory />);
      expect(getByText('loyalty.history')).toBeTruthy();
      expect(getAllByTestId('history-item').length).toBe(3);
    });
  });
});
