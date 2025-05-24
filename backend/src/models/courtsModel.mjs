import pool from "../configs/db.mjs"; // Import the MySQL connection pool

//construcor
class CourtsModel {
  // Create a class to handle user data
  constructor() {
    this.pool = pool; // Assign the MySQL connection pool to a property
  }

  // Function to create a new court in the database
  async createCourt(newCourt) {
    try {
      // Insert full court
      const [result] = await this.pool.query("INSERT INTO courts SET ?", newCourt);

      const fullCourtId = result.insertId;
      const fullCourtName = newCourt.name;

      // Insert associated half courts
      await this.pool.query("INSERT INTO courts (name, type, parent_id, status) VALUES (?, ?, ?, ?), (?, ?, ?, ?)", [
        `${fullCourtName} - Half 1`,
        "half",
        fullCourtId,
        "available",
        `${fullCourtName} - Half 2`,
        "half",
        fullCourtId,
        "available",
      ]);

      return fullCourtId;
    } catch (error) {
      console.error("Error creating court:", error);

      if (error.code === "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("courtName")) {
          return "Court name already taken";
        }
      }

      return null;
    }
  }

  //getCourts
  async getCourts() {
    try {
      //get all courts except status is 'trash'
      const [rows] = await this.pool.query("SELECT * FROM courts WHERE status != 'trash'");
      return rows;
    } catch (error) {
      console.error("Error getting courts:", error);
      return null;
    }
  }

  async getParentCourts() {
    try {
      //get all courts except status is 'trash'
      const [rows] = await this.pool.query("SELECT id FROM courts WHERE type = 'full'");
      return rows;
    } catch (error) {
      console.error("Error getting courts:", error);
      return null;
    }
  }

  // Function to get a court by ID from
  async getCourtById(id) {
    try {
      const [rows] = await this.pool.query("SELECT * FROM courts WHERE id = ?", id);
      // console.log(rows);

      return rows[0];
    } catch (error) {
      console.error("Error getting court by ID:", error);
      return null;
    }
  }

  // Function to update a court
  async updateCourt(court) {
    try {
      //check if court name is already taken
      const [rowsCheck] = await this.pool.query("SELECT * FROM courts WHERE name = ? AND id != ?", [court.name, court.id]);
      if (rowsCheck.length > 0) {
        return "Court name already taken";
      }

      const [rows] = await this.pool.query("UPDATE courts SET ? WHERE id = ?", [court, court.id]);
      return rows.affectedRows > 0;
    } catch (error) {
      console.error("Error updating court:", error);
      return null;
    } 
  }

  // Function to delete a court
  async deleteCourt(id) {
    try {
      const [rows] = await this.pool.query("DELETE FROM courts WHERE id = ?", id);
      return rows.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting court:", error);
      return null;
    }
  }
}

export default CourtsModel;
