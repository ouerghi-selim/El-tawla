import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  const helpItems = [
    {
      title: 'FAQ',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      title: 'Contact Support',
      icon: 'mail-outline',
      onPress: () => Linking.openURL('mailto:support@tunisiabistrot.com'),
    },
    {
      title: 'Terms of Service',
      icon: 'document-text-outline',
      onPress: () => {},
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      onPress: () => {},
    },
    {
      title: 'App Version',
      icon: 'information-circle-outline',
      version: '1.0.0',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {helpItems.map((item, index) => (
          <Pressable
            key={item.title}
            style={[
              styles.helpItem,
              index === helpItems.length - 1 && styles.lastItem,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.itemContent}>
              <Ionicons name={item.icon as any} size={24} color="#666" />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            {item.version ? (
              <Text style={styles.version}>{item.version}</Text>
            ) : (
              <Ionicons name="chevron-forward" size={24} color="#666" />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 15,
  },
  version: {
    fontSize: 14,
    color: '#666',
  },
});