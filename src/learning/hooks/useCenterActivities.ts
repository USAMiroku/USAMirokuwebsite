import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export type CenterActivity = {
  id: string
  type: string
  title: string
  description: string | null
}

export function useCenterActivities(centerId: string) {
  const [activities, setActivities] = useState<CenterActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!centerId || !supabase) {
      queueMicrotask(() => setIsLoading(false))
      return
    }

    let cancelled = false

    async function load() {
      if (!supabase) return
      const { data, error } = await supabase
        .from('learning_activities')
        .select('id,type,title,description')
        .eq('center_id', centerId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (cancelled) return
      if (!error && data) setActivities(data as CenterActivity[])
      setIsLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [centerId])

  return { activities, isLoading }
}
