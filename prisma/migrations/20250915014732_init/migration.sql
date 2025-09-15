-- CreateTable
CREATE TABLE "pa_users" (
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
    "user_type" TEXT NOT NULL DEFAULT 'User',
    "site_admin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pa_user_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userID" TEXT NOT NULL,
    "petID" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pa_user_favorites_userID_fkey" FOREIGN KEY ("userID") REFERENCES "pa_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pa_user_favorites_petID_fkey" FOREIGN KEY ("petID") REFERENCES "pa_pets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pa_shelters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "pa_shelters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "pa_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pa_pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'Male',
    "size" TEXT NOT NULL DEFAULT 'Small',
    "adoptionFee" INTEGER NOT NULL,
    "is_adopted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "shelterID" TEXT NOT NULL,
    "breedID" TEXT NOT NULL,
    "speciesID" TEXT NOT NULL,
    "adoptionID" TEXT,
    CONSTRAINT "pa_pets_shelterID_fkey" FOREIGN KEY ("shelterID") REFERENCES "pa_shelters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pa_pets_breedID_fkey" FOREIGN KEY ("breedID") REFERENCES "pa_pet_breeds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pa_pets_speciesID_fkey" FOREIGN KEY ("speciesID") REFERENCES "pa_pet_species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pa_pets_adoptionID_fkey" FOREIGN KEY ("adoptionID") REFERENCES "pa_adoptions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pa_pet_breeds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "speciesID" TEXT NOT NULL,
    CONSTRAINT "pa_pet_breeds_speciesID_fkey" FOREIGN KEY ("speciesID") REFERENCES "pa_pet_species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pa_pet_species" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "pa_adoptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questions" JSONB,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "rejectionStatus" TEXT,
    "userID" TEXT NOT NULL,
    "shelterID" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pa_adoptions_userID_fkey" FOREIGN KEY ("userID") REFERENCES "pa_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pa_adoptions_shelterID_fkey" FOREIGN KEY ("shelterID") REFERENCES "pa_shelters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "pa_users_email_key" ON "pa_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pa_users_password_key" ON "pa_users"("password");

-- CreateIndex
CREATE INDEX "pa_users_id_email_idx" ON "pa_users"("id", "email");

-- CreateIndex
CREATE INDEX "pa_user_favorites_userID_petID_idx" ON "pa_user_favorites"("userID", "petID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_shelters_user_id_key" ON "pa_shelters"("user_id");

-- CreateIndex
CREATE INDEX "pa_shelters_name_country_city_state_idx" ON "pa_shelters"("name", "country", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pets_shelterID_key" ON "pa_pets"("shelterID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pets_breedID_key" ON "pa_pets"("breedID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pets_speciesID_key" ON "pa_pets"("speciesID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pets_adoptionID_key" ON "pa_pets"("adoptionID");

-- CreateIndex
CREATE INDEX "pa_pets_name_gender_size_breedID_speciesID_idx" ON "pa_pets"("name", "gender", "size", "breedID", "speciesID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pet_breeds_speciesID_key" ON "pa_pet_breeds"("speciesID");

-- CreateIndex
CREATE INDEX "pa_pet_breeds_name_idx" ON "pa_pet_breeds"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pa_pet_species_name_key" ON "pa_pet_species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pa_adoptions_userID_key" ON "pa_adoptions"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "pa_adoptions_shelterID_key" ON "pa_adoptions"("shelterID");

-- CreateIndex
CREATE INDEX "pa_adoptions_status_idx" ON "pa_adoptions"("status");
