import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { ClassificationItem } from './ClassificationItem'
import type { Option } from '@/types/options'

describe('ClassificationItem', () => {
  it('renders the item name provided in props', () => {
    const mockItem: Option = {
      id: '1',
      name: 'BUG',
      color: '#f44336',
      order: 0,
      active: true,
      type: 'classification',
    }

    render(<ClassificationItem item={mockItem} onEdit={() => {}} />)

    const nameElement = screen.getByText('BUG')
    expect(nameElement).toBeInTheDocument()
  })
})
