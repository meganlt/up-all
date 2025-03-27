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
  "quarter_title" VARCHAR(255) NOT NULL, -- updated on 3/26 by JR
  "week" INT NOT NULL, -- updated on 3/26 by JR
  "theme" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "focus" TEXT NOT NULL,   
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE "pair_assignment" (
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

CREATE TABLE "manager_check_ins" (
  "id" SERIAL PRIMARY KEY,
  "manager_id" INT REFERENCES "user"(id) ON DELETE CASCADE,
  "dashboard_week_id" INT REFERENCES "dashboard_week"(id) ON DELETE CASCADE,
  "follow_up" BOOLEAN DEFAULT FALSE,
  "status_read" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

---------- *** TABLE EDITS *** ----------
ALTER TABLE "user" ADD COLUMN manager_assigned INT REFERENCES "user"(id);
ALTER TABLE "check_ins" ADD COLUMN "tasks" TEXT;
ALTER TABLE "check_ins" ADD COLUMN "is_active" BOOLEAN DEFAULT TRUE; --- Adding is_active column to check_ins table. We need a way to track if a form is currently active or not.
ALTER TABLE "dashboard_week" RENAME COLUMN "title" TO "quarter_title"; -- updated on 3/26 by JR
ALTER TABLE "dashboard_week" ADD COLUMN "week" INT NOT NULL; -- updated on 3/26 by JR
ALTER TABLE "company_assignment" RENAME TO "pair_assignment";-- updated on 3/26 by JR

---------- *** QUERIES FOR DASHBOARD_WEEK TABLE *** ----------

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

-- GET ROUTE (fetch all weekly content from all quarters)
SELECT * FROM "dashboard_week" ORDER BY "quarter_title", "week"; -- updated on 3/26 by JR

-- GET ROUTE (fetch weekly content for a specific quarter title)
SELECT * FROM "dashboard_week" WHERE "quarter_title" = $1 ORDER BY "week"; -- updated on 3/26 by JR

-- GET ROUTE QUERIE (fetch a single dashboard week by ID)
SELECT * FROM "dashboard_week" WHERE id = $1;

-- POST ROUTE QUERIE (insert a new submission)
INSERT INTO "dashboard_week" ("quarter_title", "week", "theme", "content", "focus") VALUES ($1, $2, $3, $4, $5) RETURNING *; -- updated on 3/26 by JR

-- PUT ROUTE QUERIE (update a specific a specific dasboard week)
UPDATE "dashboard_week" SET "quarter_title" = $1, "week" = $2, "theme" = $3, "content" = $4, "focus" = $5, "updated_at" = now() WHERE "id" = $6 RETURNING *; -- updated on 3/26 by JR

-- DELETE ROUTE QUERIE (remove an existing dashboard week)
DELETE FROM "dashboard_week" WHERE id = $1 RETURNING *;

---------- *** QUERIES FOR COMPANY_ASSIGNMENT TABLE *** ----------

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

---------- *** QUERIES FOR CHECK_INS TABLE *** ----------

-- GET ROUTE QUERIE (Retrieves all rows from the check_ins table, including old and new ones.)
SELECT * FROM "check_ins" ORDER BY "created_at" DESC;

-- GET ROUTE QUERIE (Retrieves a specific check-in entry by its unique ID. Used when you need to view or edit a particular check-in.)
SELECT * FROM "check_ins" WHERE "id" = $1;
-- GET ROUTE QUERIE (Retrieves the current active check-in form between an associate and manager. Ensures only one active check-in is present per associate-manager pair.)
SELECT * FROM "check_ins" WHERE "associate_id" = $1 AND "manager_id" = $2 AND "is_active" = TRUE;


-- POST ROUTE QUERIE (insert a new check-in (create a new entry))
INSERT INTO "check_ins" (
  "associate_id", "manager_id", "week_of", "job_satisfaction",
  "workload_balance", "motivation", "manager_support", "growth_opportunity",
  "focus_for_week", "progress_from_last_week", "blockers",
  "feedback_for_manager", "workload_feelings", "skill_development", "tasks", "is_active"
)
VALUES (
  $1, $2, NOW(), $3,
  $4, $5, $6, $7,
  $8, $9, $10,
  $11, $12, $13, $14, TRUE
)
RETURNING *;

-- PUT ROUTE QUERIE (update a specific an existing check-in by ID)
UPDATE "check_ins" 
SET
  "associate_id" = $1,
  "manager_id" = $2,
  "week_of" = $3,
  "job_satisfaction" = $4,
  "workload_balance" = $5,
  "motivation" = $6,
  "manager_support" = $7,
  "growth_opportunity" = $8,
  "focus_for_week" = $9,
  "progress_from_last_week" = $10,
  "blockers" = $11,
  "feedback_for_manager" = $12,
  "workload_feelings" = $13,
  "skill_development" = $14,
  "tasks" = $15,
  "updated_at" = now()
WHERE "id" = $16
RETURNING *;

-- PUT ROUTE QUERIE (Marks old forms as inactive whenever a new form is created for the same pair. Makes sure only one active form exists at a time for each pair.)
UPDATE "check_ins" SET "is_active" = FALSE WHERE "associate_id" = $1 AND "manager_id" = $2;

-- PUT ROUTE QUERIE (Marks any form older than 7 days as inactive. Automatically closes forms that are outdated.)
UPDATE "check_ins" SET "is_active" = FALSE WHERE "week_of" <= NOW() - INTERVAL '7 days';

-- PUT ROUTE QUERIE (Only deactivates forms that are still marked as active and are older than 7 days. Ensures all ongoing forms older than 1 week are closed.)
UPDATE "check_ins" SET "is_active" = FALSE WHERE "is_active" = TRUE AND "week_of" <= NOW() - INTERVAL '7 days';

-- DELETE ROUTE QUERIE (remove a check-in by ID)
DELETE FROM "check_ins" WHERE "id" = $1 RETURNING *;

---------- *** QUERIES FOR MANAGER_CHECK_INS TABLE *** ----------

-- GET ROUTE QUERIE (fetch all manager check-ins)
SELECT "manager_check_ins".*, "dashboard_week".title 
FROM "manager_check_ins"
JOIN "dashboard_week" 
ON "manager_check_ins".dashboard_week_id = "dashboard_week".id
ORDER BY "manager_check_ins".created_at DESC;

-- GET ROUTE QUERIE (fetch check-ins for a specific manager (by manager ID))
SELECT "manager_check_ins".*, "dashboard_week".title 
FROM "manager_check_ins"
JOIN "dashboard_week" 
ON "manager_check_ins".dashboard_week_id = "dashboard_week".id
WHERE "manager_check_ins".manager_id = $1
ORDER BY "manager_check_ins".created_at DESC;

-- POST ROUTE QUERIE (insert a new manager check-in)
INSERT INTO "manager_check_ins" ("manager_id", "dashboard_week_id", "follow_up", "status_read") VALUES ($1, $2, $3, $4) RETURNING *;

-- PUT ROUTE QUERIE (update a specific a specific dasboard week)
UPDATE "manager_check_ins" 
SET
  "manager_id" = $1,
  "dashboard_week_id" = $2,
  "follow_up" = $3,
  "status_read" = $4,
  "updated_at" = now()
WHERE "id" = $5
RETURNING *;

-- DELETE ROUTE QUERIE (remove a manager check-in by ID)
DELETE FROM "manager_check_ins" WHERE "id" = $1 RETURNING *;

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
