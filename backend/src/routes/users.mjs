import { Router } from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema, updateUserValidationSchema, updateUserPasswordValidationSchema } from "../utils/validationSchema.mjs";

import UsersController from "../controllers/usersController.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";
import "../strategies/jwt-strategy.mjs";
import passport from "passport";

const router = Router();

//create user
router.post("/api/auth/register", checkSchema(createUserValidationSchema), async (req, res) => {
  const userId = await UsersController.createUser(req, res);
});

//login
router.post("/api/auth/login", async (req, res) => {
  const user = await UsersController.loginUser(req, res);
});

router.use(isAuthenticated);

//get list of users
router.get("/api/users", async (req, res) => {
  const users = await UsersController.getUsers(req, res);
});

//update user
router.put("/api/user/update", checkSchema(updateUserValidationSchema), async (req, res) => {
  const updatedUser = await UsersController.updateUser(req, res);
});

//update user password
router.put("/api/user/update/password", checkSchema(updateUserPasswordValidationSchema), async (req, res) => {
  const updatedUser = await UsersController.updateUserPassword(req, res);
});

router.get("/api/user/verify-token", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const username = req.user.username;
  const user_id = req.user.id;
  const role = req.user.role;
  const email = req.user.email;
  const returnData = {
    message: "Authorized", 
    username: username,
    user_id: user_id,
    role: role,
    email: email,
  };

  res.status(200).json(returnData);
});
//verify user session
// router.get("/api/auth/verify", async (req, res) => {
//   const user = await UsersController.verifyUser(req, res);
// });

//delete user by id
router.delete("/api/user/:id", async (req, res) => {
  const user = await UsersController.deleteUser(req, res);
});

//get user by id
router.get("/api/user/:id", async (req, res) => {
  const user = await UsersController.getUserById(req, res);
});


export default router;
