import { renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('invokes the callback when a pointerdown happens outside the ref element', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const ref = createRef<HTMLDivElement>()
    ref.current = target
    const onClickOutside = vi.fn()

    renderHook(() => useClickOutside(ref, onClickOutside))

    const outside = document.createElement('div')
    document.body.appendChild(outside)
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('does not invoke the callback when the pointerdown happens inside the ref element', () => {
    const target = document.createElement('div')
    const inner = document.createElement('span')
    target.appendChild(inner)
    document.body.appendChild(target)
    const ref = createRef<HTMLDivElement>()
    ref.current = target
    const onClickOutside = vi.fn()

    renderHook(() => useClickOutside(ref, onClickOutside))

    inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('removes its event listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const ref = createRef<HTMLDivElement>()
    const { unmount } = renderHook(() => useClickOutside(ref, vi.fn()))

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    removeSpy.mockRestore()
  })
})
