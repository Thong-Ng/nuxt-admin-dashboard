import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import UsersController from "../controllers/usersController.mjs";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export default passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      // console.log("jwtPayload", jwtPayload);
      try {
        const user = await UsersController.getUserByIdFromToken(jwtPayload.user_id); 
        if (!user) throw new Error("User not found");
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
