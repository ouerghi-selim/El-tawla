import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

import { createReservation, updateReservation } from '../utils/reservationService';

const BookingForm = ({ 
  restaurant, 
  date, 
  time, 
  partySize, 
  onSuccess, 
  onCancel,
  existingReservation = null 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isGroupReservation, setIsGroupReservation] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [useCardGuarantee, setUseCardGuarantee] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [sendSmsConfirmation, setSendSmsConfirmation] = useState(true);
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.full_name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
    
    if (existingReservation) {
      setName(existingReservation.name);
      setPhone(existingReservation.phone);
      setEmail(existingReservation.email);
      setSpecialRequests(existingReservation.special_requests || '');
      setIsGroupReservation(existingReservation.is_group_reservation || false);
      setGroupName(existingReservation.group_name || '');
      setUseCardGuarantee(existingReservation.has_card_guarantee || false);
      setSendSmsConfirmation(existingReservation.send_sms_confirmation !== false);
      setSendEmailConfirmation(existingReservation.send_email_confirmation !== false);
    }
    
    // Check if saved card exists
    checkForSavedCard();
  }, [user, existingReservation]);
  
  const checkForSavedCard = async () => {
    try {
      const savedCard = await SecureStore.getItemAsync('savedCardDetails');
      if (savedCard) {
        const parsedCard = JSON.parse(savedCard);
        setCardDetails({
          ...parsedCard,
          number: parsedCard.number.replace(/\d(?=\d{4})/g, "*") // Mask all but last 4 digits
        });
      }
    } catch (error) {
      console.error('Error retrieving saved card:', error);
    }
  };
  
  const saveCardDetails = async () => {
    try {
      // Only save if it's a new card (not masked)
      if (!cardDetails.number.includes('*')) {
        const lastFourDigits = cardDetails.number.slice(-4);
        const maskedNumber = cardDetails.number.replace(/\d(?=\d{4})/g, "*");
        
        await SecureStore.setItemAsync('savedCardDetails', JSON.stringify({
          ...cardDetails,
          number: maskedNumber,
          lastFourDigits
        }));
      }
    } catch (error) {
      console.error('Error saving card details:', error);
    }
  };
  
  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      Alert.alert('Information manquante', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    if (useCardGuarantee && showCardForm && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name)) {
      Alert.alert('Information de carte manquante', 'Veuillez remplir tous les champs de la carte de crédit.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (useCardGuarantee && showCardForm) {
        await saveCardDetails();
      }
      
      const reservationData = {
        restaurant_id: restaurant.id,
        user_id: user?.id,
        date,
        time,
        party_size: partySize,
        name,
        phone,
        email,
        special_requests: specialRequests,
        is_group_reservation: isGroupReservation,
        group_name: isGroupReservation ? groupName : null,
        has_card_guarantee: useCardGuarantee,
        card_last_four: useCardGuarantee ? cardDetails.number.slice(-4) : null,
        send_sms_confirmation: sendSmsConfirmation,
        send_email_confirmation: sendEmailConfirmation,
        status: 'confirmed'
      };
      
      let result;
      
      if (existingReservation) {
        result = await updateReservation(existingReservation.id, reservationData);
      } else {
        result = await createReservation(reservationData);
        
        // Add loyalty points for new reservation
        if (result && user) {
          dispatch(addPoints({
            points: 100,
            transaction: {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              description: `Réservation chez ${restaurant.name}`,
              points: 100,
              type: 'earned',
              restaurantId: restaurant.id,
              restaurantName: restaurant.name
            }
          }));
        }
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess(result);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCardNumber = (text) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };
  
  const formatCardExpiry = (text) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom complet *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Votre nom complet"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Votre numéro de téléphone"
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Votre adresse email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Détails de la réservation</Text>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{date}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{partySize} {partySize > 1 ? 'personnes' : 'personne'}</Text>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Demandes spéciales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder="Allergies, occasions spéciales, préférences de table..."
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Réservation de groupe</Text>
          <Switch
            value={isGroupReservation}
            onValueChange={setIsGroupReservation}
            trackColor={{ false: '#d1d1d1', true: '#E3735E' }}
            thumbColor={isGroupReservation ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {isGroupReservation && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom du groupe</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Nom de votre groupe ou événement"
            />
          </View>
        )}
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Garantie et confirmations</Text>
        
        <View style={styles.switchContainer}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Garantir avec carte de crédit</Text>
            <Pressable onPress={() => Alert.alert(
              'Garantie par carte de crédit',
              'Votre carte ne sera débitée qu\'en cas d\'annulation tardive (moins de 24h avant) ou de non-présentation. Cela permet de garantir votre réservation et d\'éviter les no-shows.'
            )}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
            </Pressable>
          </View>
          <Switch
            value={useCardGuarantee}
            onValueChange={(value) => {
              setUseCardGuarantee(value);
              if (value) {
                setShowCardForm(true);
              }
            }}
            trackColor={{ false: '#d1d1d1', true: '#E3735E' }}
            thumbColor={useCardGuarantee ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {useCardGuarantee && showCardForm && (
          <View style={styles.cardFormContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de carte</Text>
              <TextInput
                style={styles.input}
                value={cardDetails.number}
                onChangeText={(text) => setCardDetails({...cardDetails, number: formatCardNumber(text)})}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
              />
            </View>
            
            <View style={styles.cardDetailsRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Date d'expiration</Text>
                <TextInput
                  style={styles.input}
                  value={cardDetails.expiry}
                  onChangeText={(text) => setCardDetails({...cardDetails, expiry: formatCardExpiry(text)})}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>CVC</Text>
                <TextInput
                  style={styles.input}
                  value={cardDetails.cvc}
                  onChangeText={(text) => setCardDetails({...cardDetails, cvc: text.replace(/\D/g, '')})}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom sur la carte</Text>
              <TextInput
                style={styles.input}
                value={cardDetails.name}
                onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
                placeholder="NOM PRÉNOM"
                autoCapitalize="characters"
              />
            </View>
          </View>
        )}
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Confirmation par SMS</Text>
          <Switch
            value={sendSmsConfirmation}
            onValueChange={setSendSmsConfirmation}
            trackColor={{ false: '#d1d1d1', true: '#E3735E' }}
            thumbColor={sendSmsConfirmation ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Confirmation par email</Text>
          <Switch
            value={sendEmailConfirmation}
            onValueChange={setSendEmailConfirmation}
            trackColor={{ false: '#d1d1d1', true: '#E3735E' }}
            thumbColor={sendEmailConfirmation ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          En confirmant cette réservation, vous acceptez nos conditions générales et notre politique d'annulation. Une annulation moins de 24h avant la réservation ou une non-présentation pourra entraîner des frais.
        </Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
        
        <Pressable
          style={[styles.button, styles.confirmButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {existingReservation ? 'Modifier' : 'Réserver'}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  reservationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 8,
  },
  cardFormContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#E3735E',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BookingForm;
