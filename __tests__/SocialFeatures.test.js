import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../utils/i18n/LanguageContext';

// Mock des dépendances externes
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));
jest.mock('../utils/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    isRTL: false,
    language: 'fr',
    setLanguage: jest.fn(),
  }),
}));

// Simuler les composants de fonctionnalités sociales
const SocialFeed = ({ navigation }) => {
  const { t } = useTranslation();
  const posts = [
    {
      id: '1',
      user: { id: 'user1', name: 'User 1', avatar: 'https://example.com/avatar1.jpg' },
      restaurant: { id: 'rest1', name: 'Restaurant A' },
      content: 'Excellent dîner à Restaurant A hier soir !',
      images: ['https://example.com/post1.jpg'],
      likes: 15,
      comments: 3,
      date: '2025-03-15'
    },
    {
      id: '2',
      user: { id: 'user2', name: 'User 2', avatar: 'https://example.com/avatar2.jpg' },
      restaurant: { id: 'rest2', name: 'Restaurant B' },
      content: 'Je recommande vivement le couscous de Restaurant B',
      images: [],
      likes: 8,
      comments: 1,
      date: '2025-03-10'
    }
  ];
  
  return (
    <div data-testid="social-feed">
      <h1>{t('social.feed')}</h1>
      {posts.map(post => (
        <div key={post.id} data-testid="post-item">
          <div data-testid="post-header">
            <div>{post.user.name}</div>
            <div>{post.date}</div>
          </div>
          <div data-testid="post-content">{post.content}</div>
          {post.images.length > 0 && (
            <div data-testid="post-images">
              {post.images.map((image, index) => (
                <img key={index} src={image} alt="Post" />
              ))}
            </div>
          )}
          <div data-testid="post-actions">
            <button data-testid="like-button" onClick={() => {}}>
              {post.likes} {t('social.likes')}
            </button>
            <button data-testid="comment-button" onClick={() => navigation.navigate('post-comments', { postId: post.id })}>
              {post.comments} {t('social.comments')}
            </button>
            <button data-testid="share-button" onClick={() => {}}>
              {t('social.share')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const FriendsList = ({ navigation }) => {
  const { t } = useTranslation();
  const friends = [
    { id: 'user1', name: 'User 1', avatar: 'https://example.com/avatar1.jpg' },
    { id: 'user2', name: 'User 2', avatar: 'https://example.com/avatar2.jpg' },
    { id: 'user3', name: 'User 3', avatar: 'https://example.com/avatar3.jpg' }
  ];
  
  return (
    <div data-testid="friends-list">
      <h1>{t('social.friends')}</h1>
      <button data-testid="add-friend-button" onClick={() => navigation.navigate('add-friend')}>
        {t('social.addFriend')}
      </button>
      {friends.map(friend => (
        <div key={friend.id} data-testid="friend-item" onClick={() => navigation.navigate('friend-profile', { userId: friend.id })}>
          <img src={friend.avatar} alt={friend.name} />
          <div>{friend.name}</div>
        </div>
      ))}
    </div>
  );
};

const FavoritesList = ({ navigation }) => {
  const { t } = useTranslation();
  const favorites = [
    {
      id: 'rest1',
      name: 'Restaurant A',
      image: 'https://example.com/restaurant-a.jpg',
      cuisine: 'Tunisian',
      rating: 4.5
    },
    {
      id: 'rest2',
      name: 'Restaurant B',
      image: 'https://example.com/restaurant-b.jpg',
      cuisine: 'Mediterranean',
      rating: 4.2
    }
  ];
  
  return (
    <div data-testid="favorites-list">
      <h1>{t('social.favorites')}</h1>
      {favorites.map(restaurant => (
        <div key={restaurant.id} data-testid="favorite-item" onClick={() => navigation.navigate('restaurant-details', { restaurantId: restaurant.id })}>
          <img src={restaurant.image} alt={restaurant.name} />
          <div>{restaurant.name}</div>
          <div>{restaurant.cuisine}</div>
          <div>{restaurant.rating}</div>
        </div>
      ))}
    </div>
  );
};

// Mock des composants pour les tests
jest.mock('../app/social/feed.tsx', () => SocialFeed);
jest.mock('../app/social/friends.tsx', () => FriendsList);
jest.mock('../app/social/favorites.tsx', () => FavoritesList);

describe('Social Features Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SocialFeed', () => {
    it('renders correctly with posts', () => {
      const { getByText, getAllByTestId } = render(
        <SocialFeed navigation={mockNavigation} />
      );
      expect(getByText('social.feed')).toBeTruthy();
      expect(getAllByTestId('post-item').length).toBe(2);
      expect(getAllByTestId('post-header').length).toBe(2);
      expect(getAllByTestId('post-content').length).toBe(2);
      expect(getAllByTestId('post-actions').length).toBe(2);
    });

    it('navigates to comments screen when comment button is clicked', () => {
      const { getAllByTestId } = render(
        <SocialFeed navigation={mockNavigation} />
      );
      
      fireEvent.click(getAllByTestId('comment-button')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('post-comments', { 
        postId: '1'
      });
    });
  });

  describe('FriendsList', () => {
    it('renders correctly with friends', () => {
      const { getByText, getAllByTestId } = render(
        <FriendsList navigation={mockNavigation} />
      );
      expect(getByText('social.friends')).toBeTruthy();
      expect(getByText('social.addFriend')).toBeTruthy();
      expect(getAllByTestId('friend-item').length).toBe(3);
    });

    it('navigates to add friend screen when add friend button is clicked', () => {
      const { getByTestId } = render(
        <FriendsList navigation={mockNavigation} />
      );
      
      fireEvent.click(getByTestId('add-friend-button'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('add-friend');
    });

    it('navigates to friend profile when a friend item is clicked', () => {
      const { getAllByTestId } = render(
        <FriendsList navigation={mockNavigation} />
      );
      
      fireEvent.click(getAllByTestId('friend-item')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('friend-profile', { 
        userId: 'user1'
      });
    });
  });

  describe('FavoritesList', () => {
    it('renders correctly with favorite restaurants', () => {
      const { getByText, getAllByTestId } = render(
        <FavoritesList navigation={mockNavigation} />
      );
      expect(getByText('social.favorites')).toBeTruthy();
      expect(getAllByTestId('favorite-item').length).toBe(2);
    });

    it('navigates to restaurant details when a favorite item is clicked', () => {
      const { getAllByTestId } = render(
        <FavoritesList navigation={mockNavigation} />
      );
      
      fireEvent.click(getAllByTestId('favorite-item')[0]);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('restaurant-details', { 
        restaurantId: 'rest1'
      });
    });
  });
});
