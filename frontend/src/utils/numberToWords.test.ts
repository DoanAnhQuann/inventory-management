import { describe, expect, it } from 'vitest'

import { numberToVietnameseWords } from './numberToWords'

describe('numberToVietnameseWords', () => {
  it('returns the zero sentence for 0', () => {
    expect(numberToVietnameseWords(0)).toBe('Không đồng')
  })

  it('reads a simple two-digit number', () => {
    expect(numberToVietnameseWords(21)).toBe('Hai mươi mốt đồng chẵn')
  })

  it('reads a number ending in 5 as "lăm" instead of "năm"', () => {
    expect(numberToVietnameseWords(25)).toBe('Hai mươi lăm đồng chẵn')
  })

  it('inserts "linh" between hundreds and a non-zero ones digit with no tens', () => {
    expect(numberToVietnameseWords(105)).toBe('Một trăm linh năm đồng chẵn')
  })

  it('reads the documented example: 4,050,000', () => {
    expect(numberToVietnameseWords(4050000)).toBe('Bốn triệu không trăm năm mươi nghìn đồng chẵn')
  })

  it('reads a value spanning billions/millions/thousands groups', () => {
    expect(numberToVietnameseWords(1234567890)).toBe(
      'Một tỷ hai trăm ba mươi bốn triệu năm trăm sáu mươi bảy nghìn tám trăm chín mươi đồng chẵn',
    )
  })

  it('prefixes negative values with "Âm", keeping the sentence casing unchanged', () => {
    expect(numberToVietnameseWords(-78500)).toBe('Âm Bảy mươi tám nghìn năm trăm đồng chẵn')
  })

  it('truncates a non-integer value before reading it', () => {
    expect(numberToVietnameseWords(78500.9)).toBe(numberToVietnameseWords(78500))
  })

  it('returns the zero sentence for non-finite input', () => {
    expect(numberToVietnameseWords(Number.NaN)).toBe('Không đồng')
    expect(numberToVietnameseWords(Number.POSITIVE_INFINITY)).toBe('Không đồng')
  })
})
