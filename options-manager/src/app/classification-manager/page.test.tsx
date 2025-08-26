import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ClassificationManagerPage from './page'

// Mock the child components that are not relevant to this specific test
jest.mock('@/components/shared/OptionEditForm', () => ({
  OptionEditForm: () => <div>OptionEditForm</div>,
}))

describe('ClassificationManagerPage', () => {
  it('should display the add form when the "Add" button is clicked', () => {
    render(<ClassificationManagerPage />)

    // Ensure the form is not visible initially
    expect(screen.queryByText('OptionEditForm')).not.toBeInTheDocument()

    // Find the "Add" button and click it
    const addButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addButton)

    // Now, assert that the form is visible
    expect(screen.getByText('OptionEditForm')).toBeInTheDocument()
  })
})
