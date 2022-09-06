export interface TestResultModel {
  id: string
  accountId: string
  challengeId: string
  status: StatusTestResult
  score?: number
}

export enum StatusTestResult {
  STARTED = 'started',
  LEARNED = 'learned',
  TESTED = 'tested',
  COMPLETED = 'completed'
}
