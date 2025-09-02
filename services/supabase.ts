
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://skfxykhvxghzgqjpkege.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZnh5a2h2eGdoemdxanBrZWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzI2OTIsImV4cCI6MjA2NTY0ODY5Mn0.5HLPS54q6sMr4zs3QYTqotxvro1KVoFpgpo8sYcqpeA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
