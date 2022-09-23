export interface CompleteChallenge {
  complete: (completeTestParams: CompleteChallenge.Params) => Promise<boolean>
}

export namespace CompleteChallenge {
  export interface Params {
    lessonId: string
    accountId: string
    lives: number
  }
}
