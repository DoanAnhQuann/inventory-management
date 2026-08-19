import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins plain class name strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    const shouldInclude = false
    expect(cn('a', shouldInclude && 'b', undefined, null, '')).toBe('a')
  })

  it('resolves conflicting Tailwind utility classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('merges conditional class objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
