import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  allergens?: string[];
  spicyLevel?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function MenuManagement() {
  const [categories, setCategories] = useState<MenuCategory[]>([
    {
      id: '1',
      name: 'Starters',
      items: [
        { 
          id: '1', 
          name: 'Tunisian Brik', 
          price: 8, 
          description: 'Crispy pastry filled with egg and tuna',
          isAvailable: true,
          allergens: ['Eggs', 'Fish'],
          isHalal: true
        },
        { 
          id: '2', 
          name: 'Mechouia', 
          price: 10, 
          description: 'Grilled vegetable salad with tuna',
          isAvailable: true,
          isVegetarian: true,
          spicyLevel: 2
        }
      ]
    },
    {
      id: '2',
      name: 'Main Courses',
      items: [
        { 
          id: '3', 
          name: 'Couscous Royal', 
          price: 25, 
          description: 'Traditional couscous with lamb and vegetables',
          isAvailable: true,
          isHalal: true,
          spicyLevel: 1
        },
        { 
          id: '4', 
          name: 'Grilled Sea Bass', 
          price: 30, 
          description: 'Fresh sea bass with saffron sauce',
          isAvailable: true,
          allergens: ['Fish'],
          isGlutenFree: true
        }
      ]
    }
  ]);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [menuImage, setMenuImage] = useState<string | null>(null);
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

        const { data: { publicUrl } } = supabase.storage
          .from('menu-photos')
          .getPublicUrl(fileName);

        setTimeout(() => {
          setProcessing(false);
          Alert.alert('Success', 'Menu photo uploaded successfully');
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setProcessing(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory('new');
  };

  const handleSaveCategory = (name: string) => {
    if (editingCategory === 'new') {
      const newCategory: MenuCategory = {
        id: Date.now().toString(),
        name,
        items: []
      };
      setCategories([...categories, newCategory]);
    } else if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory ? { ...cat, name } : cat
      ));
    }
    setEditingCategory(null);
  };

  const handleAddItem = (categoryId: string) => {
    setShowAddItem(categoryId);
    setEditingItem({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      isAvailable: true,
    });
  };

  const handleSaveItem = (categoryId: string) => {
    if (!editingItem) return;

    if (showAddItem) {
      setCategories(categories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          items: [...cat.items, editingItem]
        } : cat
      ));
    } else {
      setCategories(categories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          items: cat.items.map(item => 
            item.id === editingItem.id ? editingItem : item
          )
        } : cat
      ));
    }
    setEditingItem(null);
    setShowAddItem(null);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCategories(categories.map(cat => 
              cat.id === categoryId ? {
                ...cat,
                items: cat.items.filter(item => item.id !== itemId)
              } : cat
            ));
          }
        }
      ]
    );
  };

  const renderItemForm = (item: MenuItem, categoryId: string) => (
    <View style={styles.itemForm}>
      <TextInput
        style={styles.input}
        value={item.name}
        onChangeText={(text) => setEditingItem({ ...item, name: text })}
        placeholder="Item name"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={item.description}
        onChangeText={(text) => setEditingItem({ ...item, description: text })}
        placeholder="Description"
        multiline
      />
      <TextInput
        style={styles.input}
        value={item.price.toString()}
        onChangeText={(text) => setEditingItem({ ...item, price: parseFloat(text) || 0 })}
        placeholder="Price"
        keyboardType="numeric"
      />

      <View style={styles.togglesContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available</Text>
          <Pressable
            style={[styles.toggle, item.isAvailable && styles.toggleActive]}
            onPress={() => setEditingItem({ ...item, isAvailable: !item.isAvailable })}
          >
            <Ionicons
              name={item.isAvailable ? "checkmark" : "close"}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Vegetarian</Text>
          <Pressable
            style={[styles.toggle, item.isVegetarian && styles.toggleActive]}
            onPress={() => setEditingItem({ ...item, isVegetarian: !item.isVegetarian })}
          >
            <Ionicons
              name={item.isVegetarian ? "leaf" : "leaf-outline"}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Halal</Text>
          <Pressable
            style={[styles.toggle, item.isHalal && styles.toggleActive]}
            onPress={() => setEditingItem({ ...item, isHalal: !item.isHalal })}
          >
            <Ionicons
              name={item.isHalal ? "moon" : "moon-outline"}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.spicyLevel}>
        <Text style={styles.spicyLabel}>Spicy Level:</Text>
        <View style={styles.spicyButtons}>
          {[0, 1, 2, 3].map((level) => (
            <Pressable
              key={level}
              style={[
                styles.spicyButton,
                item.spicyLevel === level && styles.spicyButtonActive
              ]}
              onPress={() => setEditingItem({ ...item, spicyLevel: level })}
            >
              <Text style={styles.spicyButtonText}>
                {level === 0 ? 'None' : '🌶️'.repeat(level)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.formButtons}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setEditingItem(null);
            setShowAddItem(null);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.saveButton]}
          onPress={() => handleSaveItem(categoryId)}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );

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
          <Pressable style={styles.addButton} onPress={handleAddCategory}>
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
          {editingCategory === category.id ? (
            <View style={styles.categoryEditForm}>
              <TextInput
                style={styles.categoryInput}
                value={category.name}
                onChangeText={(text) => handleSaveCategory(text)}
                placeholder="Category name"
                autoFocus
              />
            </View>
          ) : (
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <Pressable
                style={styles.categoryAddButton}
                onPress={() => handleAddItem(category.id)}
              >
                <Ionicons name="add-circle-outline" size={24} color="#E3735E" />
                <Text style={styles.categoryAddText}>Add Item</Text>
              </Pressable>
            </View>
          )}

          {category.items.map((item) => (
            <View key={item.id}>
              {editingItem?.id === item.id ? (
                renderItemForm(editingItem, category.id)
              ) : (
                <View style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.itemBadges}>
                        {!item.isAvailable && (
                          <View style={[styles.badge, styles.unavailableBadge]}>
                            <Text style={styles.badgeText}>Unavailable</Text>
                          </View>
                        )}
                        {item.isVegetarian && (
                          <View style={[styles.badge, styles.vegetarianBadge]}>
                            <Ionicons name="leaf" size={16} color="#fff" />
                          </View>
                        )}
                        {item.isHalal && (
                          <View style={[styles.badge, styles.halalBadge]}>
                            <Ionicons name="moon" size={16} color="#fff" />
                          </View>
                        )}
                        {item.spicyLevel > 0 && (
                          <View style={[styles.badge, styles.spicyBadge]}>
                            <Text style={styles.badgeText}>
                              {'🌶️'.repeat(item.spicyLevel)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>{item.price} TND</Text>
                  </View>
                  <View style={styles.menuItemActions}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => setEditingItem(item)}
                    >
                      <Ionicons name="create-outline" size={20} color="#2196F3" />
                    </Pressable>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleDeleteItem(category.id, item.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#dc3545" />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          ))}

          {showAddItem === category.id && editingItem && (
            renderItemForm(editingItem, category.id)
          )}
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
  categoryEditForm: {
    marginBottom: 15,
  },
  categoryInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  itemBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unavailableBadge: {
    backgroundColor: '#dc3545',
  },
  vegetarianBadge: {
    backgroundColor: '#4CAF50',
  },
  halalBadge: {
    backgroundColor: '#2196F3',
  },
  spicyBadge: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
  itemForm: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  togglesContainer: {
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#666',
  },
  toggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  spicyLevel: {
    marginBottom: 15,
  },
  spicyLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  spicyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spicyButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  spicyButtonActive: {
    backgroundColor: '#FF9800',
  },
  spicyButtonText: {
    color: '#666',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});