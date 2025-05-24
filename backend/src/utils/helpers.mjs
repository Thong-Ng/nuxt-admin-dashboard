import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const saltRounds = 10;

export const hashPassword =  (password) => {
  try {
    const salt =  bcrypt.genSaltSync(saltRounds);
    return  bcrypt.hashSync(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

export const comparePasswords =  (password, hash) => {
  try {
    return  bcrypt.compareSync(password, hash);
  } catch (error) {
    throw new Error(error);
  }
};