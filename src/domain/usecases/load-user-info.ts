export interface LoadUserInfo {
  load: (accountId: string) => Promise<LoadUserInfo.Result>
}

export namespace LoadUserInfo {
  export interface Result {
    name: string
    image_url: string
    score: number
    ranking: number
    achievements: string[]
  }
}
