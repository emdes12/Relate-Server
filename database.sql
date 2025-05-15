CREATE DATABASE relateplus;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--insert test users
INSERT INTO users (user_name, user_email, user_password)
VALUES ('tester1', 'tester1@gmail.com', 'tester1');

-- altering table to add a new column
ALTER TABLE users ADD user_color VARCHAR(15); -- `{NOT NULL}` can't be added cause there are data in the table alrady


-- create customers
CREATE TABLE clients (
    client_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(100) NOT NULL,
    client_number VARCHAR(20) NOT NULL,
    client_email VARCHAR(100),
    client_label VARCHAR(100),
    client_color VARCHAR(30),
    client_location VARCHAR(100),
    client_birthday VARCHAR(10),
    client_note VARCHAR(320),
    user_id      uuid,
    CONSTRAINT fk_clients_user_id  -- Explicit name
        FOREIGN KEY (user_id) 
        REFERENCES users (user_id),     -- Ensure 'users(id)' exists
    UNIQUE (client_number, user_id)
);


-- creating a new client
INSERT INTO clients (
    user_id,
    client_name,
    client_number,
    client_email,
    client_label,
    client_location,
    client_birthday,
    client_note,
    client_color
) VALUES (
    '3d9afb36-c0fd-450a-aff9-b2c40e4a60d6',
    'Tosin Adeloye',
    0901231212,
    'tosslarry@gmail.com',
    'travel-docs',
    'USA',
    '13/03',
    'He is in for Editing and perfectiong',
    'darkturquoise'
), (
    '3d9afb36-c0fd-450a-aff9-b2c40e4a60d6',
    'Ifeoluwa Adeloye',
    08063214150,
    'ifeAdeloye@gmail.com',
    'travel-docs',
    'USA',
    '13/06',
    'He is in for Editing and perfectiong, currently studying in USA',
    'saddlebrown'
), (
    'd1128008-2d3b-4433-9276-cab0c68d4449',
    'Tosin Adeloye',
    0901231212,
    'tosslarry@gmail.com',
    'new-in-take',
    'USA',
    '13/03',
    '',
    'darkturquoise'
), (
    '8066e457-8f8e-433f-bdd2-7d8142bf4efa',
    'Ifeoluwa Adeloye',
    08063214150,
    'ifeAdeloye@gmail.com',
    'student',
    'USA',
    '13/06',
    'currently studying in USA',
    'saddlebrown'
), (
    '3d9afb36-c0fd-450a-aff9-b2c40e4a60d6',
    'Shegzy',
    08071112221,
    '',
    'travel-docs, JAPA',
    'Nigeria',
    '13/03',
    'He is in for Editing and perfectiong',
    'darkturquoise'
), (
    '8066e457-8f8e-433f-bdd2-7d8142bf4efa',
    'Babalola',
    07063232341,
    'b.lola@email.com',
    'VVIP',
    'Ibadan',
    '03/12',
    'The owner of B-LOW Estate',
    'saddlebrown'
);


-- syntax to get user's client list
select users.user_id, users.user_name, clients.client_id, clients.client_name, clients.client_email, clients.client_location, clients.client_label 
from clients
join users
on users.user_id=clients.user_id
where clients.user_id = ('$1');


-- delete a row(data) from table
DELETE FROM clients WHERE user.id = $1;

-- Update client details from clients table
UPDATE clients SET client_name=$2, client_number=$3, client_email=$4, client_label=$5, client_location=$6, client_birthday=$7, client_note=$8 WHERE client_id=$1 AND user_id=$9;


-- create a new services TABLE
CREATE TABLE staffs (
    staff_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_name VARCHAR(255) NOT NULL,
    staff_email VARCHAR(255) NOT NULL,
    staff_number VARCHAR(255),
    staff_birthday VARCHAR(255),
    staff_note VARCHAR(255),
    employed_date VARCHAR(100) NOT NULL,
    staff_color VARCHAR(255) NOT NULL,
    staff_role VARCHAR(255) NOT NULL,
    user_id      uuid,
    CONSTRAINT fk_staffs_user_id  -- Explicit name
        FOREIGN KEY (user_id) 
        REFERENCES users (user_id),
    -- Individual uniqueness per user
    CONSTRAINT unique_staff_email_per_user 
        UNIQUE (staff_email, user_id),
    CONSTRAINT unique_staff_number_per_user 
        UNIQUE (staff_number, user_id)
);

-- create a staff
INSERT INTO staffs (staff_name, staff_email, staff_number, staff_birthday, employed_date, staff_color, staff_role, staff_note, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);






-- create chats messageupload table
CREATE TABLE chats (
  chat_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_type VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  chat_message VARCHAR(10000000),
  original_name VARCHAR(255),
  storage_name VARCHAR(255),
  file_path VARCHAR(255),
  file_type VARCHAR(100),
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id      uuid,
  CONSTRAINT fk_chats_center_id 
    FOREIGN KEY (user_id) 
    REFERENCES users (user_id)
);




-- FORM TABLES HANDLER

-- form table creation
CREATE TABLE forms (
  form_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  title VARCHAR(225),
  description VARCHAR(1000000),
  color VARCHAR(225),
  submit_text VARCHAR(225),
  closing_date VARCHAR(225),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- form input fields
CREATE TABLE form_fields (
  field_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(form_id) ON DELETE CASCADE,
  label TEXT,
  field_type TEXT, -- e.g., text, textarea, email, number, date, checkbox, select
  is_required BOOLEAN DEFAULT false,
  options TEXT[], -- for select, checkbox
  position INTEGER
);

-- form responses
CREATE TABLE form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(form_id) ON DELETE CASCADE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  response JSONB -- contains field id to value map
);


-- adding COMPLETEING MESSAGE column to forms table
ALTER TABLE forms ADD completion_message VARCHAR(255);
ALTER TABLE forms ADD completed BOOLEAN DEFAULT false;