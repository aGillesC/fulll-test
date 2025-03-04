import { VehicleRepositoryInterface } from "@infra/Repositories";
import { ParkVehicleCommand } from "@app/Commands";

export class ParkVehicleHandler {
  constructor(private vehicleRepository: VehicleRepositoryInterface) {}

  async process(command: ParkVehicleCommand) {
    const isVehicleInFleet = await this.vehicleRepository.isVehicleInFleet(
      command.fleetId,
      command.vehicleId
    );

    if (!isVehicleInFleet) {
      throw new Error("Vehicle is not registered in this fleet");
    }

    const vehicle = await this.vehicleRepository.findOrInitializeById(
      command.vehicleId
    );

    vehicle.park(command.location);
    await this.vehicleRepository.save(vehicle);
  }
}
