import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djfibzmkwajrntsgzovn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZmliem1rd2Fqcm50c2d6b3ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY1Mjg1NiwiZXhwIjoyMDc4MjI4ODU2fQ.-2LT9TP8zLcTQvxDNsmKmFhAouCS8MsKhGET54ndF0c'

export const supabase = createClient(supabaseUrl, supabaseKey)
