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
ALTER TABLE users 
ADD user_color VARCHAR(15) -- `{NOT NULL}` can't be added cause there are data in the table alrady


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