import { Fleet } from "@domain/fleet-entity";
import { FleetRepositoryInterface } from "@infra/Repositories";
import { VehicleRepositoryStub } from "@test/Stubs/Repositories/vehicle-repository-stub";

export class FleetRepositoryStub implements FleetRepositoryInterface {
  fleets: Map<string, Fleet> = new Map();

  constructor(private vehicleRepository: VehicleRepositoryStub) {
    this.vehicleRepository = vehicleRepository;
  }
  async save(fleet: Fleet): Promise<void> {
    this.fleets.set(fleet.resourceId, fleet);

    if (!fleet.vehicles) {
      return Promise.resolve();
    }
    // (simulating cascade)
    for (const vehicle of fleet.vehicles) {
      const storedVehicle = await this.vehicleRepository.findOrInitializeById(
        vehicle.resourceId
      );
      if (storedVehicle) {
        storedVehicle.fleets ??= [];
        storedVehicle.fleets.push(fleet);
      }
    }
    return Promise.resolve();
  }

  async findById(fleetId: string): Promise<Fleet | null> {
    return Promise.resolve(this.fleets.get(fleetId) || null);
  }

  async vehicleRegisteredInFleet(
    fleetId: string,
    vehicleId: string
  ): Promise<boolean> {
    const fleet = await this.findById(fleetId);
    return Promise.resolve(
      fleet!.vehicles?.some((vehicle) => vehicle.resourceId === vehicleId) ||
        false
    );
  }
}
