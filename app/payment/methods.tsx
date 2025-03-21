import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { 
  addPaymentMethod, 
  fetchPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod
} from '../store/slices/paymentSlice';
import { validateCreditCard, availablePaymentMethods } from '../utils/paymentService';

const PaymentMethodsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { paymentMethods, loading, error } = useSelector(state => state.payment);
  const { user } = useSelector(state => state.auth);
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchPaymentMethods(user.id));
    }
  }, [dispatch, user]);
  
  const handleAddCard = () => {
    // Validate card details
    if (!validateCreditCard.number(cardNumber)) {
      Alert.alert('Erreur', 'Numéro de carte invalide');
      return;
    }
    
    if (!validateCreditCard.expiry(expiryMonth, expiryYear)) {
      Alert.alert('Erreur', 'Date d\'expiration invalide');
      return;
    }
    
    if (!validateCreditCard.cvc(cvc)) {
      Alert.alert('Erreur', 'Code de sécurité invalide');
      return;
    }
    
    // Add payment method
    dispatch(addPaymentMethod({
      userId: user.id,
      paymentDetails: {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName,
        expMonth: parseInt(expiryMonth, 10),
        expYear: parseInt(expiryYear, 10),
        cvc,
        isDefault,
      }
    }));
    
    // Reset form and hide it
    setCardNumber('');
    setCardholderName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvc('');
    setIsDefault(false);
    setShowAddCard(false);
    
    // Feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const handleRemoveCard = (paymentMethod) => {
    Alert.alert(
      'Supprimer la carte',
      `Êtes-vous sûr de vouloir supprimer cette carte se terminant par ${paymentMethod.card_last_four} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            dispatch(removePaymentMethod({
              paymentMethodId: paymentMethod.id,
              stripePaymentMethodId: paymentMethod.payment_method_id,
            }));
            
            // Feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };
  
  const handleSetDefaultCard = (paymentMethod) => {
    if (!paymentMethod.is_default) {
      dispatch(setDefaultPaymentMethod({
        userId: user.id,
        paymentMethodId: paymentMethod.id,
      }));
      
      // Feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const formatCardNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const renderPaymentMethodItem = ({ item }) => {
    const cardBrandIcon = () => {
      switch (item.card_brand.toLowerCase()) {
        case 'visa':
          return 'card';
        case 'mastercard':
          return 'card';
        case 'amex':
          return 'card';
        default:
          return 'card-outline';
      }
    };
    
    return (
      <Pressable
        style={[
          styles.paymentMethodCard,
          item.is_default && styles.defaultCard
        ]}
        onPress={() => handleSetDefaultCard(item)}
      >
        <View style={styles.cardIconContainer}>
          <Ionicons name={cardBrandIcon()} size={28} color="#E3735E" />
        </View>
        
        <View style={styles.cardDetails}>
          <Text style={styles.cardType}>
            {item.card_brand.charAt(0).toUpperCase() + item.card_brand.slice(1)}
          </Text>
          <Text style={styles.cardNumber}>
            •••• •••• •••• {item.card_last_four}
          </Text>
          <Text style={styles.cardExpiry}>
            Expire {item.card_exp_month}/{item.card_exp_year}
          </Text>
        </View>
        
        <View style={styles.cardActions}>
          {item.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Par défaut</Text>
            </View>
          )}
          
          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemoveCard(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#666" />
          </Pressable>
        </View>
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Moyens de paiement</Text>
          <Text style={styles.subtitle}>
            Gérez vos cartes et autres moyens de paiement
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes cartes</Text>
          
          {loading && paymentMethods.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#E3735E" />
              <Text style={styles.loadingText}>Chargement de vos moyens de paiement...</Text>
            </View>
          ) : paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Vous n'avez pas encore ajouté de carte de paiement.
              </Text>
            </View>
          ) : (
            paymentMethods.map(method => renderPaymentMethodItem({ item: method }))
          )}
          
          {!showAddCard ? (
            <Pressable
              style={styles.addCardButton}
              onPress={() => {
                setShowAddCard(true);
                Haptics.selectionAsync();
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#E3735E" />
              <Text style={styles.addCardButtonText}>Ajouter une carte</Text>
            </Pressable>
          ) : (
            <View style={styles.addCardForm}>
              <Text style={styles.formTitle}>Ajouter une nouvelle carte</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de carte</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom du titulaire</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PRÉNOM NOM"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="characters"
                />
              </View>
              
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Mois d'expiration</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM"
                    value={expiryMonth}
                    onChangeText={setExpiryMonth}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Année d'expiration</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="AA"
                    value={expiryYear}
                    onChangeText={setExpiryYear}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVC</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <View style={styles.checkboxContainer}>
                <Pressable
                  style={[
                    styles.checkbox,
                    isDefault && styles.checkboxChecked
                  ]}
                  onPress={() => {
                    setIsDefault(!isDefault);
                    Haptics.selectionAsync();
                  }}
                >
                  {isDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>
                  Définir comme moyen de paiement par défaut
                </Text>
              </View>
              
              <View style={styles.formActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddCard(false);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                
                <Pressable
                  style={styles.saveButton}
                  onPress={handleAddCard}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autres moyens de paiement</Text>
          
          {availablePaymentMethods
            .filter(method => method.id !== 'card' && method.isAvailable)
            .map(method => (
              <Pressable
                key={method.id}
                style={styles.alternativeMethodItem}
                onPress={() => navigation.navigate(`Payment${method.id.charAt(0).toUpperCase() + method.id.slice(1)}`)}
              >
                <View style={styles.methodIconContainer}>
                  <Ionicons name={method.icon} size={24} color="#E3735E" />
                </View>
                
                <View style={styles.methodDetails}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  defaultCard: {
    borderWidth: 1,
    borderColor: '#E3735E',
    backgroundColor: '#fff',
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  defaultBadge: {
    backgroundColor: '#E3735E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3735E',
    borderStyle: 'dashed',
  },
  addCardButtonText: {
    fontSize: 14,
    color: '#E3735E',
    fontWeight: '600',
    marginLeft: 8,
  },
  addCardForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E3735E',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E3735E',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#E3735E',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  alternativeMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default PaymentMethodsScreen;
