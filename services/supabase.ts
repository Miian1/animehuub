
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ipnsgmhqfkhcbjcquqtr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbnNnbWhxZmtoY2JqY3F1cXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDU0NzgsImV4cCI6MjA2NzYyMTQ3OH0.lSTaciUFdMjCgWOxaWrcmQU63XKY9hFKYBbqKVOfwa8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
