export interface LoadRanking {
  load: (loadRankingParams: LoadRanking.Params) => Promise<LoadRanking.Result[]>
}

export namespace LoadRanking {
  export interface Params {
    days: number
  }

  export interface Result {
    position: number
    name: string
    score: number
    id: string
  }
}
