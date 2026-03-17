export type Plan = 'monthly' | 'yearly'
export type Locale = 'en' | 'th'

export interface WaitlistEntry {
  id: string
  email: string
  plan: Plan
  locale: Locale
  created_at: string
}

export interface WaitlistFormData {
  email: string
  plan: Plan
  locale: Locale
}
