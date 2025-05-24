import CourtsModel from "../models/courtsModel.mjs";
import { query, validationResult, matchedData, checkSchema } from "express-validator";

class CourtsController {
  constructor() {
    this.courtsModel = new CourtsModel();
  }

  async getCourts(req, res) {
    const courts = await this.courtsModel.getCourts();
    return res.status(200).send(courts);
  }

  async getParentCourts(req, res) {
    const courts = await this.courtsModel.getParentCourts();
    return res.status(200).send(courts);
  }

  async createCourt(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    let data = matchedData(req);
    const resultCreateCourt = await this.courtsModel.createCourt(data);
    if (!resultCreateCourt) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send({ id: resultCreateCourt });
  }

  async getCourtById(req, res) {
    const id = req.params.id;
    const court = await this.courtsModel.getCourtById(id);
    if (!court) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send(court);
  }

  async updateCourt(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    let data = matchedData(req);
    const resultUpdateCourt = await this.courtsModel.updateCourt(data);
    if (!resultUpdateCourt) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Court updated");
  }

  async deleteCourt(req, res) {
    const id = req.params.id;
    const resultDeleteCourt = await this.courtsModel.deleteCourt(id);
    if (!resultDeleteCourt) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Court deleted");
  }
}

export default new CourtsController();
