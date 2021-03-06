import { CategoryModel } from '@/domain/models/category'

export interface LoadCategories {
  load: () => Promise<LoadCategories.Result>
}

export namespace LoadCategories {
  export type Result = CategoryModel[]
}
