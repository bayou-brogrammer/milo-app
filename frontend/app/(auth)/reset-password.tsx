import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { resetPassword } from '@/lib/auth';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const error = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {success && (
          <Text style={styles.success}>
            Check your email for password reset instructions.
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>

        <Link href="/sign-in" style={styles.link}>
          Back to Sign In
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc3545',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff8f8',
    borderRadius: 8,
  },
  success: {
    color: '#198754',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fff9',
    borderRadius: 8,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});
