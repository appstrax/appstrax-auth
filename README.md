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


## Fetch Users

### Public Availability
By default the Auth API restricts public access to fetching other users (users other than the currently authenticated user).

In order to activate public access to fetch users, in the administrative panel click on the following:
 - Configuration tab 
 - Public Access 
 - Toggle 'Allow Public Access'


### Querying Users
You can query other users with the `UserService`.

```typescript
import { users } from '@appstrax/auth';
```

Use the `find()` function on `users` (the UserService) to query/fetch other users.
The `find()` function takes a `FetchQuery` as an argument:

```typescript
interface FetchQuery {
  // Conditions to query data
  where?: Where;
  // ASC, DESC Order
  order?: Order;
  // Pagination variables
  offset?: number;
  limit?: number;
}
```
the `where` field in a `FetchQuery` should be made up as follows:

```typescript
{
 where: {
    [Operator.AND]: [{ a: 5 }, { b: 6 }],  // (a = 5) AND (b = 6)
    [Operator.OR]: [{ a: 5 }, { b: 6 }],   // (a = 5) OR (b = 6)
    <someAttribute>: {
      [Operator.EQUAL]: 3,                 // = 3
      [Operator.NOT_EQUAL]: 20,            // != 20
      [Operator.OR]: [5, 6],               // (someAttribute = 5) OR (someAttribute = 6)
      [Operator.GT]: 6,                    // > 6
      [Operator.GTE]: 6,                   // >= 6
      [Operator.LT]: 10,                   // < 10
      [Operator.LTE]: 10,                  // <= 10
      [Operator.IN]: [1, 2],               // IN [1, 2]
      [Operator.LIKE]: 'hat',              // LIKE 'hat'
      [Operator.NOT_LIKE]: 'hat',          // NOT LIKE 'hat'
    }
  }
}
```

### Available Operators

```typescript
enum Operator {
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



## Examples

A query to search for Users: 

WHERE
- `email` is 'LIKE' 'Joe'  

ORDER BY  
- `email` ascending

Return the first 5 

```typescript
import { users, Operator, OrderDirection  } from '@appstrax/auth';

...

let search = 'Joe';

const result = await users.find({
  where: { email: { [Operator.LIKE]: search } },
  order: { email: OrderDirection.ASC },
  offset: 0,
  limit: 5,
});

const totalUsers = result.count;
const fetchedUsers = result.data;
```

A query to search for Users:  

WHERE
- `email` is 'LIKE' 'Joe'
- 'OR' `name` is 'LIKE' 'Joe'  
- 'OR' `surname` is 'LIKE' 'Joe'  
  
No order  

RETURN
- elements 6 to 10

```typescript
import { users, Operator } from '@appstrax/auth';

...

let search = 'Joe';

const result = await users.find({
  where: {
    [Operator.OR]: [
      { email: { [Operator.LIKE]: search } },
      { name: { [Operator.LIKE]: search } },
      { surname: { [Operator.LIKE]: search } },
    ],
  },
  offset: 1,
  limit: 5,
});

const totalUsers = result.count;
const fetchedUsers = result.data;
```

