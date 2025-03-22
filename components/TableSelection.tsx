import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';

import { getAvailableTables } from '../utils/reservationService';

const TableSelection = ({ 
  restaurant, 
  date, 
  time, 
  partySize, 
  onTableSelected, 
  onCancel 
}) => {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadAvailableTables();
  }, [restaurant, date, time, partySize]);
  
  const loadAvailableTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const availableTables = await getAvailableTables(
        restaurant.id,
        date,
        time,
        partySize
      );
      
      setTables(availableTables);
      
      // Sélectionner automatiquement la première table si disponible
      if (availableTables.length > 0) {
        setSelectedTableId(availableTables[0].id);
      }
    } catch (err) {
      console.error('Error loading tables:', err);
      setError('Impossible de charger les tables disponibles');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId);
    Haptics.selectionAsync();
  };
  
  const handleConfirm = () => {
    if (selectedTableId) {
      const selectedTable = tables.find(table => table.id === selectedTableId);
      onTableSelected(selectedTable);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E3735E" />
        <Text style={styles.loadingText}>Chargement des tables disponibles...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#E3735E" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={loadAvailableTables}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }
  
  if (tables.length === 0) {
    return (
      <View style={styles.noTablesContainer}>
        <Ionicons name="calendar-outline" size={48} color="#666" />
        <Text style={styles.noTablesTitle}>Aucune table disponible</Text>
        <Text style={styles.noTablesText}>
          Désolé, il n'y a pas de tables disponibles pour {partySize} {partySize > 1 ? 'personnes' : 'personne'} à {time} le {date}.
        </Text>
        <Text style={styles.noTablesSubtext}>
          Essayez un autre horaire ou une autre date.
        </Text>
        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Retour</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez votre table</Text>
      
      <View style={styles.detailsContainer}>
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
      
      <ScrollView style={styles.tablesContainer}>
        {tables.map(table => (
          <Pressable
            key={table.id}
            style={[
              styles.tableItem,
              selectedTableId === table.id && styles.selectedTableItem
            ]}
            onPress={() => handleTableSelect(table.id)}
          >
            <View style={styles.tableInfo}>
              <Text style={styles.tableNumber}>Table {table.table_number}</Text>
              <Text style={styles.tableCapacity}>
                Capacité: {table.capacity} {table.capacity > 1 ? 'personnes' : 'personne'}
              </Text>
              {table.location && (
                <Text style={styles.tableLocation}>{table.location}</Text>
              )}
            </View>
            
            {selectedTableId === table.id && (
              <Ionicons name="checkmark-circle" size={24} color="#E3735E" />
            )}
          </Pressable>
        ))}
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.button, 
            styles.confirmButton,
            !selectedTableId && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedTableId}
        >
          <Text style={styles.confirmButtonText}>Confirmer</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#E3735E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noTablesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  noTablesTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  noTablesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noTablesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  tablesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  tableItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTableItem: {
    borderWidth: 2,
    borderColor: '#E3735E',
  },
  tableInfo: {
    flex: 1,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tableCapacity: {
    fontSize: 14,
    color: '#666',
  },
  tableLocation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  disabledButton: {
    backgroundColor: '#ccc',
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

export default TableSelection;
