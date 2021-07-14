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

auth.register(registerDto).then((user: User) => {
  console.log(user);
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

auth.login(loginDto).then((user: User) => {
  console.log(user);
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