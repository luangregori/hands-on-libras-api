import { LoadCategories } from '@/domain/usecases'
import { mockCategoryModel } from '@/tests/domain/mocks'

export class LoadCategoriesSpy implements LoadCategories {
  result = [mockCategoryModel()]

  async load(): Promise<LoadCategories.Result> {
    return this.result
  }
}
