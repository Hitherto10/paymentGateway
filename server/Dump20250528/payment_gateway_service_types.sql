-- Database: payment_gateway

-- Drop table if it exists
DROP TABLE IF EXISTS service_types;

-- Create the service_types table
CREATE TABLE service_types (
    service_type_id INTEGER PRIMARY KEY,
    service_type_name VARCHAR(255) NOT NULL,
    is_amount_fixed BOOLEAN NOT NULL,
    amount DECIMAL(10,2) DEFAULT NULL
);

-- Insert the data
INSERT INTO service_types (service_type_id, service_type_name, is_amount_fixed, amount) 
VALUES 
    (4430731, 'School Fees', true, 5000.00),
    (4430732, 'Accommodation Fees', false, NULL);