export interface LoadAccountScore {
  load: (accountId: string) => Promise<number>
}
