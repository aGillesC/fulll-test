import {
  CreateFleetCommand,
  ParkVehicleCommand,
  RegisterVehicleCommand,
} from "@app/Commands";
import { ParkVehicleHandler, RegisterVehicleHandler } from "@app/Handlers";
import { CreateFleetHandler } from "@app/Handlers/create-fleet-handler";
import { Location } from "@domain/location-vo";
import {
  FleetRepositoryInterface,
  VehicleRepositoryInterface,
} from "@infra/Repositories";

export class FleetManagementService {
  private registerVehicleHandler: RegisterVehicleHandler;
  private parkVehicleHandler: ParkVehicleHandler;
  private createFleetHandler: CreateFleetHandler;

  constructor(
    private fleetRepository: FleetRepositoryInterface,
    private vehicleRepository: VehicleRepositoryInterface
  ) {
    this.createFleetHandler = new CreateFleetHandler(fleetRepository);
    this.registerVehicleHandler = new RegisterVehicleHandler(
      fleetRepository,
      vehicleRepository
    );
    this.parkVehicleHandler = new ParkVehicleHandler(vehicleRepository);
  }

  async createFleet(userId: string): Promise<string> {
    const command = new CreateFleetCommand(userId);
    return await this.createFleetHandler.process(command);
  }

  async registerVehicle(fleetId: string, plateNumber: string) {
    const command = new RegisterVehicleCommand(fleetId, plateNumber);
    return await this.registerVehicleHandler.process(command);
  }

  async parkVehicleForFleet(
    fleetId: string,
    plateNumber: string,
    lat: number,
    lng: number
  ) {
    const location = new Location(lat, lng);
    const command = new ParkVehicleCommand(fleetId, plateNumber, location);
    return await this.parkVehicleHandler.process(command);
  }
}
