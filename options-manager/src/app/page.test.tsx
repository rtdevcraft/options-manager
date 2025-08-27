// src/app/page.test.tsx
import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /project configuration demos/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('should render links to all three manager pages', () => {
    render(<Home />)

    // Test for the Status Manager card
    const statusHeading = screen.getByRole('heading', {
      name: /status manager/i,
    })
    const statusCard = statusHeading.parentElement! // <-- Add '!' here
    const statusLink = within(statusCard).getByRole('link', {
      name: /view demo/i,
    })
    expect(statusLink).toHaveAttribute('href', '/status-manager')

    // Test for the Priority Manager card
    const priorityHeading = screen.getByRole('heading', {
      name: /priority manager/i,
    })
    const priorityCard = priorityHeading.parentElement! // <-- Add '!' here
    const priorityLink = within(priorityCard).getByRole('link', {
      name: /view demo/i,
    })
    expect(priorityLink).toHaveAttribute('href', '/priority-manager')

    // Test for the Classification Manager card
    const classificationHeading = screen.getByRole('heading', {
      name: /classification manager/i,
    })
    const classificationCard = classificationHeading.parentElement! // <-- Add '!' here
    const classificationLink = within(classificationCard).getByRole('link', {
      name: /view demo/i,
    })
    expect(classificationLink).toHaveAttribute(
      'href',
      '/classification-manager'
    )
  })
})
