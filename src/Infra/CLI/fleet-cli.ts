import { FleetManagementService } from "@app/Services/fleet-management.service";
import { FleetRepository, VehicleRepository } from "@infra/Repositories";
import { Command } from "commander";
import { AppDataSource } from "@infra/Database/data-source";

// Initialize dependencies
const fleetRepository = new FleetRepository();
const vehicleRepository = new VehicleRepository();

const fleetManagementService = new FleetManagementService(
  fleetRepository,
  vehicleRepository
);

async function executeWithDatabase(action: () => Promise<void>) {
  try {
    await AppDataSource.initialize();
    await action();
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

const program = new Command();

// 📌 Command: Create a fleet
program
  .command("create <userId>")
  .description("Create a new fleet")
  .action(async (userId) => {
    executeWithDatabase(async () => {
      const fleetId = await fleetManagementService.createFleet(userId);
      console.info(`🚗 Fleet created successfully! ID: ${fleetId}`);
    });
  });

// 📌 Command: Register a vehicle
program
  .command("register-vehicle <fleetId> <plateNumber>")
  .description("Register a vehicle to a fleet")
  .action(async (fleetId, plateNumber) => {
    executeWithDatabase(async () => {
      await fleetManagementService.registerVehicle(fleetId, plateNumber);
      console.info(`✅ Vehicle ${plateNumber} registered to fleet ${fleetId}`);
    });
  });

// 📌 Command: Localize a vehicle
program
  .command("localize-vehicle <fleetId> <plateNumber> <lat> <lng>")
  .description("Update a vehicle's location")
  .action(async (fleetId, plateNumber, lat, lng) => {
    executeWithDatabase(async () => {
      await fleetManagementService.parkVehicleForFleet(
        fleetId,
        plateNumber,
        parseFloat(lat),
        parseFloat(lng)
      );
      console.info(
        `📍 Vehicle ${plateNumber} is now located at ${lat}, ${lng}`
      );
    });
  });

program.parse(process.argv);
