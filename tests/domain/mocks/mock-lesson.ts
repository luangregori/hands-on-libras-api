import faker from 'faker'
import {
  LessonModel,
  LearningInfoModel,
  ChallengeResultModel,
  StatusChallengeResult,
  ChallengeQuestionModel
} from '@/domain/models'

export const mockLessonModel = (): LessonModel => ({
  id: faker.name.findName(),
  name: faker.name.findName(),
  image_url: faker.internet.url(),
  description: faker.random.words(),
  categoryId: faker.datatype.uuid()
})

export const mockLearningInfoModel = (): LearningInfoModel => ({
  id: faker.name.findName(),
  description: faker.random.words(),
  word: faker.random.word(),
  lessonId: faker.datatype.uuid()
})

export const mockChallengeResultModel = (): ChallengeResultModel => ({
  id: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  lessonId: faker.datatype.uuid(),
  status: StatusChallengeResult.COMPLETED,
  score: faker.datatype.number(),
  updatedAt: faker.datatype.datetime()
})

export const mockChallengeQuestionModel = (): ChallengeQuestionModel => ({
  id: faker.name.findName(),
  word: faker.random.word(),
  options: [faker.random.word()],
  lessonId: faker.datatype.uuid()
})
