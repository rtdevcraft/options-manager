import { useState, useCallback } from 'react'
import type { Option } from '../types/options'

/**
 * A custom hook to manage a list of editable, reorderable, and deletable options.
 * @param initialOptions - The initial array of options to manage.
 * @param onSaveCallback - An optional callback function to run after saving changes.
 */
export function useOptionsManager(
  initialOptions: Option[],
  onSaveCallback?: (updatedOptions: Option[]) => Promise<void>
) {
  const [options, setOptions] = useState<Option[]>(initialOptions)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      setOptions((prevOptions) => {
        const reordered = Array.from(prevOptions)
        const [removed] = reordered.splice(startIndex, 1)
        reordered.splice(endIndex, 0, removed)

        const updated = reordered.map((opt, index) => ({
          ...opt,
          order: index,
        }))

        if (onSaveCallback) {
          onSaveCallback(updated)
        }
        return updated
      })
    },
    [onSaveCallback]
  )

  const handleSave = useCallback(
    async (optionToSave: Partial<Option>) => {
      let newOptions: Option[] = []

      setOptions((currentOptions) => {
        if (optionToSave.id) {
          newOptions = currentOptions.map((opt) =>
            opt.id === optionToSave.id ? { ...opt, ...optionToSave } : opt
          )
        } else {
          const newOptionWithDefaults: Option = {
            id: Date.now().toString(),
            order: currentOptions.length,
            active: true,
            ...optionToSave,
          } as Option
          newOptions = [...currentOptions, newOptionWithDefaults]
        }
        return newOptions
      })

      setEditingId(null)

      if (onSaveCallback) {
        setTimeout(() => onSaveCallback(newOptions), 0)
      }
    },
    [onSaveCallback]
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (options.length <= 1) {
        alert('At least one option is required.')
        return
      }

      if (window.confirm('Are you sure you want to delete this option?')) {
        const updated = options
          .filter((opt) => opt.id !== id)
          .map((opt, index) => ({ ...opt, order: index }))

        setOptions(updated)

        if (onSaveCallback) {
          onSaveCallback(updated)
        }
      }
    },
    [options, onSaveCallback]
  )

  return {
    options,
    editingId,
    setEditingId,
    handleReorder,
    handleSave,
    handleDelete,
  }
}
