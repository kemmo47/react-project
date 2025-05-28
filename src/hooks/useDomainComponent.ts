import { DOMAIN_HEAD_MAP } from '@/config/domainHeadMap'
import { useFormStore } from '@/store'
import { Site } from '@/types'
import { useMemo } from 'react'
import { DOMAIN_COMPONENT_MAP } from '../config/domainComponentMap'

/**
 * Get the component corresponding to each environment and domain/site
 * Priority: hostname → query param site → first path segment
 */
export function useDomainComponent() {
  const { hostname, pathname, search } = window.location

  return useMemo(() => {
    // 1. Production: Use hostname to get component map
    const normalizedHost = hostname.replace(/^www\./, '') as Site

    // Production mode: match by hostname
    if (DOMAIN_COMPONENT_MAP[normalizedHost] && DOMAIN_HEAD_MAP[normalizedHost]) {
      useFormStore.getState().setPageHead(DOMAIN_HEAD_MAP[normalizedHost])
      return DOMAIN_COMPONENT_MAP[normalizedHost]
    }

    // 2. Development: Check dev host or localhost
    const isDev =
      hostname === 'localhost' ||
      hostname === 'dev.takakuureru.com' ||
      hostname.endsWith('.cloudfront.net')

    if (isDev) {
      // Priority: get site from query param ?site=...
      const params = new URLSearchParams(search)
      let seg = params.get('site')

      // If no query param, try to get the first segment of the path
      if (!seg) {
        // pathname: "/camera/forms/raiten" → seg = "camera"
        const pathParts = pathname.split('/').filter(Boolean)
        seg = pathParts[0] || ''
      }

      if (seg) {
        const prodHost = `${seg}-takakuureru.com` as Site
        if (DOMAIN_COMPONENT_MAP[prodHost] && DOMAIN_HEAD_MAP[prodHost]) {
          useFormStore.getState().setPageHead(DOMAIN_HEAD_MAP[prodHost])
          return DOMAIN_COMPONENT_MAP[prodHost]
        }
      }
    }

    // 3. Fallback: No suitable form found
    return DOMAIN_COMPONENT_MAP['not-found'] || (() => import('../forms/not-found/NotFoundForm'))
  }, [hostname, pathname, search])
}
