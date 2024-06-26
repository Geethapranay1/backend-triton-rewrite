import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),

})

