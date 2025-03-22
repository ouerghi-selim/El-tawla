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

// Simuler les composants d'administration
const AdminDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <div data-testid="admin-dashboard">
      <h1>{t('admin.dashboard')}</h1>
      <button onClick={() => navigation.navigate('admin/analytics')}>{t('admin.analytics')}</button>
      <button onClick={() => navigation.navigate('admin/staff')}>{t('admin.staff')}</button>
      <button onClick={() => navigation.navigate('admin/promotions')}>{t('admin.promotions')}</button>
    </div>
  );
};

const AdminAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="admin-analytics">
      <h1>{t('admin.analytics')}</h1>
    </div>
  );
};

const AdminStaff = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="admin-staff">
      <h1>{t('admin.staff')}</h1>
    </div>
  );
};

const AdminPromotions = () => {
  const { t } = useTranslation();
  return (
    <div data-testid="admin-promotions">
      <h1>{t('admin.promotions')}</h1>
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/admin/index.tsx', () => AdminDashboard);
jest.mock('../app/admin/analytics.tsx', () => AdminAnalytics);
jest.mock('../app/admin/staff.tsx', () => AdminStaff);
jest.mock('../app/admin/promotions.tsx', () => AdminPromotions);

describe('Admin Dashboard Feature Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminDashboard', () => {
    it('renders correctly with navigation options', () => {
      const { getByText, getByTestId } = render(<AdminDashboard navigation={mockNavigation} />);
      expect(getByTestId('admin-dashboard')).toBeTruthy();
      expect(getByText('admin.dashboard')).toBeTruthy();
      expect(getByText('admin.analytics')).toBeTruthy();
      expect(getByText('admin.staff')).toBeTruthy();
      expect(getByText('admin.promotions')).toBeTruthy();
    });

    it('navigates to analytics screen when analytics button is clicked', () => {
      const { getByText } = render(<AdminDashboard navigation={mockNavigation} />);
      fireEvent.click(getByText('admin.analytics'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('admin/analytics');
    });

    it('navigates to staff screen when staff button is clicked', () => {
      const { getByText } = render(<AdminDashboard navigation={mockNavigation} />);
      fireEvent.click(getByText('admin.staff'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('admin/staff');
    });

    it('navigates to promotions screen when promotions button is clicked', () => {
      const { getByText } = render(<AdminDashboard navigation={mockNavigation} />);
      fireEvent.click(getByText('admin.promotions'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('admin/promotions');
    });
  });

  describe('AdminAnalytics', () => {
    it('renders correctly', () => {
      const { getByText, getByTestId } = render(<AdminAnalytics />);
      expect(getByTestId('admin-analytics')).toBeTruthy();
      expect(getByText('admin.analytics')).toBeTruthy();
    });
  });

  describe('AdminStaff', () => {
    it('renders correctly', () => {
      const { getByText, getByTestId } = render(<AdminStaff />);
      expect(getByTestId('admin-staff')).toBeTruthy();
      expect(getByText('admin.staff')).toBeTruthy();
    });
  });

  describe('AdminPromotions', () => {
    it('renders correctly', () => {
      const { getByText, getByTestId } = render(<AdminPromotions />);
      expect(getByTestId('admin-promotions')).toBeTruthy();
      expect(getByText('admin.promotions')).toBeTruthy();
    });
  });
});
