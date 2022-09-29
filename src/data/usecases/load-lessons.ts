import { LoadLessons } from '@/domain/usecases'
import { FindAllLessonsRepository, FindLessonsByCategoryIdRepository } from '@/data/protocols'

export class DbLoadLessons implements LoadLessons {
  constructor (
    private readonly findAllLessonsRepository: FindAllLessonsRepository,
    private readonly findLessonsByCategoryIdRepository: FindLessonsByCategoryIdRepository
  ) {}

  async load (categoryId?: string): Promise<LoadLessons.Result> {
    return categoryId
      ? await this.findLessonsByCategoryIdRepository.findByCategoryId(categoryId)
      : await this.findAllLessonsRepository.findAll()
  }
}
