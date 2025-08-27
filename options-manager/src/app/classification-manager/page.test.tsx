import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import ClassificationManagerPage from './page'

vi.mock('@/components/shared/OptionEditForm', () => ({
  OptionEditForm: () => <div>OptionEditForm</div>,
}))

describe('ClassificationManagerPage', () => {
  it('should display the add form when the "Add" button is clicked', () => {
    render(<ClassificationManagerPage />)

    expect(screen.queryByText('OptionEditForm')).not.toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addButton)

    expect(screen.getByText('OptionEditForm')).toBeInTheDocument()
  })
})
