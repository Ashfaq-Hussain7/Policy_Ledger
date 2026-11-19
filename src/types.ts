export type OrderStatus = 'Ready to bind' | 'In review' | 'Needs review' | 'Bound' | 'Renewal due' | 'Flagged'

export interface Order {
  id: string
  customerName: string
  policyNumber: string
  policyType: string
  effectiveDate: string
  expirationDate: string
  premium: string
  broker: string
  region: string
  email: string
  phone: string
  status: string
  sourceFile: string
  uploadedAt: string
}

export interface UploadRecord {
  id: string
  name: string
  size: number
  uploadedAt: string
  kind: string
  status: string
}

export interface UploadFile extends UploadRecord {
  file?: File
  objectUrl?: string
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  createdAt: string
  kind: 'edit' | 'upload' | 'order' | 'bind'
}

export type OrderField = keyof Order
