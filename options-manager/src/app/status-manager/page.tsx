'use client'

import React, { useMemo } from 'react'
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material'
import { ArrowBack, Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { useOptionsManager } from '@/hooks/useOptionsManager'
import { OptionEditForm } from '@/components/shared/OptionEditForm'
import type { Option } from '@/types/options'
import { StatusItem } from './StatusItem' // <-- The new import

// Initial data for the Status Manager page
const initialStatuses: Option[] = [
  {
    id: '1',
    name: 'TO DO',
    color: '#9e9e9e',
    order: 0,
    active: true,
    type: 'status',
  },
  {
    id: '2',
    name: 'IN PROGRESS',
    color: '#2196f3',
    order: 1,
    active: true,
    type: 'status',
  },
  {
    id: '3',
    name: 'DONE',
    color: '#4caf50',
    order: 2,
    active: true,
    type: 'status',
  },
]

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
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Box mb={4}>
        <Button component={Link} href='/' startIcon={<ArrowBack />}>
          Back to Home
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          Status Manager
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Manage the different stages of your workflow.
        </Typography>
      </Box>

      <Paper>
        <Box
          p={2}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h6'>Task Statuses</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsAdding(true)}
            size='small'
            variant='contained'
          >
            Add
          </Button>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='statuses-list'>
            {(provided) => (
              <Grid
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: '1fr',
                  p: 2,
                }}
              >
                {sortedOptions.map((item, index) => {
                  const isEditing = editingId === item.id
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {isEditing ? (
                            <OptionEditForm
                              option={item}
                              onSave={handleSave}
                              onCancel={() => setEditingId(null)}
                              onDelete={handleDelete}
                            />
                          ) : (
                            <StatusItem
                              item={item}
                              onEdit={() => setEditingId(item.id)}
                            />
                          )}
                        </Box>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>

        {isAdding && (
          <Box p={2}>
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
      </Paper>
    </Container>
  )
}
