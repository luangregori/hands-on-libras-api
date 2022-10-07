import faker from 'faker'
import { LoadRanking } from '@/domain/usecases'

export class LoadRankingSpy implements LoadRanking {
  params: LoadRanking.Params
  result = [{
    position: faker.datatype.number(),
    name: faker.name.findName(),
    score: faker.datatype.number(),
    id: faker.datatype.uuid()
  }]

  async load (params: LoadRanking.Params): Promise<LoadRanking.Result[]> {
    this.params = params
    return this.result
  }
}
