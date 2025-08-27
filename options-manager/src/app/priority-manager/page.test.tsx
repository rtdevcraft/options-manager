import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import PriorityManagerPage from './page'

vi.mock('@/components/shared/OptionEditForm', () => ({
  OptionEditForm: () => <div>OptionEditForm</div>,
}))

describe('PriorityManagerPage', () => {
  it('should disable the "Add Priority" button when an item is being edited', () => {
    render(<PriorityManagerPage />)

    const addButton = screen.getByRole('button', { name: /add priority/i })
    expect(addButton).not.toBeDisabled()

    const highestPriorityItem = screen.getByText('Highest Priority')
    fireEvent.click(highestPriorityItem)

    expect(addButton).toBeDisabled()
  })
})
