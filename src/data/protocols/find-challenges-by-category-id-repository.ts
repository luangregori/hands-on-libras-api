import { ChallengeModel } from '@/domain/models/challenge'

export interface FindChallengesByCategoryIdRepository{
  findByCategoryId: (categoryId: string) => Promise<ChallengeModel[]>
}
