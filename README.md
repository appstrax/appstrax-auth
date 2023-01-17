# @appstrax/auth

This library contains a simple auth service, which allows you to easily integrate authentication into your web applications.

## Getting Started

Create your Appstrax Auth API here: https://codecapsules.io/.

## Installation

```bash
npm install @appstrax/auth --save
```

## Setup

Initialize the `auth` library:

```javascript
// import the auth library
import { auth } from '@appstrax/auth';

// initialize the auth service
const apiUrl = 'YOUR API URL HERE'; // eg. appstrax-auth-api-snidtu.codecapsules.co.za
auth.init(apiUrl);
```

## Registration

```javascript
import { auth } from '@appstrax/auth';

const registerDto: RegisterDto = {
  email: "joe@soap.com",
  password: "<password>",
  data: {
    // any additional/custom user fields
    name: "Joe",
    surname: "Soap",
    ...
  }
};

auth.register(registerDto).then((res: AuthResult) => {
  console.log(res.user);
}).catch(err => {
  console.log(err.message);
});
```

## Login

```javascript
import { auth } from '@appstrax/auth';

const loginDto: LoginDto = {
  email: "joe@soap.com",
  password: "<password>"
};

auth.login(loginDto).then((res: AuthResult) => {
  console.log(res.status);
  console.log(res.user);
}).catch(err => {
  console.log(err.message);
});
```

## Forgot Password

```javascript
import { auth } from '@appstrax/auth';

const forgotDto: ForgotPasswordDto = {
  email: "joe@soap.com"
};

auth.forgotPassword(forgotDto).then((message: MessageDto) => {
  console.log(message.message);
}).catch(err => {
  console.log(err.message);
});
```

An email will be sent to the user with a password reset code, this code is only valid for 24 hours.


## Reset Password

```javascript
import { auth } from '@appstrax/auth';

const resetDto: ResetPasswordDto = {
  email: "joe@soap.com",
  code: "<code>", // the code emailed to the user
  password: "<password>" // the user's new password
};

auth.resetPassword(resetDto).then((message: MessageDto) => {
  console.log(message.message);
}).catch(err => {
  console.log(err.message);
});
```

The password is now reset, however the user will now need to login with their new password.


## Change Password

```javascript
import { auth } from '@appstrax/auth';

const changePasswordDto: ChangePasswordDto = {
  password: "<current password>"
  newPassword: "<new password>"
};

auth.changePassword(changePasswordDto).then((message: MessageDto) => {
  console.log(message.message);
}).catch(err => {
  console.log(err.message);
});
```

Users can only change their password if they are already authenticated.


## Update User Data/Profile

```javascript
import { auth } from '@appstrax/auth';

const data: any = {
  // any additional/custom user fields
  name: "Joe",
  surname: "Soap",
  fancy: "field",
  ...
}

auth.saveUserData(data).then((user: User) => {
  console.log(user);
}).catch(err => {
  console.log(err.message);
});
```

Users can only update their data if they are already authenticated.

## Error Messages
```javascript
enum AuthErrors {
  // registration errors
  emailAddressAlreadyExists = 'emailAddressAlreadyExists',
  badlyFormattedEmailAddress = 'badlyFormattedEmailAddress',
  noPasswordSupplied = 'noPasswordSupplied',

  // login errors
  invalidEmailOrPassword = 'invalidEmailOrPassword',
  userBlocked = 'userBlocked',
  invalidTwoFactorAuthCode = 'invalidTwoFactorAuthCode',

  // forgot/reset password errors
  emailAddressDoesNotExist = 'emailAddressDoesNotExist',
  invalidResetCode = 'invalidResetCode',

  // unknown errors
  unexpectedError = 'unexpectedError',
}
```


## Find Users

## Public Availability

Admin Panel -> Configuration tab -> Public Access -> toggle 'Allow Public Access'

## Querying Users

The find() function takes FetchQuery as an argument

```javascript
export interface FetchQuery {
  // Conditions to query data
  where?: Where;
  // ASC, DESC Order
  order?: Order;
  // Pagination variables
  offset?: number;
  limit?: number;
}

export interface Where {
  [key: string | Operator]: object | Operator | [] | number | string | boolean;
}

export enum OrderDirection {
  // Ascending Order Direction
  ASC = 'ASC',
  // Descending Order Direction
  DESC = 'DESC',
}
```

## Available Operators

```javascript
export enum Operator {
  // Equal To Operator
  EQUAL = 'EQUAL',
  // Not Equal To Operator
  NOT_EQUAL = 'NOT_EQUAL',
  // And Operator
  AND = 'AND',
  // Or Operator
  OR = 'OR',
  // Greater Than Operator
  GT = 'GT',
  // Greater Than or Equal To Operator
  GTE = 'GTE',
  // Less Than Operator
  LT = 'LT',
  // Less Than or Equal To Operator
  LTE = 'LTE',
  // Like Operator
  LIKE = 'LIKE',
  // Not Like Operator
  NOT_LIKE = 'NOT_LIKE',
  // In Operator
  IN = 'IN',
}
```

## Add your FetchQuery to the url as queryParams
- {baseUrl}/user?where={}&order={}&offset=0&limit=5

## Examples

A query to search for Users:  
Where -> email is 'LIKE' 'Joe'  
Ascending, ordered by email  
Return the first 5 

```javascript
import { users } from '@appstrax/auth';

users.find({
  // where: {"email":{"LIKE":"Joe"}}
  where: { email: { [Operator.LIKE]: this.search } },
  // order: {"email": "ASC"}
  order: {},
  offset: 0,
  limit: 5,
});

this.totalUsers = result.count;
this.userData = result.data;
```

A query to search for Users:  
Where -> email is 'LIKE' 'Joe'  
'OR'  
name is 'LIKE' 'Joe'  
'OR'  
surname is 'LIKE' 'Joe'  
No order  
Return the first 5

```javascript
import { users } from '@appstrax/auth';

users.find({
  // where: {"OR":[{"email":{"LIKE":"cam"}},{"name":{"LIKE":"cam"}},{"surname":{"LIKE":"cam"}}]}
  where: {
    [Operator.OR]: [
      { email: { [Operator.LIKE]: this.search } },
      { name: { [Operator.LIKE]: this.search } },
      { surname: { [Operator.LIKE]: this.search } },
    ],
  },
  // order: {"email":"ASC"}
  order: {"email": OrderDirection.ASC},
  offset: 0,
  limit: 5,
});

this.totalUsers = result.count;
this.userData = result.data;
```

