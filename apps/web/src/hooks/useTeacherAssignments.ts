import { useQuery } from '@tanstack/react-query'

import { fetchTeacherAssignments, type TeacherAssignmentItem } from '@/api/teacher'

export function useTeacherAssignments() {
  return useQuery<TeacherAssignmentItem[], Error>({
    queryKey: ['teacher', 'assignments'],
    queryFn: fetchTeacherAssignments,
  })
}
