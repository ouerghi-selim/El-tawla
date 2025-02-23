import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabase';

export default function MenuManagement() {
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Starters',
      items: [
        { id: '1', name: 'Tunisian Brik', price: 8, description: 'Crispy pastry filled with egg and tuna' },
        { id: '2', name: 'Mechouia', price: 10, description: 'Grilled vegetable salad with tuna' }
      ]
    },
    {
      id: '2',
      name: 'Main Courses',
      items: [
        { id: '3', name: 'Couscous Royal', price: 25, description: 'Traditional couscous with lamb and vegetables' },
        { id: '4', name: 'Grilled Sea Bass', price: 30, description: 'Fresh sea bass with saffron sauce' }
      ]
    }
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [menuImage, setMenuImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = async () => {
    try {
      setError('');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setProcessing(true);
        const imageUri = result.assets[0].uri;
        setMenuImage(imageUri);

        // Upload image to Supabase Storage
        const fileName = `menu-${Date.now()}.jpg`;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        const { data, error: uploadError } = await supabase.storage
          .from('menu-photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('menu-photos')
          .getPublicUrl(fileName);

        // Here you would typically call your menu text detection API
        // For now, we'll simulate processing with a timeout
        setTimeout(() => {
          setProcessing(false);
          // Add detected items to the menu
          const newItems = [
            { id: Date.now().toString(), name: 'Detected Item', price: 0, description: 'Please edit details' }
          ];
          
          setCategories(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              name: 'New Items',
              items: newItems
            }
          ]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <View style={styles.headerButtons}>
          <Pressable 
            style={[styles.uploadButton, processing && styles.processingButton]}
            onPress={handleImageUpload}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Upload Menu Photo</Text>
              </>
            )}
          </Pressable>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Category</Text>
          </Pressable>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {menuImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: menuImage }} style={styles.previewImage} />
          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.processingText}>Processing menu items...</Text>
            </View>
          )}
        </View>
      )}

      {categories.map((category) => (
        <View key={category.id} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Pressable style={styles.categoryAddButton}>
              <Ionicons name="add-circle-outline" size={24} color="#E3735E" />
              <Text style={styles.categoryAddText}>Add Item</Text>
            </Pressable>
          </View>

          {category.items.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price} TND</Text>
              </View>
              <View style={styles.menuItemActions}>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color="#2196F3" />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#dc3545" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  processingButton: {
    backgroundColor: '#666',
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3735E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  errorContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 10,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
  },
  imagePreview: {
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  categorySection: {
    marginBottom: 20,
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAddText: {
    color: '#E3735E',
    marginLeft: 5,
    fontWeight: '500',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#E3735E',
    fontWeight: '500',
    marginTop: 4,
  },
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});