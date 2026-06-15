import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use public URL for migrations/db push (build time), internal URL for runtime
    url: process.env["DATABASE_PUBLIC_URL"] || process.env["DATABASE_URL"],
  },
});
