import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xrbcwmhaixjqtzymycpg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYmN3bWhhaXhqcXR6eW15Y3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODYzMTk3NywiZXhwIjoyMDY0MjA3OTc3fQ.SFL5a9Y6LMnEVoNCLRjAbMX9ufc6QP0U7HQauisQc6I'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;