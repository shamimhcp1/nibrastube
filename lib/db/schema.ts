import { pgTable, text, timestamp, uuid, boolean, integer, primaryKey } from "drizzle-orm/pg-core";

// Parent Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  parentPin: text("parent_pin").default("0000").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Kid Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"), // URL or base64 or emoji
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// YouTube Videos Cache/Registry
export const videos = pgTable("videos", {
  id: text("id").primaryKey(), // YouTube Video ID
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  channelTitle: text("channel_title").notNull(),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Whitelisted Videos for Profiles
export const whitelistedVideos = pgTable(
  "whitelisted_videos",
  {
    profileId: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    videoId: text("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    pinnedAt: timestamp("pinned_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.profileId, table.videoId] }),
  })
);

// Shared Access (Invite another parent to manage profiles)
export const sharedAccess = pgTable(
  "shared_access",
  {
    parentId: uuid("parent_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    profileId: uuid("profile_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").default("editor").notNull(), // editor/viewer
  },
  (table) => ({
    pk: primaryKey({ columns: [table.parentId, table.profileId] }),
  })
);

// Invites
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  fromParentId: uuid("from_parent_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  profileId: uuid("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, rejected
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
