import { CategoryModel } from '@/domain/models'

import faker from 'faker'

export const mockCategoryModel = (): CategoryModel => ({
  id: faker.name.findName(),
  name: faker.random.word(),
})
