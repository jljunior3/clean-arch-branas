export default interface RideDAO {
  save(ride: any): Promise<void>;
  update(ride: any): Promise<void>;
  getById(rideId: string): Promise<any>;
  getActiveRideByPassengerId(passengerId: string): Promise<any>;
}
