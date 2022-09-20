export interface CompleteTest {
  complete: (completeLearnParams: CompleteTest.Params) => Promise<boolean>
}

export namespace CompleteTest {
  export interface Params {
    challengeId: string
    accountId: string
    lives: number
  }
}
