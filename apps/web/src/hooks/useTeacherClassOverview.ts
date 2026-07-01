import { useQuery } from '@tanstack/react-query'

import { fetchClassOverview, type ClassOverview } from '@/api/teacher'

export function useTeacherClassOverview() {
  return useQuery<ClassOverview | null, Error>({
    queryKey: ['teacher', 'class', 'overview'],
    queryFn: fetchClassOverview,
  })
}
