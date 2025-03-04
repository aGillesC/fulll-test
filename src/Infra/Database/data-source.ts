import { DataSource } from "typeorm";

// DB conf should be in a .env file
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "user",
  password: "password",
  database: "fleet_db",
  migrations: ["src/Infra/Database/Migrations/*.ts"],
  entities: ["src/Domain/*.ts"],
});
