import { describe, it, expect } from 'vitest'
import { getContrastColor } from './colorUtils'

describe('getContrastColor', () => {
  it('should return black for a light background color', () => {
    const lightColor = '#ffff00'
    expect(getContrastColor(lightColor)).toBe('#000000')
  })

  it('should return white for a dark background color', () => {
    const darkColor = '#0000ff'

    expect(getContrastColor(darkColor).toLowerCase()).toBe('#ffffff')
  })

  it('should handle hex codes without a hash', () => {
    const color = 'f44336' // Red

    expect(getContrastColor(color).toLowerCase()).toBe('#ffffff')
  })
})
