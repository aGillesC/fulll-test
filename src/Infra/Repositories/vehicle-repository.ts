import { Vehicle } from "@domain/vehicle-entity";
import { AppDataSource } from "@infra/Database/data-source";
import { Repository } from "typeorm";

export interface VehicleRepositoryInterface {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findOrInitializeById(vehicleId: string): Promise<Vehicle>;
  isVehicleInFleet: (fleetId: string, vehicleId: string) => Promise<boolean>;
}
export class VehicleRepository implements VehicleRepositoryInterface {
  private repo: Repository<Vehicle>;
  constructor() {
    this.repo = AppDataSource.getRepository(Vehicle);
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return this.repo.save(vehicle);
  }

  async findOrInitializeById(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.repo.findOne({
      where: { resourceId: vehicleId },
      relations: ["fleets"],
    });
    if (vehicle) {
      return vehicle;
    }
    const newVehicle = new Vehicle(vehicleId);

    this.repo.save(newVehicle);
    return newVehicle;
  }

  async isVehicleInFleet(fleetId: string, vehicleId: string): Promise<boolean> {
    return await this.repo
      .createQueryBuilder("vehicle")
      .innerJoin("vehicle.fleets", "fleet")
      .where("fleet.resourceId = :fleetId", { fleetId })
      .andWhere("vehicle.resourceId = :vehicleId", { vehicleId })
      .getExists();
  }
}
