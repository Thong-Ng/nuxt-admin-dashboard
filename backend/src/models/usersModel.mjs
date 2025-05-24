import pool from "../configs/db.mjs"; // Import the MySQL connection pool

//construcor
class UsersModel {
  // Create a class to handle user data
  constructor() {
    this.pool = pool; // Assign the MySQL connection pool to a property
  }

  // Function to create a new user in the database
  async createUser(newUser) {
    try {
      //inserting new user, username must be unique
      const [rows] = await this.pool.query("INSERT INTO users SET ?", newUser);
      return rows.insertId; //return inserted row data
    } catch (error) {
      console.error("Error creating user:", error);
      //check if username is already taken
      if (error.code === "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("username")) {
          return "Username already taken";
        }
        //check if email is already taken
        if (error.sqlMessage.includes("email")) {
          return "Email already taken";
        }
        //check if phone is already taken
        if (error.sqlMessage.includes("phone")) {
          return "Phone already taken";
        }
      }
      //check if email is already taken

      return null;
    }
  }

  // Function to get a user by ID from
  async getUserById(id, isFromSession) {
    try {
      const [rows] = await this.pool.query("SELECT * FROM users WHERE id = ?", id);
      // console.log(rows);

      if (isFromSession) {
        //return only the role, displayName and email
        return {
          profileImg: rows[0].profileImg,
          id: rows[0].id,
          role: rows[0].role,
          displayName: rows[0].displayName,
          email: rows[0].email,
        };
      }

      return rows[0];
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  //get user by email
  async getUserByEmail(email) {
    try {
      const [rows] = await this.pool.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  //get list of users
  async getUsers(query) {
    let sql = "SELECT id, username, name, email, role, phone,create_time FROM users";
    const params = [];
    const conditions = [];

    if (query.role) {
      conditions.push("role = ?");
      params.push(query.role);
    }

    if (query.username) {
      conditions.push("username LIKE ?");
      params.push(`%${query.username}%`);
    }

    if (query.email) {
      conditions.push("email LIKE ?");
      params.push(`%${query.email}%`);
    }

    if (query.phone) {
      conditions.push("phone LIKE ?");
      params.push(`%${query.phone}%`);
    }

    if (query.create_from && query.create_to) {
      conditions.push("create_time BETWEEN ? AND ?");
      params.push(query.create_from);
      params.push(query.create_to);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("Error getting users:", error);
      return null;
    }
  }

  //update user
  async updateUser(updatedUser) {
    try {
      const [rows] = await this.pool.query("UPDATE users SET ? WHERE id = ?", [updatedUser, updatedUser.id]);
      return rows.affectedRows > 0;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  //update user password
  async updateUserPassword(updatedUser) {
    try {
      const [rows] = await this.pool.query("UPDATE users SET password = ? WHERE id = ?", [updatedUser.password, updatedUser.id]);
      return rows.affectedRows > 0;
    } catch (error) {
      console.error("Error updating user password:", error);
      return null;
    }
  }

  async deleteUser(id) {
    try {
      const [rows] = await this.pool.query("DELETE FROM users WHERE id = ?", id);
      return rows.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting court:", error);
      return null;
    }
  }
}

// Export the class
export default UsersModel;
