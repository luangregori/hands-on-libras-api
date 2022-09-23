import { LessonModel } from '@/domain/models'

export interface LoadLessons {
  load: (categoryId?: string) => Promise<LoadLessons.Result>
}

export namespace LoadLessons {
  export type Result = LessonModel[]
}
