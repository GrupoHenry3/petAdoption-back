-- DropIndex
DROP INDEX "pa_adoptions_shelterID_key";

-- DropIndex
DROP INDEX "pa_adoptions_userID_key";

-- DropIndex
DROP INDEX "pa_pet_breeds_speciesID_key";

-- DropIndex
DROP INDEX "pa_pets_adoptionID_key";

-- DropIndex
DROP INDEX "pa_pets_speciesID_key";

-- DropIndex
DROP INDEX "pa_pets_breedID_key";

-- DropIndex
DROP INDEX "pa_pets_shelterID_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pa_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "google_id" TEXT,
    "full_name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "country" TEXT,
    "city" TEXT,
    "avatar_url" TEXT,
    "user_type" TEXT NOT NULL DEFAULT 'USER',
    "site_admin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_pa_users" ("address", "avatar_url", "city", "country", "created_at", "email", "full_name", "google_id", "id", "isActive", "password", "phone", "site_admin", "updated_at", "user_type") SELECT "address", "avatar_url", "city", "country", "created_at", "email", "full_name", "google_id", "id", "isActive", "password", "phone", "site_admin", "updated_at", "user_type" FROM "pa_users";
DROP TABLE "pa_users";
ALTER TABLE "new_pa_users" RENAME TO "pa_users";
CREATE UNIQUE INDEX "pa_users_email_key" ON "pa_users"("email");
CREATE INDEX "pa_users_id_email_idx" ON "pa_users"("id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
