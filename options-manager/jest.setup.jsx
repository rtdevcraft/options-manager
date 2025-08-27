import React from 'react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('@mui/icons-material', () => {
  const MockIcon = (props) => <svg data-testid='mock-icon' {...props} />

  return {
    __esModule: true,
    default: MockIcon,

    Assignment: MockIcon,
    PriorityHigh: MockIcon,
    Category: MockIcon,

    DragIndicator: MockIcon,
    ArrowBack: MockIcon,
    Add: MockIcon,
  }
})
