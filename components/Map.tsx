import { Platform, View, Linking } from 'react-native';
import { StyleSheet } from 'react-native';

interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
}

interface MapProps {
  markers: MapMarker[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress: (id: string) => void;
}

export function openMapsWithAddress(address: string) {
  const encodedAddress = encodeURIComponent(address);
  
  if (Platform.OS === 'web') {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  } else {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = null; // You can add coordinates here if available
    const url = Platform.select({
      ios: `${scheme}${encodedAddress}`,
      android: `${scheme}${encodedAddress}`,
    });
    
    Linking.openURL(url as string);
  }
}

export default function Map({ markers, userLocation, initialRegion, onMarkerPress }: MapProps) {
  if (Platform.OS === 'web') {
    // For web, we'll use a simple iframe with Google Maps
    const center = `${initialRegion.latitude},${initialRegion.longitude}`;
    const zoom = '13';
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${center}&zoom=${zoom}`;
    
    return (
      <iframe
        src={mapUrl}
        style={styles.map}
        frameBorder="0"
        allowFullScreen
      />
    );
  }

  // For native platforms, return an empty view since react-native-maps is not web compatible
  return <View style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});