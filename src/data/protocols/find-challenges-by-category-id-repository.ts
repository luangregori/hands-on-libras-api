import { ChallengeModel } from '@/domain/models/challenge'

export interface FindChallengesByCategoryIdRepository{
  findbyId: (categoryId: string) => Promise<ChallengeModel[]>
}
