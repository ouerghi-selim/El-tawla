import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { createReservation } from '../store/slices/reservationSlice';
import type { AppDispatch } from '../store';

interface BookingFormProps {
  restaurantId: string;
  restaurantName: string;
  onSuccess: () => void;
}

export default function BookingForm({ restaurantId, restaurantName, onSuccess }: BookingFormProps) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const dispatch = useDispatch<AppDispatch>();

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const handleBooking = async () => {
    try {
      await dispatch(createReservation({
        restaurantId,
        restaurantName,
        date: date.toISOString(),
        time,
        guests
      })).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Number of Guests</Text>
        <View style={styles.guestCounter}>
          <Pressable
            style={styles.counterButton}
            onPress={() => setGuests(Math.max(1, guests - 1))}
          >
            <Ionicons name="remove" size={24} color="#E3735E" />
          </Pressable>
          <Text style={styles.guestCount}>{guests}</Text>
          <Pressable
            style={styles.counterButton}
            onPress={() => setGuests(Math.min(10, guests + 1))}
          >
            <Ionicons name="add" size={24} color="#E3735E" />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timeSlots}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot}
                style={[
                  styles.timeSlot,
                  time === slot && styles.selectedTimeSlot
                ]}
                onPress={() => setTime(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    time === slot && styles.selectedTimeSlotText
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateSlots}>
            {[...Array(7)].map((_, index) => {
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() + index);
              const isSelected = date.toDateString() === currentDate.toDateString();

              return (
                <Pressable
                  key={index}
                  style={[
                    styles.dateSlot,
                    isSelected && styles.selectedDateSlot
                  ]}
                  onPress={() => setDate(currentDate)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.selectedDateText
                    ]}
                  >
                    {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.selectedDateText
                    ]}
                  >
                    {currentDate.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <Pressable style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirm Reservation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestCount: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    color: '#1a1a1a',
  },
  timeSlots: {
    flexDirection: 'row',
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  selectedTimeSlot: {
    backgroundColor: '#E3735E',
  },
  timeSlotText: {
    color: '#666',
    fontSize: 16,
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  dateSlots: {
    flexDirection: 'row',
  },
  dateSlot: {
    width: 70,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    alignItems: 'center',
  },
  selectedDateSlot: {
    backgroundColor: '#E3735E',
  },
  dateDay: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  selectedDateText: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#E3735E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});