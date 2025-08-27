import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Stack } from '@mui/material'
import dynamic from 'next/dynamic'
import type { Option } from '../../types/options'

// Dynamically import ChromePicker for better performance
const ChromePicker = dynamic(
  () => import('react-color').then((mod) => mod.ChromePicker),
  { ssr: false }
)

const COLOR_OPTIONS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ff9800',
]

interface OptionEditFormProps {
  option: Partial<Option> // Can be a partial option for adding new items
  onSave: (option: Option) => void
  onCancel: () => void
  onDelete?: (id: string) => void
  isNew?: boolean
}

export const OptionEditForm: React.FC<OptionEditFormProps> = ({
  option,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}) => {
  const [name, setName] = useState(option.name || '')
  const [color, setColor] = useState(option.color || COLOR_OPTIONS[5])
  const [showPicker, setShowPicker] = useState(false)

  // Sync state if the option prop changes (e.g., clicking a new item to edit)
  useEffect(() => {
    setName(option.name || '')
    setColor(option.color || COLOR_OPTIONS[5])
  }, [option])

  const handleSaveClick = () => {
    if (!name.trim()) return
    const finalOption: Option = {
      id: option.id || `option_${Date.now()}`,
      name: name.trim(),
      color,
      order: option.order ?? -1, // The hook will manage the final order
      active: option.active ?? true,
    }
    onSave(finalOption)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveClick()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <Stack
      sx={{ width: '100%', p: 1 }}
      spacing={1}
      onClick={(e) => e.stopPropagation()}
    >
      <TextField
        label='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        size='small'
        fullWidth
        autoFocus
        placeholder={isNew ? 'New option name...' : 'Edit name...'}
        onKeyDown={handleKeyDown}
        sx={{ '& .MuiInputBase-root': { backgroundColor: 'white' } }}
      />

      <Box display='flex' flexWrap='wrap' gap={0.5}>
        {COLOR_OPTIONS.map((c) => (
          <Box
            key={c}
            component='button'
            aria-label={`Set color to ${c}`}
            onClick={() => setColor(c)}
            sx={{
              width: 20,
              height: 20,
              backgroundColor: c,
              borderRadius: '50%',
              cursor: 'pointer',
              p: 0,
              border:
                color === c ? '2px solid white' : '1px solid rgba(0,0,0,0.2)',
            }}
          />
        ))}
        <Button size='small' onClick={() => setShowPicker((p) => !p)}>
          ⚙️
        </Button>
      </Box>

      {showPicker && (
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <ChromePicker color={color} onChange={(c) => setColor(c.hex)} />
        </Box>
      )}

      <Stack direction='row' justifyContent='space-between' spacing={1}>
        <Button
          size='small'
          onClick={handleSaveClick}
          sx={{ color: 'lightgreen' }}
        >
          Save
        </Button>
        <Button size='small' onClick={onCancel} sx={{ color: 'pink' }}>
          Cancel
        </Button>
        {onDelete && option.id && (
          <Button
            size='small'
            onClick={() => onDelete(option.id!)}
            sx={{ color: 'pink' }}
            aria-label='Delete'
          >
            🗑️
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
