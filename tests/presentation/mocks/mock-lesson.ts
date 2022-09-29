import {
  LoadLessons,
  StartLesson,
  LearnLesson,
  CompleteLearn,
  ChallengeLesson,
  CompleteChallenge
} from '@/domain/usecases'
import {
  mockLessonModel,
  mockChallengeResultModel,
  mockLearningInfoModel,
  mockChallengeQuestionModel
} from '@/tests/domain/mocks'

export class LoadLessonsSpy implements LoadLessons {
  result = [mockLessonModel()]

  async load(categoryId?: string): Promise<LoadLessons.Result> {
    return this.result
  }
}

export class StartLessonSpy implements StartLesson {
  params: StartLesson.Params
  result = {
    lessonInfo: mockLessonModel(),
    userInfo: mockChallengeResultModel()
  }

  async start(params: StartLesson.Params): Promise<StartLesson.Result> {
    this.params = params
    return this.result
  }
}

export class LearnLessonSpy implements LearnLesson {
  result = [mockLearningInfoModel()]

  async learn(lessonId: string): Promise<LearnLesson.Result> {
    return this.result
  }
}

export class CompleteLearnSpy implements CompleteLearn {
  params: CompleteLearn.Params
  result = true

  async complete(params: CompleteLearn.Params): Promise<boolean> {
    this.params = params
    return this.result
  }
}

export class ChallengeLessonSpy implements ChallengeLesson {
  params: ChallengeLesson.Params
  result = [mockChallengeQuestionModel()]

  async test(params: ChallengeLesson.Params): Promise<ChallengeLesson.Result> {
    this.params = params
    return this.result
  }
}

export class CompleteChallengeSpy implements CompleteChallenge {
  params: CompleteChallenge.Params
  result = true

  async complete(params: CompleteChallenge.Params): Promise<boolean> {
    this.params = params
    return this.result
  }
}