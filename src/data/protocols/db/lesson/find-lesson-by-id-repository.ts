import { LessonModel } from '@/domain/models'

export interface FindLessonByIdRepository {
  findById: (lessonId: string) => Promise<LessonModel>
}
