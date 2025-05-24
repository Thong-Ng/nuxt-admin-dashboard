import BookingsModel from "../models/bookingsModel.mjs";
import { query, validationResult, matchedData, checkSchema } from "express-validator";

class BookingsController {
  constructor() {
    this.bookingsModel = new BookingsModel();
  }

  async getBookings(req, res) {
    const bookings = await this.bookingsModel.getBookings();
    return res.status(200).send(bookings);
  }

  async createBooking(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    let data = matchedData(req);
    const resultCreateBooking = await this.bookingsModel.createBooking(data);
    if (!resultCreateBooking) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send({ id: resultCreateBooking });
  }

  async getBookingById(req, res) {
    const id = req.params.id;
    const booking = await this.bookingsModel.getBookingById(id);
    if (!booking) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send(booking);
  }

  async updateBooking(req, res) {

    // let data = matchedData(req.body);
    const resultUpdateBooking = await this.bookingsModel.updateBooking(req.body);
    if (!resultUpdateBooking) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Booking updated");
  }

  async deleteBooking(req, res) {
    const id = req.params.id;
    const resultDeleteBooking = await this.bookingsModel.deleteBooking(id);
    if (!resultDeleteBooking) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Booking deleted");
  }

  //check availability
    async checkAvailability(req, res) {
        const query = req.query;
        console.log(query);
        const booking = await this.bookingsModel.checkAvailability(query);
        if (!booking) {
        return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(booking);
    }

}

export default new BookingsController();
