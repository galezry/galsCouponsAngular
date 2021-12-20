import { UserType } from "./user-type.model";

export class Login {
  // a model is a data object. like beans in Java

    constructor(
      public email?: string,
      public password?: string,
      public type?: UserType,
    ) {}
}
