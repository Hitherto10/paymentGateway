-- Database: payment_gateway

-- Drop table if it exists
DROP TABLE IF EXISTS transaction_history;

-- Create the transaction_history table
CREATE TABLE transaction_history (
                                     "RRR" VARCHAR(255) PRIMARY KEY,
                                     payer_name VARCHAR(255) NOT NULL,
                                     amount VARCHAR(255) NOT NULL,
                                     description VARCHAR(255) NOT NULL,
                                     transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     status VARCHAR(50) NOT NULL
);

-- Insert the existing data
INSERT INTO transaction_history ("RRR", payer_name, amount, description, transaction_date, status)
VALUES
    ('140799059313', 'kenechukwu ajufo', '5000.00', 'eqwe', '2025-05-28 01:13:28', 'Successful'),
    ('160799059314', 'Olisaemeka', '5000.00', 'wwwwww', '2025-05-28 01:15:36', 'Successful'),
    ('180799059292', 'kenechukwu ajufo', '5000.00', 'School fees Payment', '2025-05-28 00:06:13', 'Successful'),
    ('220799059294', 'Chiamaka', '5000.00', 'My son''s school fees', '2025-05-28 00:25:34', 'Successful');