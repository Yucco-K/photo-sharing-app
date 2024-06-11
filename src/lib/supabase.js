// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

//if (!supabaseUrl || !supabaseAnonKey) {
//  throw new Error('Supabase URL and Key are required');
//}

export const supabase = createClient(supabaseUrl, supabaseKey);
