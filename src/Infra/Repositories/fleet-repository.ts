import { Repository } from "typeorm";
import { Fleet } from "@domain/fleet-entity";
import { AppDataSource } from "@infra/Database/data-source";
import { Vehicle } from "@domain/vehicle-entity";

export interface FleetRepositoryInterface {
  save(fleet: Fleet): Promise<void>;
  findById(fleetId: string): Promise<Fleet | null>;
  vehicleRegisteredInFleet(
    fleetId: string,
    vehicleId: string
  ): Promise<boolean>;
}
export class FleetRepository implements FleetRepositoryInterface {
  private repo: Repository<Fleet>;
  constructor() {
    this.repo = AppDataSource.getRepository(Fleet);
  }

  async save(fleet: Fleet) {
    await this.repo.save(fleet);
  }

  async findById(fleetId: string): Promise<Fleet | null> {
    return await this.repo.findOne({
      where: { resourceId: fleetId },
      relations: ["vehicles"],
    });
  }

  async vehicleRegisteredInFleet(
    fleetId: string,
    vehicleId: string
  ): Promise<boolean> {
    return await this.repo
      .createQueryBuilder("fleet")
      .innerJoin("fleet.vehicles", "vehicle")
      .where("vehicle.resourceId = :vehicleId", { vehicleId })
      .andWhere("fleet.resourceId = :fleetId", { fleetId })
      .getExists();
  }
}
