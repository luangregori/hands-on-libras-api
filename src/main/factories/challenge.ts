import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import {
  LogMongoRepositoiry,
  ChallengeMongoRepository,
  TestResultMongoRepository,
  LearningInfoMongoRepository,
  TestQuestionMongoRepository
} from '@/infra/db'
import {
  CompleteLearnController,
  LearnChallengeController,
  LoadChallengesController,
  StartChallengeController,
  TestChallengeController,
  CompleteTestController
} from '@/presentation/controllers'
import {
  DbLoadChallenges,
  DbStartChallenge,
  DbLearnChallenge,
  DbCompleteLearn,
  DbTestChallenge,
  DbCompleteTest
} from '@/data/usecases'

export const makeLoadChallengesController = (): Controller => {
  const challengeMongoRepository = new ChallengeMongoRepository()
  const dbLoadChallenges = new DbLoadChallenges(challengeMongoRepository, challengeMongoRepository)
  const loadCategoriesController = new LoadChallengesController(dbLoadChallenges)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(loadCategoriesController, logMongoRepositoiry)
}

export const makeStartChallengeController = (): Controller => {
  const challengeMongoRepository = new ChallengeMongoRepository()
  const testResultMongoRepository = new TestResultMongoRepository()
  const dbStartChallenge = new DbStartChallenge(challengeMongoRepository, testResultMongoRepository)
  const startChallengeController = new StartChallengeController(dbStartChallenge)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(startChallengeController, logMongoRepositoiry)
}

export const makeLearnChallengeController = (): Controller => {
  const findLearningInfoRepository = new LearningInfoMongoRepository()
  const dbLearnChallenge = new DbLearnChallenge(findLearningInfoRepository)
  const learnChallengeController = new LearnChallengeController(dbLearnChallenge)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(learnChallengeController, logMongoRepositoiry)
}

export const makeCompleteLearnController = (): Controller => {
  const testResultMongoRepository = new TestResultMongoRepository()
  const dbCompleteLearn = new DbCompleteLearn(testResultMongoRepository, testResultMongoRepository)
  const completeLearnController = new CompleteLearnController(dbCompleteLearn)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(completeLearnController, logMongoRepositoiry)
}

export const makeTestChallengeController = (): Controller => {
  const testResultMongoRepository = new TestResultMongoRepository()
  const testQuestionMongoRepository = new TestQuestionMongoRepository()
  const dbTestChallenge = new DbTestChallenge(testResultMongoRepository, testQuestionMongoRepository)
  const testChallengeController = new TestChallengeController(dbTestChallenge)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(testChallengeController, logMongoRepositoiry)
}

export const makeCompleteTestController = (): Controller => {
  const testResultMongoRepository = new TestResultMongoRepository()
  const dbCompleteTest = new DbCompleteTest(testResultMongoRepository, testResultMongoRepository)
  const completeLearnController = new CompleteTestController(dbCompleteTest)
  const logMongoRepositoiry = new LogMongoRepositoiry()
  return new LogControllerDecorator(completeLearnController, logMongoRepositoiry)
}
