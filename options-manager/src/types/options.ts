export interface Option {
  id: string
  name: string
  color: string
  order: number
  active: boolean
  type?: 'status' | 'priority' | 'classification' // Optional property
}
