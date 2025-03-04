import {
  Given,
  When,
  Then,
  Before,
  World,
  setWorldConstructor,
  BeforeAll,
  AfterAll,
} from "@cucumber/cucumber";
import { Fleet } from "@domain/fleet-entity";
import { Location } from "@domain/location-vo";
import { Vehicle } from "@domain/vehicle-entity";

import { faker } from "@faker-js/faker";
import { FleetRepository, VehicleRepository } from "@infra/Repositories";
import { expect } from "chai";
import {
  FleetRepositoryStub,
  VehicleRepositoryStub,
} from "@test/Stubs/Repositories";
import { FleetManagementService } from "@app/Services/fleet-management.service";
import { AppDataSource } from "@infra/Database/data-source";

class TestContext extends World<TestContext> {
  TEST_MODE: string;
  myFleetId?: string;
  otherFleetId?: string;
  vehicleId: string;
  fleetRepository: FleetRepository | FleetRepositoryStub;
  vehicleRepository: VehicleRepository | VehicleRepositoryStub;
  fleetManagementService: FleetManagementService;
  error?: Error;
  location?: Location;
  constructor(options: any) {
    super(options);
    this.TEST_MODE = options.parameters.TEST_MODE || "default";
    if (this.TEST_MODE === "critical") {
      this.fleetRepository = new FleetRepository();
      this.vehicleRepository = new VehicleRepository();
    } else {
      this.vehicleRepository = new VehicleRepositoryStub();
      this.fleetRepository = new FleetRepositoryStub(this.vehicleRepository);
    }
    this.fleetManagementService = new FleetManagementService(
      this.fleetRepository,
      this.vehicleRepository
    );
    this.vehicleId = faker.vehicle.vin();
  }
}

setWorldConstructor(TestContext);

// Can't use world parameters in this version to instanciate connection only for critical tests
// https://github.com/cucumber/cucumber-js/blob/v10.1.0/docs/support_files/hooks.md#world-parameters-in-beforeallafterall
// I'll always instanciate it for simplicity
BeforeAll(async function () {
  await AppDataSource.initialize();
});

// There is probably a cleaner way to ensure the database is clean before each test
Before(async function (this: TestContext) {
  await AppDataSource.query(
    "TRUNCATE TABLE fleet_vehicles_vehicle, fleet, vehicle RESTART IDENTITY CASCADE;"
  );
  await AppDataSource.query("ALTER SEQUENCE fleet_id_seq RESTART WITH 1;");
});

AfterAll(async function () {
  await AppDataSource.destroy();
});

Given("my fleet", async function (this: TestContext) {
  this.myFleetId = await this.fleetManagementService.createFleet(
    faker.string.uuid()
  );
});

Given("the fleet of another user", function (this: TestContext) {
  const fleet = new Fleet(faker.string.uuid());
  this.otherFleetId = fleet.resourceId;
  this.fleetRepository.save(fleet);
});

Given("a vehicle", function (this: TestContext) {
  const vehicle = new Vehicle(this.vehicleId);
  this.vehicleRepository.save(vehicle);
});

Given("a location", function (this: TestContext) {
  this.location = new Location(
    faker.location.latitude(),
    faker.location.longitude()
  );
});

When(
  "I register this vehicle into my fleet",
  async function (this: TestContext) {
    await registerVehicleInFleet.call(this, this.myFleetId!);
  }
);

async function registerVehicleInFleet(this: TestContext, fleetId: string) {
  await this.fleetManagementService.registerVehicle(fleetId, this.vehicleId);
}

Then(
  "this vehicle should be part of my vehicle fleet",
  async function (this: TestContext) {
    const fleet = await this.fleetRepository.findById(this.myFleetId!);
    expect(fleet!.vehicles.map((vehicle) => vehicle.resourceId)).to.include(
      this.vehicleId
    );
  }
);

Given(
  "I have registered this vehicle into my fleet",
  async function (this: TestContext) {
    await registerVehicleInFleet.call(this, this.myFleetId!);
  }
);

When(
  "I try to register this vehicle into my fleet",
  async function (this: TestContext) {
    try {
      await registerVehicleInFleet.call(this, this.myFleetId!);
    } catch (e) {
      this.error = e as Error;
    }
  }
);

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function (this: TestContext) {
    expect(this.error!.message).to.equal(
      "Vehicle is already registered in this fleet."
    );
  }
);

Given(
  "this vehicle has been registered into the other user's fleet",
  async function (this: TestContext) {
    await registerVehicleInFleet.call(this, this.otherFleetId!);
  }
);

async function parkVehicle(this: TestContext) {
  await this.fleetManagementService.parkVehicleForFleet(
    this.myFleetId!,
    this.vehicleId,
    this.location!.latitude,
    this.location!.longitude
  );
}

Given("I park my vehicle at this location", async function (this: TestContext) {
  await parkVehicle.call(this);
});

Given(
  "my vehicle has been parked into this location",
  async function (this: TestContext) {
    await parkVehicle.call(this);
  }
);

When(
  "I try to park my vehicle at this location",
  async function (this: TestContext) {
    try {
      await parkVehicle.call(this);
    } catch (e) {
      this.error = e as Error;
    }
  }
);

Then(
  "the known location of my vehicle should verify this location",
  async function (this: TestContext) {
    const vehicle = await this.vehicleRepository.findOrInitializeById(
      this.vehicleId
    );
    expect(vehicle.parkedLocation).to.deep.equal(this.location);
  }
);

Then(
  "I should be informed that my vehicle is already parked at this location",
  function (this: TestContext) {
    expect(this.error!.message).to.equal(
      "Vehicle is already parked at this location"
    );
  }
);
