import { useState, useCallback } from 'react'
import type { Option } from '../app/types/options'

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

  // Reorders the options array based on drag-and-drop indices.
  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      setOptions((prevOptions) => {
        const reordered = Array.from(prevOptions)
        const [removed] = reordered.splice(startIndex, 1)
        reordered.splice(endIndex, 0, removed)

        // Re-assign the 'order' property to reflect the new sequence.
        const updated = reordered.map((opt, index) => ({
          ...opt,
          order: index,
        }))

        // Optionally, trigger the save callback immediately after reordering.
        if (onSaveCallback) {
          onSaveCallback(updated)
        }
        return updated
      })
    },
    [onSaveCallback]
  )

  // Updates the options array with a new or modified option.
  const handleSave = useCallback(
    async (updatedOption: Option) => {
      let newOptions: Option[] = []

      // Check if the option already exists to decide whether to update or add.
      const exists = options.some((opt) => opt.id === updatedOption.id)

      if (exists) {
        // Update the existing option.
        newOptions = options.map((opt) =>
          opt.id === updatedOption.id ? updatedOption : opt
        )
      } else {
        // Add the new option to the end.
        newOptions = [...options, { ...updatedOption, order: options.length }]
      }

      setOptions(newOptions)
      setEditingId(null) // Exit editing mode after saving.

      if (onSaveCallback) {
        await onSaveCallback(newOptions)
      }
    },
    [options, onSaveCallback]
  )

  // Deletes an option by its ID.
  const handleDelete = useCallback(
    (id: string) => {
      if (options.length <= 1) {
        alert('At least one option is required.')
        return
      }

      if (window.confirm('Are you sure you want to delete this option?')) {
        const updated = options
          .filter((opt) => opt.id !== id)
          .map((opt, index) => ({ ...opt, order: index })) // Re-assign order after deletion.

        setOptions(updated)

        if (onSaveCallback) {
          onSaveCallback(updated)
        }
      }
    },
    [options, onSaveCallback]
  )

  // Return the state and the handler functions so components can use them.
  return {
    options,
    editingId,
    setEditingId, // Expose this to allow components to enter/exit edit mode.
    handleReorder,
    handleSave,
    handleDelete,
  }
}
