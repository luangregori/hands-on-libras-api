import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import {
  LogMongoRepository,
  LessonMongoRepository,
  ChallengeResultMongoRepository,
  LearningInfoMongoRepository,
  ChallengeQuestionMongoRepository
} from '@/infra/db'
import {
  CompleteLearnController,
  LearnLessonController,
  LoadLessonsController,
  StartLessonController,
  ChallengeLessonController,
  CompleteChallengeController
} from '@/presentation/controllers'
import {
  DbLoadLessons,
  DbStartLesson,
  DbLearnLesson,
  DbCompleteLearn,
  DbChallengeLesson,
  DbCompleteChallenge
} from '@/data/usecases'

export const makeLoadLessonController = (): Controller => {
  const lessonMongoRepository = new LessonMongoRepository()
  const dbLoadLessons = new DbLoadLessons(lessonMongoRepository, lessonMongoRepository)
  const loadLessonController = new LoadLessonsController(dbLoadLessons)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loadLessonController, logMongoRepository)
}

export const makeStartLessonController = (): Controller => {
  const lessonMongoRepository = new LessonMongoRepository()
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const dbStartLesson = new DbStartLesson(lessonMongoRepository, challengeResultMongoRepository)
  const startLessonController = new StartLessonController(dbStartLesson)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(startLessonController, logMongoRepository)
}

export const makeLearnLessonController = (): Controller => {
  const findLearningInfoRepository = new LearningInfoMongoRepository()
  const dbLearnLesson = new DbLearnLesson(findLearningInfoRepository)
  const learnLessonController = new LearnLessonController(dbLearnLesson)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(learnLessonController, logMongoRepository)
}

export const makeCompleteLearnController = (): Controller => {
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const dbCompleteLearn = new DbCompleteLearn(challengeResultMongoRepository, challengeResultMongoRepository)
  const completeLearnController = new CompleteLearnController(dbCompleteLearn)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(completeLearnController, logMongoRepository)
}

export const makeChallengeLessonController = (): Controller => {
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const challengeQuestionMongoRepository = new ChallengeQuestionMongoRepository()
  const dbChallengeLesson = new DbChallengeLesson(challengeResultMongoRepository, challengeResultMongoRepository, challengeQuestionMongoRepository)
  const challengeLessonController = new ChallengeLessonController(dbChallengeLesson)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(challengeLessonController, logMongoRepository)
}

export const makeCompleteChallengeController = (): Controller => {
  const challengeResultMongoRepository = new ChallengeResultMongoRepository()
  const dbCompleteChallenge = new DbCompleteChallenge(challengeResultMongoRepository, challengeResultMongoRepository)
  const completeChallengeController = new CompleteChallengeController(dbCompleteChallenge)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(completeChallengeController, logMongoRepository)
}
