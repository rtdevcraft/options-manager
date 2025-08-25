'use client'

import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material'
import {
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
  Category as ClassificationIcon,
} from '@mui/icons-material'

export default function Home() {
  const demoPages = [
    {
      title: 'Status Manager',
      description: 'Manage task statuses in a workflow.',
      href: '/status-manager',
      icon: <StatusIcon sx={{ fontSize: 48 }} />,
      color: '#4caf50',
    },
    {
      title: 'Priority Manager',
      description: 'Configure priority levels for tasks.',
      href: '/priority-manager',
      icon: <PriorityIcon sx={{ fontSize: 48 }} />,
      color: '#ff9800',
    },
    {
      title: 'Classification Manager',
      description: 'Set up task classifications and categories.',
      href: '/classification-manager',
      icon: <ClassificationIcon sx={{ fontSize: 48 }} />,
      color: '#9c27b0',
    },
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Project Configuration Demos
        </Typography>
        <Typography variant='h6' color='textSecondary'>
          A showcase of refactored, reusable, and accessible components.
        </Typography>
      </Box>

      {/* REPLACED the old Grid system with the new, working approach */}
      <Grid
        sx={{
          display: 'grid',
          gap: 4, // This replaces the old `spacing={4}` prop
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', // 1 column on extra-small screens
            sm: 'repeat(2, 1fr)', // 2 columns on small screens
            md: 'repeat(3, 1fr)', // 3 columns on medium screens
          },
        }}
      >
        {demoPages.map((page) => (
          // The Card is now the direct child of the grid
          <Card
            key={page.href} // The key is now on the Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition:
                'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <Box sx={{ mb: 2, color: page.color }}>{page.icon}</Box>
              <Typography variant='h6' component='h2' gutterBottom>
                {page.title}
              </Typography>
              <Typography variant='body2' color='textSecondary' paragraph>
                {page.description}
              </Typography>
              <Button
                component={Link}
                href={page.href}
                variant='contained'
                fullWidth
                sx={{
                  mt: 'auto',
                  backgroundColor: page.color,
                  '&:hover': {
                    backgroundColor: page.color,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                View Demo
              </Button>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Container>
  )
}
