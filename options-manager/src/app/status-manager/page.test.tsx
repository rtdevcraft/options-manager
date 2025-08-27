import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import StatusManagerPage from './page'

vi.mock('@/components/shared/OptionEditForm', () => ({
  OptionEditForm: () => <div>OptionEditForm</div>,
}))

describe('StatusManagerPage', () => {
  it('renders the initial list of statuses', () => {
    render(<StatusManagerPage />)

    expect(screen.getByText('TO DO')).toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.getByText('DONE')).toBeInTheDocument()
  })

  it('shows the add form when the "Add" button is clicked', () => {
    render(<StatusManagerPage />)

    const addButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addButton)

    expect(screen.getByText('OptionEditForm')).toBeInTheDocument()
  })

  it('shows the edit form when a status item is clicked', () => {
    render(<StatusManagerPage />)

    const inProgressItem = screen.getByText('IN PROGRESS')
    fireEvent.click(inProgressItem)

    expect(screen.getByText('OptionEditForm')).toBeInTheDocument()
    expect(screen.queryByText('IN PROGRESS')).not.toBeInTheDocument()
  })
})
