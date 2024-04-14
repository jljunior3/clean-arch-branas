import crypto from "crypto";
import Logger from "./LoggerConsole";
import RideDAO from "./RideDAO";
import AccountRepository from "./AccountRepository";

export default class RequestRide {
  constructor(
    private rideDAO: RideDAO,
    private accountDAO: AccountRepository,
    private logger: Logger
  ) {}
  async execute(input: any) {
    this.logger.log(`requestRide`);
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account) throw new Error("Account does not exist");
    if (!account.isPassenger)
      throw new Error("Only passengers can request a ride");

    const activeRide = await this.rideDAO.getActiveRideByPassengerId(
      input.passengerId
    );
    if (activeRide) throw new Error("Passenger has an active ride");
    input.rideId = crypto.randomUUID();
    input.status = "REQUESTED";
    input.date = new Date();
    await this.rideDAO.save(input);
    return {
      rideId: input.rideId,
    };
  }
}
