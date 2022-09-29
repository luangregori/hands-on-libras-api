import { ChallengeQuestionModel } from '@/domain/models'

export interface ChallengeLesson {
  test: (ChallengeLessonParams: ChallengeLesson.Params) => Promise<ChallengeLesson.Result>
}

export namespace ChallengeLesson {
  export interface Params {
    lessonId: string
    accountId: string
  }

  export type Result = ChallengeQuestionModel[]
}
