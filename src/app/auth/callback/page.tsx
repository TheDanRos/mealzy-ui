'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.error('❌ No session found')
        return
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('❌ No user found', userError)
        return
      }

      const { data: memberRecord, error: memberError } = await supabase
        .from('members')
        .select('household_id')
        .eq('user_id', user.id)
        .single()

      if (memberError || !memberRecord) {
        console.log('🔁 Kein Household, redirect zu Onboarding')
        router.push('/onboarding/household')
      } else {
        console.log('✅ Household gefunden, redirect zum Dashboard')
        router.push('/dashboard')
      }
    }

    checkSessionAndRedirect()
  }, [router, supabase])

  return <p className="text-center mt-10 text-gray-500">⏳ Du wirst weitergeleitet...</p>
}
