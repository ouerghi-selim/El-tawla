import { supabase } from '../supabase/client';

export const getRestaurantDetails = async (restaurantId) => {
  try {
    // Récupérer les informations de base du restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select(`
        *,
        reviews (*)
      `)
      .eq('id', restaurantId)
      .single();
    
    if (restaurantError) throw restaurantError;
    
    // Calculer la note moyenne
    const reviews = restaurant.reviews || [];
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    
    // Récupérer les horaires d'ouverture
    const { data: openingHours, error: hoursError } = await supabase
      .from('restaurant_opening_hours')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('day_order', { ascending: true });
    
    if (hoursError) throw hoursError;
    
    // Récupérer les types de cuisine
    const { data: cuisineTypes, error: cuisineError } = await supabase
      .from('restaurant_cuisine_types')
      .select('cuisine_type')
      .eq('restaurant_id', restaurantId);
    
    if (cuisineError) throw cuisineError;
    
    // Récupérer les spécialités
    const { data: specialties, error: specialtiesError } = await supabase
      .from('restaurant_specialties')
      .select('name')
      .eq('restaurant_id', restaurantId);
    
    if (specialtiesError) throw specialtiesError;
    
    // Construire l'objet restaurant complet
    return {
      ...restaurant,
      average_rating: averageRating,
      opening_hours: openingHours || [],
      cuisine_types: cuisineTypes ? cuisineTypes.map(c => c.cuisine_type) : [],
      specialties: specialties ? specialties.map(s => s.name) : [],
    };
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    throw error;
  }
};

export const getRestaurantMenu = async (restaurantId) => {
  try {
    // Récupérer les catégories de menu
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });
    
    if (categoriesError) throw categoriesError;
    
    if (!categories || categories.length === 0) {
      return [];
    }
    
    // Pour chaque catégorie, récupérer les plats
    const menuWithItems = await Promise.all(
      categories.map(async (category) => {
        const { data: items, error: itemsError } = await supabase
          .from('menu_items')
          .select(`
            *,
            menu_item_allergens (
              allergen_name
            )
          `)
          .eq('category_id', category.id)
          .order('display_order', { ascending: true });
        
        if (itemsError) throw itemsError;
        
        // Transformer les données des plats
        const transformedItems = items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          allergens: item.menu_item_allergens 
            ? item.menu_item_allergens.map(a => a.allergen_name) 
            : [],
          is_vegetarian: item.is_vegetarian,
          is_vegan: item.is_vegan,
          is_gluten_free: item.is_gluten_free,
          is_spicy: item.is_spicy,
          image_url: item.image_url
        }));
        
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          items: transformedItems
        };
      })
    );
    
    return menuWithItems;
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    throw error;
  }
};

export const getRestaurantPhotos = async (restaurantId) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_photos')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching restaurant photos:', error);
    throw error;
  }
};

export const searchRestaurants = async (params) => {
  try {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        reviews (rating)
      `);
    
    // Filtrer par ville
    if (params.city) {
      query = query.ilike('city', `%${params.city}%`);
    }
    
    // Filtrer par type de cuisine
    if (params.cuisineType) {
      query = query.eq('restaurant_cuisine_types.cuisine_type', params.cuisineType)
        .not('restaurant_cuisine_types.id', 'is', null);
    }
    
    // Filtrer par niveau de prix
    if (params.priceLevel) {
      query = query.eq('price_level', params.priceLevel);
    }
    
    // Filtrer par disponibilité
    if (params.date && params.time && params.partySize) {
      // Cette partie est complexe et nécessiterait une fonction RPC côté Supabase
      // pour vérifier la disponibilité des tables
      query = query.filter('available_for_booking', 'eq', true);
    }
    
    // Filtrer par caractéristiques
    if (params.features) {
      params.features.forEach(feature => {
        query = query.eq(feature, true);
      });
    }
    
    // Trier les résultats
    if (params.sortBy === 'rating') {
      // Tri par note moyenne (nécessite un calcul côté client)
      // Le tri sera appliqué après récupération des données
    } else if (params.sortBy === 'distance') {
      // Tri par distance (nécessite des coordonnées géographiques)
      // Le tri sera appliqué après récupération des données
    } else {
      // Tri par pertinence par défaut
      query = query.order('name', { ascending: true });
    }
    
    // Exécuter la requête
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculer la note moyenne pour chaque restaurant
    const restaurantsWithRating = data.map(restaurant => {
      const reviews = restaurant.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      return {
        ...restaurant,
        average_rating: averageRating
      };
    });
    
    // Appliquer le tri par note si nécessaire
    if (params.sortBy === 'rating') {
      restaurantsWithRating.sort((a, b) => b.average_rating - a.average_rating);
    }
    
    return restaurantsWithRating;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

export const getPopularRestaurants = async (limit = 10) => {
  try {
    // Récupérer les restaurants avec le plus grand nombre de réservations
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        reviews (rating),
        reservations (id)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Calculer la note moyenne et le nombre de réservations pour chaque restaurant
    const restaurantsWithStats = data.map(restaurant => {
      const reviews = restaurant.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      const reservationCount = restaurant.reservations ? restaurant.reservations.length : 0;
      
      return {
        ...restaurant,
        average_rating: averageRating,
        reservation_count: reservationCount,
        reviews: undefined, // Supprimer les données brutes des avis
        reservations: undefined // Supprimer les données brutes des réservations
      };
    });
    
    // Trier par nombre de réservations
    restaurantsWithStats.sort((a, b) => b.reservation_count - a.reservation_count);
    
    return restaurantsWithStats;
  } catch (error) {
    console.error('Error fetching popular restaurants:', error);
    throw error;
  }
};

export const getRestaurantsBySpecialty = async (specialty, limit = 10) => {
  try {
    // Récupérer les restaurants avec une spécialité spécifique
    const { data, error } = await supabase
      .from('restaurant_specialties')
      .select(`
        restaurant_id,
        restaurants (
          *,
          reviews (rating)
        )
      `)
      .eq('name', specialty)
      .limit(limit);
    
    if (error) throw error;
    
    // Transformer les données
    const restaurants = data.map(item => {
      const restaurant = item.restaurants;
      const reviews = restaurant.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      return {
        ...restaurant,
        average_rating: averageRating,
        reviews: undefined // Supprimer les données brutes des avis
      };
    });
    
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants by specialty:', error);
    throw error;
  }
};

export const getLocalSpecialties = async () => {
  try {
    // Récupérer les spécialités tunisiennes les plus populaires
    const { data, error } = await supabase
      .from('restaurant_specialties')
      .select(`
        name,
        count
      `)
      .eq('is_local', true)
      .order('count', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching local specialties:', error);
    throw error;
  }
};
