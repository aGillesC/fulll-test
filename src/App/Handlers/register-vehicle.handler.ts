import { Vehicle } from "@domain/vehicle-entity";
import {
  FleetRepositoryInterface,
  VehicleRepositoryInterface,
} from "../../Infra/Repositories";
import { RegisterVehicleCommand } from "../Commands/register-vehicle-command";

export class RegisterVehicleHandler {
  constructor(
    private fleetRepository: FleetRepositoryInterface,
    private vehicleRepository: VehicleRepositoryInterface
  ) {}

  async process(command: RegisterVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) {
      throw new Error("Fleet not found");
    }

    const vehicle = await this.vehicleRepository.findOrInitializeById(
      command.vehicleId
    );

    const vehicleRegisteredInFleet =
      await this.fleetRepository.vehicleRegisteredInFleet(
        fleet.resourceId,
        vehicle.resourceId
      );
    if (vehicleRegisteredInFleet) {
      throw new Error("Vehicle is already registered in this fleet.");
    }

    fleet.addVehicle(vehicle);
    await this.fleetRepository.save(fleet);
  }
}
