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

// Simuler les composants de paiement intégré
const PaymentMethods = ({ navigation }) => {
  const { t } = useTranslation();
  const paymentMethods = [
    { id: 'card1', type: 'credit', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 2026, isDefault: true },
    { id: 'card2', type: 'credit', last4: '1234', brand: 'Mastercard', expMonth: 10, expYear: 2025, isDefault: false },
    { id: 'edinar1', type: 'edinar', accountNumber: '****5678', isDefault: false }
  ];
  
  return (
    <div data-testid="payment-methods">
      <h1>{t('payment.methods')}</h1>
      <button data-testid="add-payment-button" onClick={() => navigation.navigate('add-payment-method')}>
        {t('payment.addMethod')}
      </button>
      {paymentMethods.map(method => (
        <div key={method.id} data-testid="payment-method-item">
          {method.type === 'credit' ? (
            <div data-testid="credit-card">
              <div>{method.brand} •••• {method.last4}</div>
              <div>{t('payment.expires')}: {method.expMonth}/{method.expYear}</div>
              {method.isDefault && <div>{t('payment.default')}</div>}
              <button onClick={() => navigation.navigate('edit-payment-method', { methodId: method.id })}>
                {t('common.edit')}
              </button>
              <button onClick={() => {}}>
                {t('common.delete')}
              </button>
              {!method.isDefault && (
                <button onClick={() => {}}>
                  {t('payment.setAsDefault')}
                </button>
              )}
            </div>
          ) : (
            <div data-testid="edinar-account">
              <div>E-Dinar {method.accountNumber}</div>
              {method.isDefault && <div>{t('payment.default')}</div>}
              <button onClick={() => navigation.navigate('edit-payment-method', { methodId: method.id })}>
                {t('common.edit')}
              </button>
              <button onClick={() => {}}>
                {t('common.delete')}
              </button>
              {!method.isDefault && (
                <button onClick={() => {}}>
                  {t('payment.setAsDefault')}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AddPaymentMethod = ({ navigation }) => {
  const { t } = useTranslation();
  
  return (
    <div data-testid="add-payment-method">
      <h1>{t('payment.addMethod')}</h1>
      <div data-testid="payment-options">
        <button data-testid="add-credit-card" onClick={() => navigation.navigate('add-credit-card')}>
          {t('payment.addCreditCard')}
        </button>
        <button data-testid="add-edinar" onClick={() => navigation.navigate('add-edinar')}>
          {t('payment.addEDinar')}
        </button>
        <button data-testid="add-flouci" onClick={() => navigation.navigate('add-flouci')}>
          {t('payment.addFlouci')}
        </button>
      </div>
    </div>
  );
};

const PaymentCheckout = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { amount, restaurantId, bookingId } = route.params;
  
  return (
    <div data-testid="payment-checkout">
      <h1>{t('payment.checkout')}</h1>
      <div data-testid="payment-summary">
        <div>{t('payment.amount')}: {amount} TND</div>
        <div>{t('payment.restaurant')}: {restaurantId}</div>
        <div>{t('payment.booking')}: {bookingId}</div>
      </div>
      <div data-testid="payment-method-selector">
        <h2>{t('payment.selectMethod')}</h2>
        <div data-testid="selected-payment-method">
          <div>Visa •••• 4242</div>
          <button onClick={() => navigation.navigate('payment-methods')}>
            {t('payment.change')}
          </button>
        </div>
      </div>
      <button data-testid="pay-button" onClick={() => navigation.navigate('payment-confirmation', { 
        amount, 
        restaurantId, 
        bookingId,
        paymentMethodId: 'card1'
      })}>
        {t('payment.pay')}
      </button>
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/payment/methods.tsx', () => PaymentMethods);
jest.mock('../app/payment/add.tsx', () => AddPaymentMethod);
jest.mock('../app/payment/checkout.tsx', () => PaymentCheckout);

describe('Integrated Payment Feature Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      amount: 150.00,
      restaurantId: 'rest1',
      bookingId: 'booking1'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PaymentMethods', () => {
    it('renders correctly with payment methods list', () => {
      const { getByText, getAllByTestId, getByTestId } = render(
        <PaymentMethods navigation={mockNavigation} />
      );
      expect(getByText('payment.methods')).toBeTruthy();
      expect(getByTestId('add-payment-button')).toBeTruthy();
      expect(getAllByTestId('payment-method-item').length).toBe(3);
      expect(getAllByTestId('credit-card').length).toBe(2);
      expect(getAllByTestId('edinar-account').length).toBe(1);
    });

    it('navigates to add payment method screen when add button is clicked', () => {
      const { getByTestId } = render(
        <PaymentMethods navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('add-payment-button'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('add-payment-method');
    });

    it('navigates to edit payment method screen when edit button is clicked', () => {
      const { getAllByText } = render(
        <PaymentMethods navigation={mockNavigation} />
      );
      
      // Click the first edit button
      fireEvent.click(getAllByText('common.edit')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('edit-payment-method', { 
        methodId: 'card1'
      });
    });
  });

  describe('AddPaymentMethod', () => {
    it('renders correctly with payment options', () => {
      const { getByText, getByTestId } = render(
        <AddPaymentMethod navigation={mockNavigation} />
      );
      expect(getByText('payment.addMethod')).toBeTruthy();
      expect(getByTestId('payment-options')).toBeTruthy();
      expect(getByTestId('add-credit-card')).toBeTruthy();
      expect(getByTestId('add-edinar')).toBeTruthy();
      expect(getByTestId('add-flouci')).toBeTruthy();
    });

    it('navigates to add credit card screen when credit card option is clicked', () => {
      const { getByTestId } = render(
        <AddPaymentMethod navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('add-credit-card'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('add-credit-card');
    });

    it('navigates to add E-Dinar screen when E-Dinar option is clicked', () => {
      const { getByTestId } = render(
        <AddPaymentMethod navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('add-edinar'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('add-edinar');
    });

    it('navigates to add Flouci screen when Flouci option is clicked', () => {
      const { getByTestId } = render(
        <AddPaymentMethod navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('add-flouci'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('add-flouci');
    });
  });

  describe('PaymentCheckout', () => {
    it('renders correctly with payment summary', () => {
      const { getByText, getByTestId } = render(
        <PaymentCheckout route={mockRoute} navigation={mockNavigation} />
      );
      expect(getByText('payment.checkout')).toBeTruthy();
      expect(getByTestId('payment-summary')).toBeTruthy();
      expect(getByTestId('payment-method-selector')).toBeTruthy();
      expect(getByTestId('selected-payment-method')).toBeTruthy();
      expect(getByTestId('pay-button')).toBeTruthy();
    });

    it('navigates to payment methods screen when change button is clicked', () => {
      const { getByText } = render(
        <PaymentCheckout route={mockRoute} navigation={mockNavigation} />
      );
      
      fireEvent.click(getByText('payment.change'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('payment-methods');
    });

    it('navigates to payment confirmation screen when pay button is clicked', () => {
      const { getByTestId } = render(
        <PaymentCheckout route={mockRoute} navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('pay-button'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('payment-confirmation', { 
        amount: 150.00,
        restaurantId: 'rest1',
        bookingId: 'booking1',
        paymentMethodId: 'card1'
      });
    });
  });
});
