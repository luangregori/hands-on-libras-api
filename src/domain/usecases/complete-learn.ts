export interface CompleteLearn {
  complete: (completeLearnParams: CompleteLearn.Params) => Promise<boolean>
}

export namespace CompleteLearn {
  export interface Params {
    challengeId: string
    accountId: string
  }
}
