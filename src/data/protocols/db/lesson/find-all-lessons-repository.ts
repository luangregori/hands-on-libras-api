import { LessonModel } from '@/domain/models'

export interface FindAllLessonsRepository{
  findAll: () => Promise<LessonModel[]>
}
