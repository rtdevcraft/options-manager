'use client'

import React, { useMemo } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
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

// Initial data for the page
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

// Memoized component for a single priority item
const PriorityItem = React.memo(
  ({
    item,
    width,
    onEdit,
  }: {
    item: Option
    width: number
    onEdit: () => void
  }) => {
    const textColor = getContrastColor(item.color)
    return (
      <Box
        onClick={onEdit}
        sx={{
          width: `${width}px`,
          p: 1.5,
          mb: 1.5,
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
PriorityItem.displayName = 'PriorityItem'

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
    <Container>
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
            disabled={isAdding || !!editingId}
          >
            Add Priority
          </Button>
        </Box>
        <Typography color='text.secondary'>
          Drag to reorder • Click a card to edit
        </Typography>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='pyramid-droppable'>
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {sortedOptions.map((item, index) => {
                const isEditing = editingId === item.id

                const pyramidWidth = 300 + index * 50
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
                              width: `${pyramidWidth}px`,
                              p: 1,
                              mb: 1.5,
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
                          <PriorityItem
                            item={item}
                            width={pyramidWidth}
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
                    width: `${300 + options.length * 50}px`,
                    p: 1,
                    mt: 1,
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
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}
