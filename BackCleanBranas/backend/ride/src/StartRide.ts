import crypto from "crypto";
import RideDAO from "./RideDAO";
import AccountRepository from "./AccountRepository";

export default class StartRide {
  constructor(private rideDAO: RideDAO) {}
  async execute(input: any) {
    const ride = await this.rideDAO.getById(input.rideId);
    ride.status = "IN_PROGRESS";
    await this.rideDAO.update(ride);
  }
}
