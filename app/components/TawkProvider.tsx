'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export default function TawkProvider() {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    // Set French language before loading
    window.Tawk_API.customStyle = { visibility: { desktop: { position: 'br' }, mobile: { position: 'br' } } }

    const s1 = document.createElement('script')
    const s0 = document.getElementsByTagName('script')[0]
    s1.async = true
    s1.src = 'https://embed.tawk.to/6a01b9d6d261d91c336d46e1/1jobbrrrm'
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    s0.parentNode?.insertBefore(s1, s0)

    // Set French once widget loads
    s1.onload = () => {
      window.Tawk_API?.setLocale?.('fr')
    }

    return () => {
      // Hide widget when leaving the page
      window.Tawk_API?.hideWidget?.()
      s1.remove()
    }
  }, [])

  return null
}