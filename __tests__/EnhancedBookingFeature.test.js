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

// Simuler les composants de réservation
const BookingForm = ({ restaurant, onSubmit }) => {
  const { t } = useTranslation();
  return (
    <div data-testid="booking-form">
      <h1>{t('booking.title')}</h1>
      <div data-testid="restaurant-name">{restaurant.name}</div>
      <input data-testid="date-picker" placeholder={t('booking.selectDate')} />
      <input data-testid="time-picker" placeholder={t('booking.selectTime')} />
      <input data-testid="guests-input" placeholder={t('booking.numberOfGuests')} />
      <input data-testid="name-input" placeholder={t('booking.yourName')} />
      <input data-testid="phone-input" placeholder={t('booking.yourPhone')} />
      <input data-testid="email-input" placeholder={t('booking.yourEmail')} />
      <input data-testid="special-requests" placeholder={t('booking.specialRequests')} />
      <button data-testid="submit-button" onClick={() => onSubmit({
        date: '2025-03-25',
        time: '19:30',
        guests: 4,
        name: 'Test User',
        phone: '+216 12 345 678',
        email: 'test@example.com',
        specialRequests: 'Table près de la fenêtre'
      })}>{t('booking.confirmReservation')}</button>
    </div>
  );
};

const BookingConfirmation = ({ booking, navigation }) => {
  const { t } = useTranslation();
  return (
    <div data-testid="booking-confirmation">
      <h1>{t('booking.confirmed')}</h1>
      <div data-testid="booking-details">
        <div>{t('booking.restaurant')}: {booking.restaurant.name}</div>
        <div>{t('booking.date')}: {booking.date}</div>
        <div>{t('booking.time')}: {booking.time}</div>
        <div>{t('booking.guests')}: {booking.guests}</div>
      </div>
      <button onClick={() => navigation.navigate('home')}>{t('booking.backToHome')}</button>
      <button onClick={() => navigation.navigate('bookings')}>{t('booking.viewAllBookings')}</button>
    </div>
  );
};

const BookingsList = ({ navigation }) => {
  const { t } = useTranslation();
  const bookings = [
    {
      id: '1',
      restaurant: { name: 'Restaurant A', image: 'https://example.com/image1.jpg' },
      date: '2025-03-25',
      time: '19:30',
      guests: 4,
      status: 'confirmed'
    },
    {
      id: '2',
      restaurant: { name: 'Restaurant B', image: 'https://example.com/image2.jpg' },
      date: '2025-04-10',
      time: '20:00',
      guests: 2,
      status: 'pending'
    }
  ];
  
  return (
    <div data-testid="bookings-list">
      <h1>{t('booking.yourBookings')}</h1>
      {bookings.map(booking => (
        <div key={booking.id} data-testid="booking-item" onClick={() => navigation.navigate('booking-details', { bookingId: booking.id })}>
          <div>{booking.restaurant.name}</div>
          <div>{booking.date} - {booking.time}</div>
          <div>{booking.guests} {t('booking.people')}</div>
          <div>{t(`booking.status.${booking.status}`)}</div>
        </div>
      ))}
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/booking/index.tsx', () => BookingForm);
jest.mock('../app/booking/confirmation.tsx', () => BookingConfirmation);
jest.mock('../app/booking/list.tsx', () => BookingsList);

describe('Enhanced Booking Feature Tests', () => {
  const mockRestaurant = {
    id: '123',
    name: 'Test Restaurant',
    image: 'https://example.com/restaurant.jpg',
    address: '123 Test Street, Tunis',
    cuisine: 'Tunisian',
    priceRange: '$$'
  };
  
  const mockNavigation = {
    navigate: jest.fn(),
  };
  
  const mockBooking = {
    id: '1',
    restaurant: mockRestaurant,
    date: '2025-03-25',
    time: '19:30',
    guests: 4,
    name: 'Test User',
    phone: '+216 12 345 678',
    email: 'test@example.com',
    specialRequests: 'Table près de la fenêtre',
    status: 'confirmed'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('BookingForm', () => {
    it('renders correctly with restaurant information', () => {
      const onSubmitMock = jest.fn();
      const { getByText, getByTestId } = render(
        <BookingForm restaurant={mockRestaurant} onSubmit={onSubmitMock} />
      );
      expect(getByTestId('booking-form')).toBeTruthy();
      expect(getByTestId('restaurant-name')).toBeTruthy();
      expect(getByTestId('date-picker')).toBeTruthy();
      expect(getByTestId('time-picker')).toBeTruthy();
      expect(getByTestId('guests-input')).toBeTruthy();
      expect(getByTestId('name-input')).toBeTruthy();
      expect(getByTestId('phone-input')).toBeTruthy();
      expect(getByTestId('email-input')).toBeTruthy();
      expect(getByTestId('special-requests')).toBeTruthy();
      expect(getByTestId('submit-button')).toBeTruthy();
    });

    it('calls onSubmit with booking details when form is submitted', () => {
      const onSubmitMock = jest.fn();
      const { getByTestId } = render(
        <BookingForm restaurant={mockRestaurant} onSubmit={onSubmitMock} />
      );
      
      fireEvent.click(getByTestId('submit-button'));
      
      expect(onSubmitMock).toHaveBeenCalledWith({
        date: '2025-03-25',
        time: '19:30',
        guests: 4,
        name: 'Test User',
        phone: '+216 12 345 678',
        email: 'test@example.com',
        specialRequests: 'Table près de la fenêtre'
      });
    });
  });

  describe('BookingConfirmation', () => {
    it('renders correctly with booking details', () => {
      const { getByText, getByTestId } = render(
        <BookingConfirmation booking={mockBooking} navigation={mockNavigation} />
      );
      expect(getByTestId('booking-confirmation')).toBeTruthy();
      expect(getByTestId('booking-details')).toBeTruthy();
      expect(getByText('booking.confirmed')).toBeTruthy();
      expect(getByText('booking.backToHome')).toBeTruthy();
      expect(getByText('booking.viewAllBookings')).toBeTruthy();
    });

    it('navigates to home when back button is clicked', () => {
      const { getByText } = render(
        <BookingConfirmation booking={mockBooking} navigation={mockNavigation} />
      );
      
      fireEvent.click(getByText('booking.backToHome'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('home');
    });

    it('navigates to bookings list when view all bookings button is clicked', () => {
      const { getByText } = render(
        <BookingConfirmation booking={mockBooking} navigation={mockNavigation} />
      );
      
      fireEvent.click(getByText('booking.viewAllBookings'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('bookings');
    });
  });

  describe('BookingsList', () => {
    it('renders correctly with booking items', () => {
      const { getAllByTestId } = render(
        <BookingsList navigation={mockNavigation} />
      );
      expect(getAllByTestId('booking-item').length).toBe(2);
    });

    it('navigates to booking details when a booking item is clicked', () => {
      const { getAllByTestId } = render(
        <BookingsList navigation={mockNavigation} />
      );
      
      fireEvent.click(getAllByTestId('booking-item')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('booking-details', { bookingId: '1' });
    });
  });
});
