import { CategoryModel } from '@/domain/models/category'

export interface FindAllCategoriesRepository{
  findAll: () => Promise<CategoryModel[]>
}
