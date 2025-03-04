import { Vehicle } from "@domain/vehicle-entity";
import { VehicleRepositoryInterface } from "@infra/Repositories";

export class VehicleRepositoryStub implements VehicleRepositoryInterface {
  vehicles: Map<string, Vehicle> = new Map();
  async save(vehicle: Vehicle): Promise<Vehicle> {
    this.vehicles.set(vehicle.resourceId, vehicle);
    return Promise.resolve(vehicle);
  }

  async findOrInitializeById(vehicleId: string): Promise<Vehicle> {
    const vehicle = this.vehicles.get(vehicleId);
    if (vehicle) {
      return Promise.resolve(vehicle);
    }
    const newVehicle = new Vehicle(vehicleId);
    return Promise.resolve(newVehicle);
  }

  async isVehicleInFleet(fleetId: string, vehicleId: string): Promise<boolean> {
    const vehicle = this.vehicles.get(vehicleId);
    return Promise.resolve(
      vehicle?.fleets?.some((fleet) => fleet.resourceId === fleetId) || false
    );
  }
}
