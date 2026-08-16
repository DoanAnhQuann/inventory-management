const ONES = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
const UNITS = ['', 'nghìn', 'triệu', 'tỷ']

function readThreeDigits(value: number, isLeadingGroup: boolean): string {
  const hundreds = Math.floor(value / 100)
  const tens = Math.floor((value % 100) / 10)
  const ones = value % 10
  const parts: string[] = []

  if (hundreds > 0 || !isLeadingGroup) {
    parts.push(`${ONES[hundreds]} trăm`)
  }

  if (tens === 0) {
    if (ones > 0 && (hundreds > 0 || !isLeadingGroup)) parts.push('linh')
  } else if (tens === 1) {
    parts.push('mười')
  } else {
    parts.push(`${ONES[tens]} mươi`)
  }

  if (ones === 1 && tens > 1) {
    parts.push('mốt')
  } else if (ones === 5 && tens > 0) {
    parts.push('lăm')
  } else if (ones > 0) {
    parts.push(ONES[ones])
  }

  return parts.join(' ')
}

export function numberToVietnameseWords(value: number): string {
  if (!Number.isFinite(value) || value === 0) return 'Không đồng'

  const isNegative = value < 0
  let remaining = Math.floor(Math.abs(value))

  const groups: number[] = []
  while (remaining > 0) {
    groups.unshift(remaining % 1000)
    remaining = Math.floor(remaining / 1000)
  }

  const parts: string[] = []
  groups.forEach((group, index) => {
    if (group === 0) return
    const unit = UNITS[groups.length - 1 - index] ?? ''
    const words = readThreeDigits(group, parts.length === 0)
    parts.push(unit ? `${words} ${unit}` : words)
  })

  const sentence = parts.join(' ')
  const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1)
  return `${isNegative ? 'Âm ' : ''}${capitalized} đồng chẵn`
}
