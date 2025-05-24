import pool from "../configs/db.mjs"; // Import the MySQL connection pool

//construcor
class BookingsModel {
  // Create a class to handle user data
  constructor() {
    this.pool = pool; // Assign the MySQL connection pool to a property
  }

  //check availability, by start_date, end_date, type(full/half), then return the available court
  async checkAvailability(query) {
    // console.log("checkAvailability", query);
    try {
      const type = query.type; //full or half
      const requested_start_time = query.start_time;
      const requested_end_time = query.end_time;

      //if have court_id, start_time, end_time, then check the availability
      if (query.court_id) {
        const court_id = parseInt(query.court_id);
        const [rows] = await this.pool.query(
          `SELECT c.id, c.name, c.type, c.status 
           FROM courts c 
           WHERE c.id = ? 
             AND c.status = 'available' 
             AND NOT EXISTS (
               SELECT 1 
               FROM bookings b 
               WHERE (b.court_id = c.id OR JSON_CONTAINS(b.include_half_court,CAST(c.id AS JSON)) OR JSON_CONTAINS(b.include_full_court,CAST(c.id AS JSON))) 
                 AND b.status IN ('confirmed', 'pending', 'locked', 'completed') 
                 AND (b.start_time < ? AND b.end_time > ?))`,
          [court_id, requested_end_time, requested_start_time]
        );
        return rows;
      }

      //full court
      if (type === "full") {
        //get all courts that are available
        const fullCourtsQuery = `SELECT c.id, c.name, c.type, c.status 
         FROM courts c 
         WHERE c.type = 'full' 
           AND c.status = 'available' 
           AND NOT EXISTS (
             SELECT 1 
             FROM bookings b 
             WHERE (b.court_id = c.id OR JSON_CONTAINS(b.include_half_court, CAST(c.id AS JSON)) OR JSON_CONTAINS(b.include_full_court, CAST(c.id AS JSON))) 
               AND b.status IN ('confirmed', 'pending', 'locked', 'completed') 
               AND (b.start_time < ? AND b.end_time > ?))`;

        const [rows] = await this.pool.query(fullCourtsQuery, [requested_end_time, requested_start_time]);
        return rows;
      } else if (type === "half") {
        //half court
        console.log("half");
        const halfCourtsQuery = `SELECT c.id, c.name, c.type, c.status 
         FROM courts c 
         WHERE c.type = 'half' 
           AND c.status = 'available' 
           AND NOT EXISTS (
             SELECT 1 
             FROM bookings b 
             WHERE (b.court_id = c.id OR JSON_CONTAINS(b.include_half_court, CAST(c.id AS JSON)) OR JSON_CONTAINS(b.include_full_court, CAST(c.id AS JSON))) 
               AND b.status IN ('confirmed', 'pending', 'locked', 'completed') 
               AND (b.start_time < ? AND b.end_time > ?))`;

        const [rows] = await this.pool.query(halfCourtsQuery, [requested_end_time, requested_start_time]);
        return rows;
      }
    } catch (error) {
      console.error("Error getting bookings:", error);
      return null;
    }
  }

  // Function to create a new booking in the database
  async createBooking(newBooking) {
    console.log("newBooking", newBooking);
    try {
      //check again the availability, from court_id, start_time, end_time
      const query = {
        type: newBooking.type,
        start_time: newBooking.start_time,
        end_time: newBooking.end_time,
        court_id: newBooking.court_id,
      };
      const availableCourts = await this.checkAvailability(query);
      if (availableCourts.length === 0) {
        return "Court not available for booking";
      }

      // Insert full booking
      const [result] = await this.pool.query("INSERT INTO bookings SET ?", newBooking);

      //if the booking is for full court, get it related child court id and insert into bookings, include_half_court, like [1,2]
      if (newBooking.type === "full") {
        const fullCourtId = newBooking.court_id;
        const [rows] = await this.pool.query("SELECT id FROM courts WHERE parent_id = ?", fullCourtId);
        const halfCourtIds = rows.map((row) => row.id);
        const include_half_court = JSON.stringify(halfCourtIds);
        await this.pool.query("UPDATE bookings SET include_half_court = ? WHERE id = ?", [include_half_court, result.insertId]);
      } else if (newBooking.type === "half") {
        //if the booking is for half court, get the parent court id and insert into bookings, include_full_court, like [1]
        const halfCourtId = newBooking.court_id;
        const [rows] = await this.pool.query("SELECT parent_id FROM courts WHERE id = ?", halfCourtId);
        const fullCourtIds = rows.map((row) => row.parent_id);
        const include_full_court = JSON.stringify(fullCourtIds);
        await this.pool.query("UPDATE bookings SET include_full_court = ? WHERE id = ?", [include_full_court, result.insertId]);
      }

      return result.insertId;
    } catch (error) {
      console.error("Error creating booking:", error);

      if (error.code === "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("bookingName")) {
          return "Booking name already taken";
        }
      }

      return null;
    }
  }

  //getBookings
  async getBookings() {
    try {
      //get all bookings except status is 'trash'
      const [rows] = await this.pool.query("SELECT * FROM bookings WHERE status != 'trash'");
      return rows;
    } catch (error) {
      console.error("Error getting bookings:", error);
      return null;
    }
  }

  // Function to get a booking by ID from
  async getBookingById(id) {
    try {
      const [rows] = await this.pool.query("SELECT * FROM bookings WHERE id = ?", id);
      return rows[0];
    } catch (error) {
      console.error("Error getting booking:", error);
      return null;
    }
  }

  // Function to update a booking in the database
  async updateBooking(updatedBooking) {
    try {
      const [result] = await this.pool.query("UPDATE bookings SET ? WHERE id = ?", [updatedBooking, updatedBooking.id]);
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating booking:", error);
      return null;
    }
  }

  // Function to delete a booking in the database
  async deleteBooking(id) {
    try {
      const [result] = await this.pool.query("UPDATE bookings SET status = 'trash' WHERE id = ?", id);
      return result.affectedRows;
    } catch (error) {
      console.error("Error deleting booking:", error);
      return null;
    }
  }
}

export default BookingsModel;
