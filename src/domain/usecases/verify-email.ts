export interface VerifyEmail {
  verify: (accountId: string) => Promise<boolean>
}
