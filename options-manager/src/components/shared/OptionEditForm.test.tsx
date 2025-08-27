import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { OptionEditForm } from './OptionEditForm'
import type { Option } from '@/types/options'

interface MockPickerProps {
  color: string
  onChangeComplete: (color: { hex: string }) => void
}

vi.mock('react-color', () => ({
  ChromePicker: (props: MockPickerProps) => (
    <input
      type='text'
      data-testid='mock-color-picker'
      value={props.color}
      onChange={(e) => props.onChangeComplete({ hex: e.target.value })}
    />
  ),
}))

describe('OptionEditForm', () => {
  const mockOption: Option = {
    id: '1',
    name: 'Test Option',
    color: '#ff0000',
    active: true,
    order: 0,
  }

  it('calls onSave with updated data when save is clicked', () => {
    const handleSave = vi.fn()
    render(
      <OptionEditForm
        option={mockOption}
        onSave={handleSave}
        onCancel={() => {}}
      />
    )

    const nameInput = screen.getByLabelText(/name/i)
    const saveButton = screen.getByRole('button', { name: /save/i })

    fireEvent.change(nameInput, { target: { value: 'Updated Name' } })
    fireEvent.click(saveButton)

    expect(handleSave).toHaveBeenCalledWith({
      ...mockOption,
      name: 'Updated Name',
    })
  })

  it('calls onCancel when cancel is clicked', () => {
    const handleCancel = vi.fn()
    render(
      <OptionEditForm
        option={mockOption}
        onSave={() => {}}
        onCancel={handleCancel}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalled()
  })

  it('calls onDelete when delete is clicked for an existing item', () => {
    const handleDelete = vi.fn()
    render(
      <OptionEditForm
        option={mockOption}
        onSave={() => {}}
        onCancel={() => {}}
        onDelete={handleDelete}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(handleDelete).toHaveBeenCalledWith(mockOption.id)
  })

  it('does not show the delete button for a new item', () => {
    render(
      <OptionEditForm
        option={{}}
        isNew={true}
        onSave={() => {}}
        onCancel={() => {}}
      />
    )

    const deleteButton = screen.queryByRole('button', { name: /delete/i })
    expect(deleteButton).not.toBeInTheDocument()
  })
})
