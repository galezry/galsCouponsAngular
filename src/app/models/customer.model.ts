import { Coupon } from "./coupon.model";

export class Customer {
    constructor(
        private _id?: number,
        private _firstName?: string,
        private _lastName?: string,
        private _email?: string,
        private _password?: string,
        private _coupons?: Coupon[]
      ) {}


      set id(id: number) {
          this._id = id;
      }

      get id(): number {
        return this._id?this._id:0;
      }

      set firstName(firstName: string) {
        this._firstName = firstName;
      }

      get firstName(): string {
        return this._firstName?this._firstName:'';
      }

      set lastName(lastName: string) {
        this._lastName = lastName;
      }

      get lastName(): string {
        return this._lastName?this._lastName:'';
      }

      set email(email: string) {
        this._email = email;
      }

      get email(): string {
        return this._email?this._email:'';
      }

      set password(password: string) {
        this._password = password;
      }

      get password(): string {
        return this._password?this._password:'';
      }

      set coupons(coupons: Coupon[]) {
        this._coupons = coupons;
      }

      get coupons(): Coupon[] {
        return this._coupons?this._coupons:[];
      }




}
