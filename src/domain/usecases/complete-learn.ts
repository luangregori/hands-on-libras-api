export interface CompleteLearn {
  complete: (challengeId: string) => Promise<boolean>
}
