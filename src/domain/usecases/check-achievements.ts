export interface CheckAchievements {
  check: (accountId: string) => Promise<void>
}
