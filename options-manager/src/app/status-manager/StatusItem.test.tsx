import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { StatusItem } from './StatusItem'
import type { Option } from '@/types/options'

describe('StatusItem', () => {
  it('renders the status name from props', () => {
    const mockStatus: Option = {
      id: '1',
      name: 'IN PROGRESS',
      color: '#2196f3',
      order: 1,
      active: true,
      type: 'status',
    }

    render(<StatusItem item={mockStatus} onEdit={() => {}} />)

    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })
})
