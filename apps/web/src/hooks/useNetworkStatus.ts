import { useSyncExternalStore } from 'react'

export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'

export interface NetworkStatus {
  isOnline: boolean
  effectiveType: EffectiveConnectionType
  isLowBandwidth: boolean
}

function getEffectiveType(): EffectiveConnectionType {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown'
  }
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
  const type = conn?.effectiveType
  if (type === 'slow-2g' || type === '2g' || type === '3g' || type === '4g') {
    return type
  }
  return 'unknown'
}

function getIsOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

let cachedStatus: NetworkStatus | null = null

function getSnapshot(): NetworkStatus {
  const effectiveType = getEffectiveType()
  const next = {
    isOnline: getIsOnline(),
    effectiveType,
    isLowBandwidth: !getIsOnline() || effectiveType === 'slow-2g' || effectiveType === '2g',
  }

  if (
    cachedStatus &&
    cachedStatus.isOnline === next.isOnline &&
    cachedStatus.effectiveType === next.effectiveType &&
    cachedStatus.isLowBandwidth === next.isLowBandwidth
  ) {
    return cachedStatus
  }

  cachedStatus = next
  return cachedStatus
}

function getServerSnapshot(): NetworkStatus {
  if (!cachedStatus) {
    cachedStatus = { isOnline: true, effectiveType: 'unknown', isLowBandwidth: false }
  }
  return cachedStatus
}

function subscribeToNetwork(callback: () => void): () => void {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)

  const conn = (navigator as Navigator & { connection?: EventTarget }).connection
  if (conn) {
    conn.addEventListener('change', callback)
  }

  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
    if (conn) {
      conn.removeEventListener('change', callback)
    }
  }
}

export function useNetworkStatus(): NetworkStatus {
  const status = useSyncExternalStore(subscribeToNetwork, getSnapshot, getServerSnapshot)
  return status
}

export function useIsOnline(): boolean {
  return useNetworkStatus().isOnline
}

export function useIsLowBandwidth(): boolean {
  return useNetworkStatus().isLowBandwidth
}

/**
 * Call this when making API requests — if low bandwidth, return cached data or skip non-critical requests.
 */
export function shouldUseReducedData(): boolean {
  if (typeof navigator === 'undefined') return false
  const effectiveType = getEffectiveType()
  return !getIsOnline() || effectiveType === 'slow-2g' || effectiveType === '2g'
}
