export interface CheckEmailAccount {
  check: (email: string) => Promise<boolean>
}
