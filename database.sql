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
  "job_title" VARCHAR (255)
);

CREATE TABLE "dashboard_week" (
  "id" SERIAL PRIMARY KEY,
  "week_number" INTEGER,
  "active_date_start" DATE,
  "active_date_end" DATE,
  "theme" VARCHAR (255),
  "content" TEXT,
  "focus" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
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
