import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  team: text("team").notNull().default("Sales"),
  role: text("role", { enum: ["sale", "admin"] }).notNull().default("sale"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const trainingSessions = sqliteTable(
  "training_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    productId: text("product_id").notNull(),
    scenarioId: text("scenario_id").notNull(),
    score: integer("score").notNull(),
    turns: integer("turns").notNull(),
    metricsJson: text("metrics_json").notNull(),
    transcriptJson: text("transcript_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("training_sessions_user_created_idx").on(table.userId, table.createdAt),
    index("training_sessions_created_idx").on(table.createdAt),
  ],
);
