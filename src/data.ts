import type { ActivityItem, Order, UploadRecord } from './types'

const isoDaysAgo = (days: number, hour = 10) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, 24, 0, 0)
  return date.toISOString()
}

export const demoOrders: Order[] = [
  {
    id: 'SV-2084', customerName: 'Northwind Retail Group', policyNumber: 'GL-8842-19', policyType: 'Commercial general liability',
    effectiveDate: '2026-12-01', expirationDate: '2027-12-01', premium: '$4,280.00', broker: 'Maya Bennett', region: 'Pacific Northwest',
    email: 'risk@northwindretail.com', phone: '+1 (206) 555-0194', status: 'Ready to bind', sourceFile: 'Northwind_GL_renewal.pdf', uploadedAt: isoDaysAgo(0, 9),
  },
  {
    id: 'SV-2083', customerName: 'Juniper & Rowe Studio', policyNumber: 'BOP-2190-06', policyType: 'Business owners package',
    effectiveDate: '2026-11-28', expirationDate: '2027-11-28', premium: '$2,960.00', broker: 'Daniel Cho', region: 'Mid-Atlantic',
    email: 'finance@juniperrowe.co', phone: '+1 (212) 555-0138', status: 'In review', sourceFile: 'Juniper_BOP_application.pdf', uploadedAt: isoDaysAgo(0, 8),
  },
  {
    id: 'SV-2082', customerName: 'Cedarline Logistics', policyNumber: 'WC-4071-55', policyType: 'Workers compensation',
    effectiveDate: '2026-12-15', expirationDate: '2027-12-15', premium: '$8,740.00', broker: 'Priya Shah', region: 'Southeast',
    email: 'ops@cedarlinelogistics.com', phone: '+1 (404) 555-0185', status: 'Needs review', sourceFile: 'Cedarline_WC_submission.pdf', uploadedAt: isoDaysAgo(1, 15),
  },
  {
    id: 'SV-2081', customerName: 'Lumen Health Partners', policyNumber: 'PL-5902-31', policyType: 'Professional liability',
    effectiveDate: '2026-11-26', expirationDate: '2027-11-26', premium: '$6,150.00', broker: 'Jordan Ellis', region: 'Southwest',
    email: 'legal@lumenhealth.com', phone: '+1 (602) 555-0141', status: 'Bound', sourceFile: 'Lumen_PL_declarations.pdf', uploadedAt: isoDaysAgo(2, 13),
  },
  {
    id: 'SV-2080', customerName: 'Atlas & Pine Hospitality', policyNumber: 'PROP-7720-04', policyType: 'Commercial property',
    effectiveDate: '2026-12-03', expirationDate: '2027-12-03', premium: '$12,480.00', broker: 'Maya Bennett', region: 'Mountain West',
    email: 'admin@atlaspine.com', phone: '+1 (303) 555-0177', status: 'Flagged', sourceFile: 'Atlas_Pine_property_schedule.pdf', uploadedAt: isoDaysAgo(3, 11),
  },
  {
    id: 'SV-2079', customerName: 'Hearthside Makers Co.', policyNumber: 'GL-3610-27', policyType: 'Commercial general liability',
    effectiveDate: '2026-11-21', expirationDate: '2027-11-21', premium: '$3,320.00', broker: 'Leah Carter', region: 'Great Lakes',
    email: 'hello@hearthsidemakers.com', phone: '+1 (312) 555-0112', status: 'Renewal due', sourceFile: 'Hearthside_GL_renewal.pdf', uploadedAt: isoDaysAgo(5, 10),
  },
  {
    id: 'SV-2078', customerName: 'Solace Architecture', policyNumber: 'E&O-1128-14', policyType: 'Errors & omissions',
    effectiveDate: '2026-12-10', expirationDate: '2027-12-10', premium: '$5,840.00', broker: 'Daniel Cho', region: 'Northeast',
    email: 'studio@solacearch.com', phone: '+1 (617) 555-0120', status: 'In review', sourceFile: 'Solace_EO_application.pdf', uploadedAt: isoDaysAgo(7, 14),
  },
]

export const demoUploads: UploadRecord[] = [
  { id: 'UP-972', name: 'Cedarline_WC_submission.pdf', size: 2840000, uploadedAt: isoDaysAgo(1, 15), kind: 'PDF document', status: 'Added to orders' },
  { id: 'UP-971', name: 'Juniper_BOP_application.pdf', size: 1860000, uploadedAt: isoDaysAgo(2, 11), kind: 'PDF document', status: 'Added to orders' },
  { id: 'UP-970', name: 'Northwind_GL_renewal.pdf', size: 3260000, uploadedAt: isoDaysAgo(3, 9), kind: 'PDF document', status: 'Added to orders' },
]

export const demoActivity: ActivityItem[] = [
  { id: 'AC-4', title: 'Order ready to bind', detail: 'SV-2084 · Northwind Retail Group', createdAt: isoDaysAgo(0, 9), kind: 'bind' },
  { id: 'AC-3', title: 'Document added to review', detail: 'SV-2082 · Cedarline Logistics', createdAt: isoDaysAgo(1, 15), kind: 'upload' },
  { id: 'AC-2', title: 'Policy details updated', detail: 'SV-2083 · Juniper & Rowe Studio', createdAt: isoDaysAgo(2, 12), kind: 'edit' },
  { id: 'AC-1', title: 'New order created', detail: 'SV-2084 · Northwind Retail Group', createdAt: isoDaysAgo(3, 10), kind: 'order' },
]
