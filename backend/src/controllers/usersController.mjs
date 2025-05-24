import UsersModel from "../models/usersModel.mjs";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { hashPassword, comparePasswords } from "../utils/helpers.mjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;


class UsersController {
  constructor() {
    this.usersModel = new UsersModel();
  }

  async createUser(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    let data = matchedData(req);
    data.password = hashPassword(data.password);
    const resultCreateUser = await this.usersModel.createUser(data);
    //check if username is already taken
    if (resultCreateUser === "Username already taken") {
      return res.status(400).send("Username already taken");
    }
    if (resultCreateUser === "Email already taken") {
      return res.status(400).send("Email already taken");
    }
    if (resultCreateUser === "Phone already taken") {
      return res.status(400).send("Phone already taken");
    }
    if (!resultCreateUser) {
      return res.status(500).send("Internal Server Error");
    }

    //send welcome email
    // await this.notificationDelivery.sendWelcomeNewUserEamil(data.username, data.email);

    return res.status(200).send({ id: resultCreateUser });
  }

  async getUserByIdFromToken(idd) {
    // console.log("get user by id from token");
    // console.log(idd);
    //use this function for jwt strategy
    const id = parseInt(idd);
    // console.log("id", id);
    const user = await this.usersModel.getUserById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  //login user
  async loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    //check user exists by email
    const user = await this.usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).send("User not found");
    }

    //compare passwords
    const isMatch = comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    //generate unique token for user, with no expiration
    const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: "100y" });
    const iat = Math.floor(Date.now() / 1000);
    //7days
    const exp = iat + 60 * 60 * 24 * 7; //7days

    return res.status(200).json({
      token: token,
      user_id: user.id,
      username: user.username,
      role: user.role,
      iat: iat,
      exp: exp,
    });
  }

  //get list of users
  async getUsers(req, res) {
    const query = req.query;
    const users = await this.usersModel.getUsers(query);
    if (!users) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send(users);
  }

  //update user
  async updateUser(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const data = matchedData(req);
    const resultUpdateUser = await this.usersModel.updateUser(data);
    if (!resultUpdateUser) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("User updated");
  }

  //update user password
  async updateUserPassword(req, res) {
    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const resultUpdateUserPassword = await this.usersModel.updateUserPassword(data);
    if (!resultUpdateUserPassword) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Password updated");
  }


  //delete user by id
  async deleteUser(req, res) {
    const id = parseInt(req.params.id);
    const resultDeleteUser = await this.usersModel.deleteUser(id);
    if (!resultDeleteUser) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("User deleted");
  }

  //get user by id
  async getUserById(req, res) {
    const id = parseInt(req.params.id);
    const user = await this.usersModel.getUserById(id);
    if (!user) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send(user);
  }

}

export default new UsersController();