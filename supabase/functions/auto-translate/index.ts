import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const LANGUAGES = ['en', 'fr', 'ar', 'zh', 'hi']

async function translate(text: string, target: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=sw|${target}`
    )
    const data = await res.json()
    return data.responseData?.translatedText || text
  } catch {
    return text
  }
}

serve(async (req) => {
  const { key, value_sw } = await req.json()
  if (!key || !value_sw) {
    return new Response(JSON.stringify({ error: "key na value_sw zinahitajika" }), { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  await supabase.from('translations').upsert({ key, lang: 'sw', value: value_sw })

  for (const lang of LANGUAGES) {
    const translated = await translate(value_sw, lang)
    await supabase.from('translations').upsert({ key, lang, value: translated })
  }

  return new Response(JSON.stringify({ success: true, key }), {
    headers: { "Content-Type": "application/json" }
  })
})