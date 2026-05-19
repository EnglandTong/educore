import type { ApiSuccess } from '@educore/types'
import { api } from './client'

export interface DonationResult {
  id: string
  donorName: string
  amount: number
  message?: string
  status: string
  completedAt?: string
  createdAt: string
}

export interface DonationInfo {
  mission: string
  missionDetail: string
  totalRaised: number
  totalDonors: number
  studentsHelped: number
  schoolsSupported: number
  fundsBreakdown: { label: string; percentage: number; description: string }[]
}

export interface DonationImpact {
  totalRaised: number
  totalDonations: number
  totalDonors: number
  studentsHelped: number
  schoolsSupported: number
  avgDonation: number
  largestDonation: number
  recentStories: { name: string; quote: string; role: string }[]
}

export async function createDonation(input: {
  donorName: string
  email: string
  amount: number
  message?: string
  isPublic?: boolean
}): Promise<DonationResult> {
  const res = await api.post<ApiSuccess<unknown>>('/donation/donate', input)
  if (!res.data.success) throw new Error('Donation failed')
  const data = res.data.data as Record<string, unknown>
  return data.donation as DonationResult
}

export async function fetchDonations(): Promise<DonationResult[]> {
  const res = await api.get<ApiSuccess<unknown>>('/donation/list')
  if (!res.data.success) throw new Error('Could not load donations')
  const data = res.data.data as Record<string, unknown>
  return data.donations as DonationResult[]
}

export async function fetchDonationInfo(): Promise<DonationInfo> {
  const res = await api.get<ApiSuccess<unknown>>('/donation/info')
  if (!res.data.success) throw new Error('Could not load donation info')
  const data = res.data.data as Record<string, unknown>
  return data.info as DonationInfo
}

export async function fetchDonationImpact(): Promise<DonationImpact> {
  const res = await api.get<ApiSuccess<unknown>>('/donation/impact')
  if (!res.data.success) throw new Error('Could not load donation impact')
  const data = res.data.data as Record<string, unknown>
  return data.impact as DonationImpact
}
