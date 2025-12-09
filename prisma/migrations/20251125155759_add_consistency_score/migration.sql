-- CreateTable
CREATE TABLE "daily_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" REAL,
    "pushups" INTEGER,
    "steps" INTEGER,
    "bike_minutes" INTEGER,
    "weight_training" BOOLEAN NOT NULL DEFAULT false,
    "water_intake" REAL,
    "meditation_minutes" INTEGER,
    "study_minutes" INTEGER,
    "reading_minutes" INTEGER,
    "spend_today" REAL,
    "income_today" REAL,
    "savings_today" REAL,
    "fatherhood_patience" INTEGER,
    "fatherhood_time" INTEGER,
    "consistency_score" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_user_id_date_key" ON "daily_logs"("user_id", "date");
