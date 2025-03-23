import { Provider } from 'react-redux';
import { store } from '../store';
import { Slot } from 'expo-router';

export default function Root() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
