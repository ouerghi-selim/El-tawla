import { Platform } from 'react-native';
import { Stripe } from '@stripe/stripe-react-native';

// Configuration des clés API
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key';
const API_URL = 'https://api.eltawla.com'; // À remplacer par votre URL d'API réelle

// Initialisation de Stripe
export const initStripe = async () => {
  try {
    await Stripe.setPublishableKey(STRIPE_PUBLISHABLE_KEY);
    console.log('Stripe initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return false;
  }
};

// API Stripe
export const stripeApi = {
  // Créer une méthode de paiement
  createPaymentMethod: async ({ type, card, billing_details }) => {
    try {
      const paymentMethod = await Stripe.createPaymentMethod({
        type,
        card,
        billingDetails: billing_details,
      });
      
      return { paymentMethod, error: null };
    } catch (error) {
      return { paymentMethod: null, error };
    }
  },
  
  // Détacher une méthode de paiement
  detachPaymentMethod: async (paymentMethodId) => {
    try {
      const response = await fetch(`${API_URL}/payments/detach-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to detach payment method');
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },
  
  // Créer une intention de paiement
  createPaymentIntent: async ({ amount, currency, payment_method, description, metadata, confirm }) => {
    try {
      const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          payment_method,
          description,
          metadata,
          confirm,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment intent');
      }
      
      return { paymentIntent: result.paymentIntent, error: null };
    } catch (error) {
      return { paymentIntent: null, error };
    }
  },
  
  // Confirmer une intention de paiement
  confirmPaymentIntent: async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await fetch(`${API_URL}/payments/confirm-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to confirm payment intent');
      }
      
      return { paymentIntent: result.paymentIntent, error: null };
    } catch (error) {
      return { paymentIntent: null, error };
    }
  },
};

// Méthodes de paiement disponibles en Tunisie
export const availablePaymentMethods = [
  {
    id: 'card',
    name: 'Carte bancaire',
    icon: 'card-outline',
    description: 'Paiement par carte bancaire (Visa, Mastercard)',
    isAvailable: true,
  },
  {
    id: 'edinar',
    name: 'E-Dinar',
    icon: 'cash-outline',
    description: 'Paiement par carte E-Dinar de la Poste Tunisienne',
    isAvailable: true,
  },
  {
    id: 'flouci',
    name: 'Flouci',
    icon: 'wallet-outline',
    description: 'Paiement via l\'application Flouci',
    isAvailable: Platform.OS === 'android',
  },
  {
    id: 'cash',
    name: 'Paiement à la réservation',
    icon: 'cash-outline',
    description: 'Payer en espèces lors de votre arrivée au restaurant',
    isAvailable: true,
  },
];

// Formater les montants
export const formatAmount = (amount, currency = 'TND') => {
  const formatter = new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Valider une carte de crédit
export const validateCreditCard = {
  number: (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number.replace(/\s/g, ''));
  },
  
  expiry: (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Convertir en nombres
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10) + 2000; // Supposant que l'année est au format YY
    
    // Vérifier si la date est valide
    if (expYear < currentYear) {
      return false;
    }
    
    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }
    
    return true;
  },
  
  cvc: (cvc) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvc);
  },
};

// Générer un reçu de paiement
export const generateReceipt = (payment) => {
  const receiptData = {
    id: payment.id,
    date: new Date(payment.created_at).toLocaleDateString('fr-TN'),
    time: new Date(payment.created_at).toLocaleTimeString('fr-TN'),
    amount: formatAmount(payment.amount / 100, payment.currency),
    description: payment.description,
    status: payment.status,
    paymentMethod: payment.payment_method_type,
    last4: payment.card_last_four,
  };
  
  return receiptData;
};

// Vérifier si un paiement est réussi
export const isPaymentSuccessful = (status) => {
  return status === 'succeeded' || status === 'completed';
};

// Obtenir un message d'erreur convivial
export const getFriendlyErrorMessage = (error) => {
  const errorMessages = {
    'card_declined': 'Votre carte a été refusée. Veuillez essayer une autre méthode de paiement.',
    'expired_card': 'Votre carte est expirée. Veuillez utiliser une autre carte.',
    'incorrect_cvc': 'Le code de sécurité de votre carte est incorrect.',
    'insufficient_funds': 'Votre carte ne dispose pas de fonds suffisants.',
    'invalid_card': 'Les informations de votre carte sont invalides.',
    'processing_error': 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
    'rate_limit': 'Trop de tentatives. Veuillez réessayer plus tard.',
  };
  
  if (error && error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }
  
  return 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.';
};
