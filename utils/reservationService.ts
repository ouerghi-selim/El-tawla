import { supabase } from './supabase';

export const createReservation = async (reservationData) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Si la réservation a une garantie par carte, enregistrer les détails de manière sécurisée
    if (reservationData.has_card_guarantee && reservationData.card_last_four) {
      await supabase
        .from('payment_guarantees')
        .insert([{
          reservation_id: data.id,
          card_last_four: reservationData.card_last_four,
          status: 'active'
        }]);
    }
    
    // Envoyer les confirmations si demandées
    if (reservationData.send_sms_confirmation) {
      await sendSmsConfirmation(data);
    }
    
    if (reservationData.send_email_confirmation) {
      await sendEmailConfirmation(data);
    }
    
    // Mettre à jour la disponibilité des tables
    await updateTableAvailability(
      reservationData.restaurant_id,
      reservationData.date,
      reservationData.time,
      reservationData.party_size
    );
    
    return data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservation = async (reservationId, reservationData) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(reservationData)
      .eq('id', reservationId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Mettre à jour les détails de garantie par carte si nécessaire
    if (reservationData.has_card_guarantee !== undefined) {
      if (reservationData.has_card_guarantee && reservationData.card_last_four) {
        // Vérifier si une garantie existe déjà
        const { data: existingGuarantee } = await supabase
          .from('payment_guarantees')
          .select()
          .eq('reservation_id', reservationId)
          .single();
        
        if (existingGuarantee) {
          // Mettre à jour la garantie existante
          await supabase
            .from('payment_guarantees')
            .update({ card_last_four: reservationData.card_last_four })
            .eq('reservation_id', reservationId);
        } else {
          // Créer une nouvelle garantie
          await supabase
            .from('payment_guarantees')
            .insert([{
              reservation_id: reservationId,
              card_last_four: reservationData.card_last_four,
              status: 'active'
            }]);
        }
      } else if (!reservationData.has_card_guarantee) {
        // Supprimer la garantie si elle existe
        await supabase
          .from('payment_guarantees')
          .delete()
          .eq('reservation_id', reservationId);
      }
    }
    
    // Envoyer des notifications de mise à jour si demandées
    if (reservationData.send_sms_confirmation) {
      await sendSmsUpdateNotification(data);
    }
    
    if (reservationData.send_email_confirmation) {
      await sendEmailUpdateNotification(data);
    }
    
    // Mettre à jour la disponibilité des tables si nécessaire
    if (
      reservationData.date !== undefined ||
      reservationData.time !== undefined ||
      reservationData.party_size !== undefined
    ) {
      await updateTableAvailability(
        data.restaurant_id,
        data.date,
        data.time,
        data.party_size
      );
    }
    
    return data;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

export const cancelReservation = async (reservationId) => {
  try {
    // Récupérer les informations de la réservation avant annulation
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Calculer si l'annulation est tardive (moins de 24h avant)
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const hoursDifference = (reservationDateTime - now) / (1000 * 60 * 60);
    const isLateCancel = hoursDifference < 24;
    
    // Mettre à jour le statut de la réservation
    const { data, error } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        cancellation_time: new Date().toISOString(),
        late_cancellation: isLateCancel
      })
      .eq('id', reservationId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Si annulation tardive et garantie par carte, appliquer les frais
    if (isLateCancel && reservation.has_card_guarantee) {
      await supabase
        .from('payment_guarantees')
        .update({
          status: 'charged',
          charge_amount: 10.00, // Frais d'annulation tardive en dinars tunisiens
          charge_time: new Date().toISOString(),
          charge_reason: 'Annulation tardive'
        })
        .eq('reservation_id', reservationId);
    }
    
    // Envoyer des notifications d'annulation
    if (reservation.send_sms_confirmation) {
      await sendSmsCancellationNotification(data);
    }
    
    if (reservation.send_email_confirmation) {
      await sendEmailCancellationNotification(data);
    }
    
    // Libérer la table
    await releaseTableAvailability(
      reservation.restaurant_id,
      reservation.date,
      reservation.time,
      reservation.party_size
    );
    
    return data;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
};

export const getAvailableTables = async (restaurantId, date, time, partySize) => {
  try {
    // Récupérer toutes les tables du restaurant
    const { data: allTables, error: tablesError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .gte('capacity', partySize)
      .order('capacity', { ascending: true });
    
    if (tablesError) throw tablesError;
    
    // Récupérer les réservations existantes pour cette date et heure
    const { data: existingReservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('date', date)
      .eq('status', 'confirmed')
      .or(`time.eq.${time},time.eq.${getTimeMinusHour(time)},time.eq.${getTimePlusHour(time)}`);
    
    if (reservationsError) throw reservationsError;
    
    // Identifier les tables déjà réservées
    const reservedTableIds = existingReservations.map(res => res.table_id).filter(id => id);
    
    // Filtrer les tables disponibles
    const availableTables = allTables.filter(table => !reservedTableIds.includes(table.id));
    
    return availableTables;
  } catch (error) {
    console.error('Error getting available tables:', error);
    throw error;
  }
};

// Fonctions utilitaires

const getTimeMinusHour = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newHours = hours - 1 < 0 ? 23 : hours - 1;
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getTimePlusHour = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newHours = hours + 1 > 23 ? 0 : hours + 1;
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const updateTableAvailability = async (restaurantId, date, time, partySize) => {
  try {
    // Trouver une table disponible appropriée
    const availableTables = await getAvailableTables(restaurantId, date, time, partySize);
    
    if (availableTables.length === 0) {
      throw new Error('Aucune table disponible pour cette réservation');
    }
    
    // Choisir la table la plus adaptée (la plus petite qui peut accueillir le groupe)
    const selectedTable = availableTables[0];
    
    // Mettre à jour la réservation avec l'ID de la table
    const { data, error } = await supabase
      .from('reservations')
      .update({ table_id: selectedTable.id })
      .eq('restaurant_id', restaurantId)
      .eq('date', date)
      .eq('time', time)
      .eq('party_size', partySize)
      .eq('status', 'confirmed')
      .is('table_id', null);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating table availability:', error);
    throw error;
  }
};

const releaseTableAvailability = async (restaurantId, date, time, partySize) => {
  try {
    // Libérer la table en supprimant l'association avec la réservation
    const { data, error } = await supabase
      .from('reservations')
      .update({ table_id: null })
      .eq('restaurant_id', restaurantId)
      .eq('date', date)
      .eq('time', time)
      .eq('party_size', partySize)
      .not('table_id', 'is', null);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error releasing table availability:', error);
    throw error;
  }
};

// Fonctions de notification (à implémenter avec un service réel)

const sendSmsConfirmation = async (reservation) => {
  // Intégration avec un service SMS comme Twilio ou OVH SMS
  console.log(`SMS de confirmation envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};

const sendEmailConfirmation = async (reservation) => {
  // Intégration avec un service d'email comme SendGrid ou Mailjet
  console.log(`Email de confirmation envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};

const sendSmsUpdateNotification = async (reservation) => {
  console.log(`SMS de mise à jour envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};

const sendEmailUpdateNotification = async (reservation) => {
  console.log(`Email de mise à jour envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};

const sendSmsCancellationNotification = async (reservation) => {
  console.log(`SMS d'annulation envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};

const sendEmailCancellationNotification = async (reservation) => {
  console.log(`Email d'annulation envoyé pour la réservation ${reservation.id}`);
  // Implémentation réelle à ajouter
};
