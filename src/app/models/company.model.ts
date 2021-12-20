import { Coupon } from "./coupon.model";

export class Company {


      // constructor(
      //   public id?: number,
      //   public name?: string,
      //   public email?: string,
      //   public password?: string,
      //   public coupons?: Coupon[]
      // ) {}
    
      constructor(
        private _id?: number,
        private _name?: string,
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

      set name(name: string) {
        this._name = name;
      }

      get name(): string {
        return this._name?this._name:'';
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
