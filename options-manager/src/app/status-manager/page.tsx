'use client'

import React, { useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
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
const initialStatuses: Option[] = [
  { id: '1', name: 'OPEN', color: '#2196f3', order: 0, active: true },
  { id: '2', name: 'IN PROGRESS', color: '#ff9800', order: 1, active: true },
  { id: '3', name: 'REVIEW', color: '#9c27b0', order: 2, active: true },
  { id: '4', name: 'DONE', color: '#4caf50', order: 3, active: true },
]

// Memoized component for a single status item to improve performance
const StatusItem = React.memo(
  ({
    status,
    isEditing,
    onEdit,
    ...dragProps
  }: {
    status: Option
    isEditing: boolean
    onEdit: () => void
    [key: string]: any
  }) => {
    const textColor = getContrastColor(status.color)

    return (
      <Box
        onClick={onEdit}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: status.color,
          color: textColor,
          minWidth: 140,
          cursor: 'grab',
          textAlign: 'center',
        }}
        {...dragProps}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            mx: 'auto',
          }}
        >
          {status.order + 1}
        </Box>
        <Typography variant='caption' sx={{ fontWeight: 'bold' }}>
          {status.name}
        </Typography>
      </Box>
    )
  }
)

export default function StatusManagerPage() {
  const {
    options,
    editingId,
    setEditingId,
    handleReorder,
    handleSave,
    handleDelete,
  } = useOptionsManager(initialStatuses)
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
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={4}>
        <Button component={Link} href='/' startIcon={<ArrowBack />}>
          Back to Home
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          Status Manager
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Define the workflow steps for your tasks. Drag to reorder.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={2}
          >
            <Typography variant='h6'>Task Status Flow</Typography>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => setIsAdding(true)}
              size='small'
            >
              Add Status
            </Button>
          </Box>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='status-flow' direction='horizontal'>
              {(provided) => (
                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sortedOptions.map((status, index) => {
                    const isEditing = editingId === status.id
                    return (
                      <Draggable
                        key={status.id}
                        draggableId={status.id}
                        index={index}
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
                                  minWidth: 200,
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: 'grey.200',
                                }}
                              >
                                <OptionEditForm
                                  option={status}
                                  onSave={handleSave}
                                  onCancel={() => setEditingId(null)}
                                  onDelete={handleDelete}
                                />
                              </Box>
                            ) : (
                              <StatusItem
                                status={status}
                                isEditing={isEditing}
                                onEdit={() => setEditingId(status.id)}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>

          {isAdding && (
            <Box
              sx={{
                minWidth: 200,
                p: 1,
                mt: 2,
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
        </CardContent>
      </Card>
    </Container>
  )
}
