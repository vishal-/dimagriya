
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables - app will not work properly');
    console.error('Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in GitHub secrets');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;
