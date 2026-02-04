import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

**The key difference:** We assign the environment variables to constants FIRST, then use them. This ensures they're not undefined.

---

### Step 4: About profile-data.ts

**Where did you put this file?**

It should be at: `app/api/track-click/route.ts`

**NOT** `profile-data.ts`

If you created `profile-data.ts`:
1. **Delete it**
2. Make sure you have `app/api/track-click/route.ts` instead

---

## 📋 Correct File Structure Should Be:
```
lib/
  └── supabase.ts  ← ONLY ONE, with the correct code

app/
  └── api/
      └── track-click/
          └── route.ts  ← Should have the tracking code