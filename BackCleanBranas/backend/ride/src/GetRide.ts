import Logger from "./LoggerConsole";
import RideDAO from "./RideDAO";

export default class GetRide {
  constructor(
    private rideDAO: RideDAO,
    private logger: Logger
  ) {}
  async execute(rideId: string) {
    this.logger.log(`getRide`);
    return await this.rideDAO.getById(rideId);
  }
}
