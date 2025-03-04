import { CreateFleetCommand } from "@app/Commands";
import { Fleet } from "@domain/fleet-entity";
import { FleetRepositoryInterface } from "@infra/Repositories";

export class CreateFleetHandler {
  constructor(private fleetRepository: FleetRepositoryInterface) {
    this.fleetRepository = fleetRepository;
  }
  async process(command: CreateFleetCommand): Promise<string> {
    const fleet = new Fleet(command.userId);
    await this.fleetRepository.save(fleet);
    return fleet.resourceId;
  }
}
