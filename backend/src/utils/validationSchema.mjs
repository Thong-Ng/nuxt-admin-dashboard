export const createUserValidationSchema = {
  username: {
    isString: {
      errorMessage: "username must be a string",
    },
    notEmpty: {
      errorMessage: "username cannot be empty",
    },
  },
  password: {
    isString: {
      errorMessage: "password must be a string",
    },
    notEmpty: {
      errorMessage: "password cannot be empty",
    },
  },
  name: {
    isString: {
      errorMessage: "displayName must be a string",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Invalid email",
    },
    notEmpty: {
      errorMessage: "email cannot be empty",
    },
  },
  phone: {
    optional: true,
    isString: {
      errorMessage: "phone must be a string",
    },
  },
  role: {
    isString: {
      errorMessage: "role must be a string",
    },
    notEmpty: {
      errorMessage: "role cannot be empty",
    },
  },
};

//update user validation schema
export const updateUserValidationSchema = {
  id: {
    isInt: {
      errorMessage: "id must be an integer",
    },
    notEmpty: {
      errorMessage: "id cannot be empty",
    },
  },
  name: {
    optional: true,
    isString: {
      errorMessage: "displayName must be a string",
    },
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  phone: {
    optional: true,
    isString: {
      errorMessage: "phone must be a string",
    },
  },
  role: {
    optional: true,
    isString: {
      errorMessage: "role must be a string",
    },
  },
};

//update user password validation schema
export const updateUserPasswordValidationSchema = {
  id: {
    isInt: {
      errorMessage: "id must be an integer",
    },
    notEmpty: {
      errorMessage: "id cannot be empty",
    },
  },
  password: {
    isString: {
      errorMessage: "password must be a string",
    },
    notEmpty: {
      errorMessage: "password cannot be empty",
    },
  },
};

//courts validation schema
export const createCourtValidationSchema = {
  name: {
    isString: {
      errorMessage: "name must be a string",
    },
    notEmpty: {
      errorMessage: "name cannot be empty",
    },
  },
  type: {
    isString: {
      errorMessage: "type must be a string",
    },
    notEmpty: {
      errorMessage: "type cannot be empty",
    },
  },
};

//update court validation schema
export const updateCourtValidationSchema = {
  id: {
    isInt: {
      errorMessage: "id must be an integer",
    },
    notEmpty: {
      errorMessage: "id cannot be empty",
    },
  },
  name: {
    isString: {
      errorMessage: "name must be a string",
    },
    notEmpty: {
      errorMessage: "name cannot be empty",
    },
  },
  type: {
    isString: {
      errorMessage: "type must be a string",
    },
    notEmpty: {
      errorMessage: "type cannot be empty",
    },
  },
  status: {
    isString: {
      errorMessage: "status must be a string",
    },
    notEmpty: {
      errorMessage: "status cannot be empty",
    },
  },
};

//bookings validation schema
export const createBookingValidationSchema = {
  court_id: {
    isInt: {
      errorMessage: "court_id must be an integer",
    },
    notEmpty: {
      errorMessage: "court_id cannot be empty",
    },
  },
  // start_time: {
  //   format: {
  //     options: {
  //       strict: true,
  //     },
  //     errorMessage: "start_time must be in format YYYY-MM-DD HH:mm:ss",
  //   },
  //   notEmpty: {
  //     errorMessage: "start_time cannot be empty",
  //   },
  // },
  // end_time: {
  //   format: {
  //     options: {
  //       strict: true,
  //     },
  //     errorMessage: "start_time must be in format YYYY-MM-DD HH:mm:ss",
  //   },
  //   notEmpty: {
  //     errorMessage: "end_time cannot be empty",
  //   },
  // },
  user_id: {
    isInt: {
      errorMessage: "user_id must be an integer",
    },
    notEmpty: {
      errorMessage: "user_id cannot be empty",
    },
  },
  user_phone: {
    optional: true,
    isString: {
      errorMessage: "user_phone must be a string",
    },
  },
  user_email: {
    optional: true,
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  sub_total: {
    optional: true,
    isDecimal: {
      errorMessage: "sub_total must be a decimal",
    },
  },
  discount: {
    optional: true,
    isDecimal: {
      errorMessage: "discount must be a decimal",
    },
  },
  tax: {
    optional: true,
    isDecimal: {
      errorMessage: "tax must be a decimal",
    },
  },
  total: {
    optional: true,
    isDecimal: {
      errorMessage: "total must be a decimal",
    },
  },
  status: {
    isString: {
      errorMessage: "status must be a string",
    },
    notEmpty: {
      errorMessage: "status cannot be empty",
    },
  },
  type: {
    isString: {
      errorMessage: "type must be a string",
    },
    notEmpty: {
      errorMessage: "type cannot be empty",
    },
  },
};
