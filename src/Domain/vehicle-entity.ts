import { Fleet } from "@domain/fleet-entity";
import { Location } from "@domain/location-vo";
import { randomUUID } from "crypto";
import _ from "lodash";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  // could be typed as plate number
  resourceId!: string;

  @ManyToMany(() => Fleet, (fleet) => fleet.vehicles)
  fleets!: Fleet[];

  @Column({ type: "json", nullable: true })
  parkedLocation: Location | null = null;

  constructor(plateNumber: string) {
    this.resourceId = plateNumber;
  }

  park(location: Location) {
    if (this.parkedLocation && _.isMatch(this.parkedLocation, location)) {
      throw new Error("Vehicle is already parked at this location");
    }
    this.parkedLocation = location;
  }

  addFleet(fleet: Fleet) {
    this.fleets ??= [];
    this.fleets.push(fleet);
  }
}
