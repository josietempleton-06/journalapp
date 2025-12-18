
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeidzhkpqdyqsoghhrzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWR6aGtwcWR5cXNvZ2hocnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTY0NTQsImV4cCI6MjA4MTU5MjQ1NH0.uUD1whtpgJxh9oITARZt7bM-EwOkJ7qbcz1NVL1twuY';

export const supabase = createClient(supabaseUrl, supabaseKey);
