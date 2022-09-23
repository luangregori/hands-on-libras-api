export interface ChallengeResultModel {
  id: string
  accountId: string
  challengeId: string
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
