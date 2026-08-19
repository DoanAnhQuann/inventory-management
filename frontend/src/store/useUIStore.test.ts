import { afterEach, describe, expect, it } from 'vitest'

import { useUIStore } from './useUIStore'

const initialState = useUIStore.getState()

afterEach(() => {
  useUIStore.setState(initialState, true)
})

describe('useUIStore', () => {
  it('starts with the mobile nav closed', () => {
    expect(useUIStore.getState().mobileNavOpen).toBe(false)
  })

  it('toggleMobileNav flips the open state on each call', () => {
    useUIStore.getState().toggleMobileNav()
    expect(useUIStore.getState().mobileNavOpen).toBe(true)

    useUIStore.getState().toggleMobileNav()
    expect(useUIStore.getState().mobileNavOpen).toBe(false)
  })

  it('closeMobileNav forces the state closed regardless of current value', () => {
    useUIStore.getState().toggleMobileNav()
    expect(useUIStore.getState().mobileNavOpen).toBe(true)

    useUIStore.getState().closeMobileNav()
    expect(useUIStore.getState().mobileNavOpen).toBe(false)

    useUIStore.getState().closeMobileNav()
    expect(useUIStore.getState().mobileNavOpen).toBe(false)
  })
})
