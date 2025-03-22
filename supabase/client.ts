import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Récupérez vos clés Supabase depuis les variables d'environnement ou constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'VOTRE_URL_SUPABASE';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'VOTRE_CLE_ANONYME_SUPABASE';

// Créez le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
