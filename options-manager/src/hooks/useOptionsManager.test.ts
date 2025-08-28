import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useOptionsManager } from './useOptionsManager'
import type { Option } from '@/types/options'

const initialTestOptions: Option[] = [
  { id: '1', name: 'First', color: '#ff0000', order: 0, active: true },
  { id: '2', name: 'Second', color: '#00ff00', order: 1, active: true },
]

describe('useOptionsManager', () => {
  it('should initialize with provided options', () => {
    const { result } = renderHook(() => useOptionsManager(initialTestOptions))
    expect(result.current.options).toEqual(initialTestOptions)
  })

  it('handleSave should add a new item', () => {
    const { result } = renderHook(() => useOptionsManager(initialTestOptions))

    const newOption = { name: 'Third', color: '#0000ff', active: true }

    act(() => {
      result.current.handleSave(newOption)
    })

    expect(result.current.options).toHaveLength(3)
    expect(result.current.options[2].name).toBe('Third')
    expect(result.current.options[2].order).toBe(2)
  })

  it('handleSave should update an existing item', () => {
    const { result } = renderHook(() => useOptionsManager(initialTestOptions))
    const updatedOption: Option = {
      id: '1',
      name: 'First Updated',
      color: '#fafafa',
      order: 0,
      active: true,
    }

    act(() => {
      result.current.handleSave(updatedOption)
    })

    expect(result.current.options).toHaveLength(2)
    expect(result.current.options[0].name).toBe('First Updated')
    expect(result.current.options[0].color).toBe('#fafafa')
  })

  it('handleDelete should remove an item', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
    const { result } = renderHook(() => useOptionsManager(initialTestOptions))

    act(() => {
      result.current.handleDelete('1')
    })

    expect(result.current.options).toHaveLength(1)
    expect(result.current.options[0].id).toBe('2')
  })

  it('handleReorder should reorder the items', () => {
    const { result } = renderHook(() => useOptionsManager(initialTestOptions))

    act(() => {
      result.current.handleReorder(0, 1)
    })

    expect(result.current.options[0].name).toBe('Second')
    expect(result.current.options[1].name).toBe('First')
  })

  it('should call the onSaveCallback after saving', async () => {
    vi.useFakeTimers()

    const onSaveCallback = vi.fn(() => Promise.resolve())
    const { result } = renderHook(() =>
      useOptionsManager(initialTestOptions, onSaveCallback)
    )

    const updatedOption = { id: '1', name: 'Updated' }

    await act(async () => {
      await result.current.handleSave(updatedOption)
    })

    await vi.runAllTimersAsync()

    expect(onSaveCallback).toHaveBeenCalled()

    vi.useRealTimers()
  })
})
