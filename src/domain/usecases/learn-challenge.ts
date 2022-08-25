export interface LearnChallenge {
  learn: (challengeId: string) => Promise<LearnChallenge.Result>
}

export namespace LearnChallenge {
  export interface Result {
    id: string
    description: string
    word: string
    challengeId: string
  }
}
