export interface ChallengeResultModel {
  id: string
  accountId: string
  lessonId: string
  status: StatusChallengeResult
  score: number
  updatedAt: Date
}

export enum StatusChallengeResult {
  STARTED = 'started',
  LEARNED = 'learned',
  TESTED = 'tested',
  COMPLETED = 'completed'
}
