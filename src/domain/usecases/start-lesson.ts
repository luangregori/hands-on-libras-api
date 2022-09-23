import { ChallengeResultModel, LessonModel } from '../models'

export interface StartLesson {
  start: (startLessonParams: StartLesson.Params) => Promise<StartLesson.Result>
}

export namespace StartLesson {
  export interface Params {
    lessonId: string
    accountId: string
  }

  export interface Result {
    lessonInfo: LessonModel
    userInfo: ChallengeResultModel
  }
}
