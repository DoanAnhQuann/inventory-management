import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useIsMobile, useMediaQuery } from './useMediaQuery'

type Listener = (event: Pick<MediaQueryListEvent, 'matches'>) => void

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<Listener>()

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return matches
    },
    media: query,
    addEventListener: (_event: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_event: string, listener: Listener) => listeners.delete(listener),
  })) as unknown as typeof window.matchMedia

  return {
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((listener) => listener({ matches: next }))
    },
  }
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the initial matches value from matchMedia', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useMediaQuery('(max-width: 1023px)'))

    expect(result.current).toBe(true)
  })

  it('updates when the underlying media query change event fires', () => {
    const media = mockMatchMedia(false)

    const { result } = renderHook(() => useMediaQuery('(max-width: 1023px)'))
    expect(result.current).toBe(false)

    act(() => media.setMatches(true))

    expect(result.current).toBe(true)
  })
})

describe('useIsMobile', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queries using the max-width: 1023px breakpoint', () => {
    renderHook(() => useIsMobile())

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)')
  })
})
