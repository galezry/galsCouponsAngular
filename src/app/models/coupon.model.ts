import { Category } from "./category.model";

export class Coupon {

    constructor(
      public id: number = 0,
      public companyId: number = 0,
      public categoryId: Category  = Category.NONE,
      public title: string = '',
      public description: string = '',
      public startDate: Date = new Date(),
      public endDate: Date  = new Date(),
      public amount: number = 0,
      public price: number = 0,
      public image: string = ''
    ) {}

}
