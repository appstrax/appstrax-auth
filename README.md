# @appstrax/auth

This library contains a simple auth service, which allows you to easily integrate authentication into your web applications.

## Getting Started

Create your Appstrax API here: https://codecapsules.io/.

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
