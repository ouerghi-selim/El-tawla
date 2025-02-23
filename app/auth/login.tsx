import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';

type LoginType = 'customer' | 'restaurant';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<LoginType>('customer');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password, type: loginType })).unwrap();
      router.replace(loginType === 'restaurant' ? '/admin' : '/');
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.loginTypeContainer}>
          <Pressable
            style={[
              styles.loginTypeButton,
              loginType === 'customer' && styles.activeLoginType,
            ]}
            onPress={() => setLoginType('customer')}
          >
            <Text
              style={[
                styles.loginTypeText,
                loginType === 'customer' && styles.activeLoginTypeText,
              ]}
            >
              Customer
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.loginTypeButton,
              loginType === 'restaurant' && styles.activeLoginType,
            ]}
            onPress={() => setLoginType('restaurant')}
          >
            <Text
              style={[
                styles.loginTypeText,
                loginType === 'restaurant' && styles.activeLoginTypeText,
              ]}
            >
              Restaurant
            </Text>
          </Pressable>
        </View>

        {error && (
          <Text style={styles.error}>{error}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/auth/register')}>
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerLink}>
              Don't have an account?{' '}
              <Text style={styles.registerLinkBold}>Sign Up</Text>
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  loginTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  loginTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeLoginType: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginTypeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeLoginTypeText: {
    color: '#E3735E',
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#E3735E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#dc3545',
    marginBottom: 15,
    textAlign: 'center',
  },
  registerLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLink: {
    color: '#666',
  },
  registerLinkBold: {
    color: '#E3735E',
    fontWeight: '600',
  },
});