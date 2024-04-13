import crypto from "crypto";
import RideDAO from "./RideDAO";
import AccountDAO from "./AccountDAO";

export default class AcceptRide {
  constructor(
    private rideDAO: RideDAO,
    private accountDAO: AccountDAO
  ) {}
  async execute(input: any) {
    const account = await this.accountDAO.getById(input.driverId);
    console.log("account", account);
    if (!account.is_driver) throw new Error("Only drivers can accept rides");
    const ride = await this.rideDAO.getById(input.rideId);
    ride.status = "ACCEPTED";
    ride.driverId = input.driverId;
    await this.rideDAO.update(ride);
  }
}
