'use client'

import React, { useMemo } from 'react'
import { Container, Typography, Box, Button, Grid } from '@mui/material' // Added Grid
import { ArrowBack, Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { useOptionsManager } from '../../hooks/useOptionsManager'
import { OptionEditForm } from '../../components/shared/OptionEditForm'
import { getContrastColor } from '../../utils/colorUtils'
import type { Option } from '../../types/options'

// Initial data for the page (no changes here)
const initialPriorities: Option[] = [
  {
    id: 'item-1',
    name: 'Highest Priority',
    color: '#f44336',
    active: true,
    order: 0,
  },
  {
    id: 'item-2',
    name: 'Important Task',
    color: '#ff9800',
    active: true,
    order: 1,
  },
  {
    id: 'item-3',
    name: 'Standard Task',
    color: '#3f51b5',
    active: true,
    order: 2,
  },
  {
    id: 'item-4',
    name: 'Low Priority',
    color: '#4caf50',
    active: false,
    order: 3,
  },
]

// PriorityItem component is updated to remove the dynamic 'width' prop
const PriorityItem = React.memo(
  ({ item, onEdit }: { item: Option; onEdit: () => void }) => {
    const textColor = getContrastColor(item.color)
    return (
      <Box
        onClick={onEdit}
        sx={{
          width: '100%', // Item now takes full width of the grid column
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: item.color,
          color: textColor,
          cursor: 'grab',
          transition: 'all 0.2s ease',
          opacity: item.active ? 1 : 0.6,
          '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          {item.name}
        </Typography>
      </Box>
    )
  }
)
PriorityItem.displayName = 'PriorityItem' // Added for ESLint best practice

export default function PriorityManagerPage() {
  const {
    options,
    editingId,
    setEditingId,
    handleReorder,
    handleSave,
    handleDelete,
  } = useOptionsManager(initialPriorities)
  const [isAdding, setIsAdding] = React.useState(false)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    handleReorder(result.source.index, result.destination.index)
  }

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.order - b.order),
    [options]
  )

  return (
    <Container maxWidth='md'>
      {' '}
      {/* Set a maxWidth for better appearance */}
      <Box sx={{ my: 4 }}>
        <Button component={Link} href='/' startIcon={<ArrowBack />}>
          Back to Home
        </Button>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
        >
          <Typography variant='h4' component='h1'>
            Priority Manager
          </Typography>
          <Button
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            Add Priority
          </Button>
        </Box>
        <Typography color='text.secondary'>
          Drag to reorder • Click a card to edit
        </Typography>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list-droppable'>
          {(provided) => (
            // REPLACED the old Flexbox Box with the new Grid standard
            <Grid
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: 'grid',
                gap: 1.5, // Replaces mb on items for consistent spacing
                gridTemplateColumns: '1fr', // Defines a single column layout
              }}
            >
              {sortedOptions.map((item, index) => {
                const isEditing = editingId === item.id
                return (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={!!editingId || isAdding}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {isEditing ? (
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: 'grey.200',
                            }}
                          >
                            <OptionEditForm
                              option={item}
                              onSave={handleSave}
                              onCancel={() => setEditingId(null)}
                              onDelete={handleDelete}
                            />
                          </Box>
                        ) : (
                          // PriorityItem no longer needs a width prop
                          <PriorityItem
                            item={item}
                            onEdit={() => setEditingId(item.id)}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}

              {isAdding && (
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                  }}
                >
                  <OptionEditForm
                    option={{}}
                    onSave={(newOption) => {
                      handleSave(newOption)
                      setIsAdding(false)
                    }}
                    onCancel={() => setIsAdding(false)}
                    isNew={true}
                  />
                </Box>
              )}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}
