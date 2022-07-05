export interface LoadTestResultsRepository {
  load: (accountId: string, challengeId: string) => Promise<LoadTestResultsRepository.Result>
}

export namespace LoadTestResultsRepository {
  export interface Result {
    completed: boolean
    score?: number
  }
}
