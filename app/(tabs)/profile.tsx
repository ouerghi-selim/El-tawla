import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../utils/i18n/LanguageContext';
import LanguageSelector from '../../components/LanguageSelector';
import { TunisianButton, TUNISIAN_COLORS, TUNISIAN_SHADOWS, TUNISIAN_BORDER_RADIUS } from '../../components/tunisian';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/auth/login');
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: t('profile.editProfile'),
      route: '/settings/edit-profile',
    },
    {
      icon: 'notifications-outline',
      label: t('profile.notifications'),
      route: '/settings/notifications',
    },
    {
      icon: 'help-circle-outline',
      label: t('profile.help'),
      route: '/settings/help',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <View style={styles.badgeContainer}>
          {user?.badges.map((badge) => (
            <View key={badge} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      <LanguageSelector />

      <View style={[styles.menuSection, isRTL && styles.menuSectionRTL]}>
        {menuItems.map((item) => (
          <Pressable
            key={item.label}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <View style={[styles.menuItemContent, isRTL && styles.menuItemContentRTL]}>
              <Ionicons name={item.icon as any} size={24} color={TUNISIAN_COLORS.text.secondary} />
              <Text style={[styles.menuLabel, isRTL && styles.menuLabelRTL]}>{item.label}</Text>
            </View>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={24} color={TUNISIAN_COLORS.text.secondary} />
          </Pressable>
        ))}

        <TunisianButton
          title={t('auth.logout')}
          onPress={handleLogout}
          variant="outline"
          icon="door"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TUNISIAN_COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TUNISIAN_COLORS.text.primary,
  },
  email: {
    fontSize: 16,
    color: TUNISIAN_COLORS.text.secondary,
    marginTop: 5,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  badge: {
    backgroundColor: TUNISIAN_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: TUNISIAN_BORDER_RADIUS.small,
    margin: 4,
  },
  badgeText: {
    color: TUNISIAN_COLORS.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    ...TUNISIAN_SHADOWS.medium,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TUNISIAN_COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: TUNISIAN_COLORS.text.secondary,
    marginTop: 5,
  },
  reliabilityScore: {
    alignItems: 'center',
  },
  reliabilityLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    ...TUNISIAN_SHADOWS.medium,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TUNISIAN_COLORS.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: TUNISIAN_COLORS.text.secondary,
    lineHeight: 20,
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuSectionRTL: {
    direction: 'rtl',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: TUNISIAN_BORDER_RADIUS.medium,
    marginBottom: 10,
    ...TUNISIAN_SHADOWS.small,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemContentRTL: {
    flexDirection: 'row-reverse',
  },
  menuLabel: {
    fontSize: 16,
    color: TUNISIAN_COLORS.text.primary,
    marginLeft: 15,
  },
  menuLabelRTL: {
    marginLeft: 0,
    marginRight: 15,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: TUNISIAN_COLORS.error,
  },
});
