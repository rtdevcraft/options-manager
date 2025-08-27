'use client'

import React from 'react'
import { Typography, Box } from '@mui/material'
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material'
import { getContrastColor } from '@/utils/colorUtils'
import type { Option } from '@/types/options'

export const StatusItem = React.memo(
  ({ item, onEdit }: { item: Option; onEdit: () => void }) => {
    const textColor = getContrastColor(item.color)
    return (
      <Box
        display='flex'
        alignItems='center'
        width='100%'
        onClick={onEdit}
        sx={{
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      >
        <DragIndicatorIcon
          sx={{ mr: 1, color: 'text.disabled', cursor: 'grab' }}
        />
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: item.color,
            color: textColor,
          }}
        >
          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
        </Box>
      </Box>
    )
  }
)

StatusItem.displayName = 'StatusItem'
