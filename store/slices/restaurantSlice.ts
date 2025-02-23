import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  description: string;
  address: string;
  hours: string;
  phone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  menu: {
    category: string;
    items: {
      name: string;
      price: number;
      description: string;
    }[];
  }[];
}

interface RestaurantState {
  restaurants: Restaurant[];
  featured: Restaurant[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  featured: [],
  status: 'idle',
  error: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async () => {
    // Simulate API call
    return [
      {
        id: '1',
        name: 'Le Baroque',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        cuisine: 'Mediterranean, Tunisian',
        rating: 4.8,
        priceRange: '₪₪₪',
        description: 'Experience the finest Mediterranean and Tunisian cuisine in an elegant setting.',
        address: '15 Avenue Habib Bourguiba, Tunis',
        hours: '12:00 PM - 11:00 PM',
        phone: '+216 71 123 456',
        coordinates: {
          latitude: 36.7992,
          longitude: 10.1802,
        },
        menu: [
          {
            category: 'Starters',
            items: [
              { name: 'Tunisian Brik', price: 8, description: 'Crispy pastry filled with egg and tuna' },
              { name: 'Mechouia', price: 10, description: 'Grilled vegetable salad with tuna' }
            ]
          },
          {
            category: 'Main Courses',
            items: [
              { name: 'Couscous Royal', price: 25, description: 'Traditional couscous with lamb and vegetables' },
              { name: 'Grilled Sea Bass', price: 30, description: 'Fresh sea bass with saffron sauce' }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Dar El Jeld',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
        cuisine: 'Traditional Tunisian',
        rating: 4.9,
        priceRange: '₪₪₪₪',
        description: 'Housed in a historic building, offering authentic Tunisian cuisine.',
        address: '5-10 Rue Dar El Jeld, Medina of Tunis',
        hours: '12:30 PM - 10:30 PM',
        phone: '+216 71 987 654',
        coordinates: {
          latitude: 36.7982,
          longitude: 10.1712,
        },
        menu: [
          {
            category: 'Starters',
            items: [
              { name: 'Slata Tounsia', price: 12, description: 'Traditional Tunisian salad' },
              { name: 'Harissa Prawns', price: 15, description: 'Spicy grilled prawns' }
            ]
          },
          {
            category: 'Main Courses',
            items: [
              { name: 'Tajine Zeitoun', price: 28, description: 'Lamb with olives and preserved lemons' },
              { name: 'Samak Meshwi', price: 32, description: 'Grilled fish with chermoula' }
            ]
          }
        ]
      }
    ];
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.restaurants = action.payload;
        state.featured = action.payload.filter(r => r.rating >= 4.5);
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch restaurants';
      });
  },
});

export default restaurantSlice.reducer;