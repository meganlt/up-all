-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TABLE IF EXISTS "user";


-------------------------------------------------------
--------------------------------------------------
-- TABLE SCHEMAS:
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR (80) UNIQUE NOT NULL,
  "email" VARCHAR UNIQUE NOT NULL,
  "password" VARCHAR (1000) NOT NULL,
  "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "role" VARCHAR (80),
  "first_name" VARCHAR (100),
  "last_name" VARCHAR (100),
  "pronouns" VARCHAR (100),
  "company" VARCHAR (255),
  "job_title" VARCHAR (255),
  "manager_assigned" INT REFERENCES "user"
);

-- ** OLD TABLE DO NOT USE
-- CREATE TABLE "dashboard_week" (
--  "id" SERIAL PRIMARY KEY,
--  "week_number" INTEGER,
--  "active_date_start" DATE,
--  "active_date_end" DATE,
--  "theme" VARCHAR (255),
--  "content" TEXT,
--  "focus" TEXT,
--  "created_at" TIMESTAMPTZ DEFAULT now()
-- );

CREATE TABLE dashboard_week (
  "id" PRIMARY KEY DEFAULT,
  "title" VARCHAR(255) NOT NULL,
  "theme" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "focus" TEXT NOT NULL,   
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE "company_assignment" (
  "id" SERIAL PRIMARY KEY,
  "company_name" VARCHAR(255) NOT NULL,
  "dashboard_week_id" INTEGER REFERENCES "dashboard_week"(id) ON DELETE CASCADE,
  "active_date_start" DATE NOT NULL,
  "active_date_end" DATE NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "check_ins" (
  "id" SERIAL PRIMARY KEY,
  "associate_id" INT REFERENCES "user",
  "manager_id" INT REFERENCES "user",
  "week_of" DATE,
  "job_satisfaction" INT,
  "workload_balance" INT,
  "motivation" INT,
  "manager_support" INT,
  "growth_opportunity" INT,
  "focus_for_week" TEXT,
  "progress_from_last_week" TEXT,
  "blockers" TEXT,
  "feedback_for_manager" TEXT,
  "workload_feelings" TEXT,
  "skill_development" TEXT,
  "created_at" TIMESTAMPTZ,
  "updated_at" TIMESTAMPTZ
);

-- Table edits:
ALTER TABLE "user" ADD COLUMN manager_assigned INT REFERENCES "user"(id);
ALTER TABLE "check_ins" ADD COLUMN "tasks" TEXT;

-- *** QUERIES FOR DASHBOARD_WEEK TABLE ***

-- EDIT EXISTING dashboard_week TABLE
-- 1. Remove Columns
ALTER TABLE "dashboard_week"
  DROP COLUMN IF EXISTS "week_number",
  DROP COLUMN IF EXISTS "active_date_start",
  DROP COLUMN IF EXISTS "active_date_end";
-- 2. Add Columns
ALTER TABLE "dashboard_week"
  ADD COLUMN IF NOT EXISTS "title" VARCHAR(255) NOT NULL,
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT now();
-- 3. Modify Columns to NOT NULL
ALTER TABLE "dashboard_week"
  ALTER COLUMN "theme" SET NOT NULL,
  ALTER COLUMN "content" SET NOT NULL,
  ALTER COLUMN "focus" SET NOT NULL;

-- GET ROUTE QUERIE (fetch all weekly content)
SELECT * FROM "dashboard_week" ORDER BY created_at DESC;
-- GET ROUTE QUERIE (fetch a single dashboard week by ID)
SELECT * FROM "dashboard_week" WHERE id = $1;
-- POST ROUTE QUERIE (insert a new submission)
INSERT INTO "dashboard_week" (title, theme, content, focus) VALUES ($1, $2, $3, $4) RETURNING *;
-- PUT ROUTE QUERIE (update a specific a specific dasboard week)
UPDATE "dashboard_week" SET title = $1, theme = $2, content = $3, focus = $4, updated_at = now() WHERE id = $5 RETURNING *;
-- DELETE ROUTE QUERIE (remove an existing dashboard week)
DELETE FROM "dashboard_week" WHERE id = $1 RETURNING *;

-- *** QUERIES FOR COMPANY_ASSIGNMENT TABLE ***

-- GET ROUTE QUERIE (fetch all company assignments - for all companies)
SELECT "company_assignment".*, "dashboard_week".title 
FROM "company_assignment"
JOIN "dashboard_week" 
ON "company_assignment".dashboard_week_id = "dashboard_week".id
ORDER BY "company_assignment".created_at DESC;
-- GET ROUTE QUERIE (fetch a single company's assignment - filtered by company name)
SELECT "company_assignment".*, "dashboard_week".title 
FROM "company_assignment"
JOIN "dashboard_week" 
ON "company_assignment".dashboard_week_id = "dashboard_week".id
WHERE "company_assignment".company_name = $1
ORDER BY "company_assignment".active_date_start;
-- POST ROUTE QUERIE (insert a new company assignment)
INSERT INTO "company_assignment" (company_name, dashboard_week_id, active_date_start, active_date_end) VALUES ($1, $2, $3, $4) RETURNING *;
-- PUT ROUTE QUERIE (update a specific company assignment)
UPDATE "company_assignment" SET company_name = $1, dashboard_week_id = $2, active_date_start = $3, active_date_end = $4, updated_at = now() WHERE id = $5 RETURNING *;
-- DELETE ROUTE QUERIE (remove an assignment)
DELETE FROM "company_assignment" WHERE id = $1 RETURNING *;

-------------------------------------------------------
--------------------------------------------------
-- SEED DATA:
--   You'll need to actually register users via the application in order to get hashed
--   passwords. Once you've done that, you can modify this INSERT statement to include
--   your dummy users. Be sure to copy/paste their hashed passwords, as well.
--   This is only for development purposes! Here's a commented-out example:
-- INSERT INTO "user"
--   ("username", "password")
--   VALUES
--   ('unicorn10', '$2a$10$oGi81qjXmTh/slGzYOr2fu6NGuCwB4kngsiWQPToNrZf5X8hxkeNG'), --pw: 123
--   ('cactusfox', '$2a$10$8./c/6fB2BkzdIrAUMWOxOlR75kgmbx/JMrMA5gA70c9IAobVZquW'); --pw: 123


-------------------------------------------------------
--------------------------------------------------
-- AUTOMAGIC UPDATED_AT:

-- Did you know that you can make and execute functions
-- in PostgresQL? Wild, right!? I'm not making this up. Here
-- is proof that I am not making this up:
  -- https://x-team.com/blog/automatic-timestamps-with-postgresql/

-- Create a function that sets a row's updated_at column
-- to NOW():
CREATE OR REPLACE FUNCTION set_updated_at_to_now() -- 👈
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the user table that will execute
-- the set_update_at_to_now function on any rows that
-- have been touched by an UPDATE query:
CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();
