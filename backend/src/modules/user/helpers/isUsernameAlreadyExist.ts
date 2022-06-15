import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { createMethodDecorator } from "type-graphql";
import { Service } from "typedi";
import { RegisterInput } from "../input";
import UserModel, { UserMongooseModel } from "../model";

// @Service()
// @ValidatorConstraint({ async: true })
// export class IsUsernameAlreadyExistConstraint
//   implements ValidatorConstraintInterface
// {
//   constructor(private readonly userModel: UserModel) {}

//   validate(username: string) {
//     return this.userModel.getByUsername(username).then((user) => {
//       if (user) return false;
//       return true;
//     });
//   }
// }
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(userName: string) {
    return UserMongooseModel.findOne({username: userName}).then(user => {
      if (user) return false;
      return true;
    });
  }
}

// export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isLongerThan',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property],
//       options: validationOptions,
//       validator: {
//         validate(username: string) {
//           return this.userModel.getByUsername(username).then((user) => {
//             if (user) return false;
//             return true;
//           });
//         }
//       },
//     });
//   };
// }

// export function IsUsernameAlreadyExist() {

//   return createMethodDecorator(async ({ args }, next) => {
//     // here place your middleware code that uses custom decorator arguments

//     // e.g. validation logic based on schema using joi
//     await joiValidate(schema, args);
//     return next();
//   });
//   return function (object: RegisterInput, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsUsernameAlreadyExistConstraint,
//     });
//   };
// }

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}