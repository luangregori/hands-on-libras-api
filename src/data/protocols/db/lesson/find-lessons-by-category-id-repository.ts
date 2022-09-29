import { LessonModel } from '@/domain/models'

export interface FindLessonsByCategoryIdRepository{
  findByCategoryId: (categoryId: string) => Promise<LessonModel[]>
}
