export interface LoadUserScore {
  load: (accountId: string) => Promise<number>
}
