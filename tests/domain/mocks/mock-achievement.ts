import faker from 'faker'
import { AchievementModel } from '@/domain/models'

export const mockAchievementModel = (): AchievementModel => ({
  id: faker.name.findName(),
  name: faker.name.findName(),
  accountId: faker.datatype.uuid(),
  icon: faker.name.findName()
})
