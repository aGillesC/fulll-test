import "reflect-metadata";
import { Vehicle } from "@domain/vehicle-entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { randomUUID } from "crypto";

@Entity()
export class Fleet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  resourceId!: string;

  @Column()
  userId!: string;

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.fleets, {
    cascade: ["insert", "update"],
  })
  @JoinTable()
  vehicles!: Vehicle[];

  constructor(userId: string) {
    this.userId = userId;
    this.resourceId = randomUUID();
  }

  addVehicle(vehicle: Vehicle) {
    this.vehicles ??= [];
    this.vehicles.push(vehicle);
  }
}
