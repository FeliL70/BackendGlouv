import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xrbcwmhaixjqtzymycpg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYmN3bWhhaXhqcXR6eW15Y3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzE5NzcsImV4cCI6MjA2NDIwNzk3N30.Hk6ts6uE4F6vXM66Ic0JPA193vzjYd5PfUzZQxZSN9M'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
