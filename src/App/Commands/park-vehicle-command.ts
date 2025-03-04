import { Location } from "../../Domain";

export class ParkVehicleCommand {
  constructor(
    public readonly fleetId: string,
    public readonly vehicleId: string,
    public readonly location: Location
  ) {}
}
