import { LearningInfoModel } from '@/domain/models'

export interface LearnLesson {
  learn: (lessonId: string) => Promise<LearnLesson.Result>
}

export namespace LearnLesson {
  export type Result = LearningInfoModel[]
}
