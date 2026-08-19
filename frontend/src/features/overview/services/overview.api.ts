import { apiClient } from '@/services/api/client'
import type { ApiEnvelope } from '@/services/api/response.type'

import type { DateRange, OverviewStats } from '../types/overview.types'

export async function getOverviewStats(range: DateRange): Promise<OverviewStats> {
  const response = await apiClient.get<ApiEnvelope<OverviewStats>>('/overview/stats', {
    params: { from: range.from || undefined, to: range.to || undefined },
  })
  return response.data.data
}
