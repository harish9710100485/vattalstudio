-- Create database
CREATE DATABASE enquiry_db;

\c enquiry_db;

-- Enquiries table
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    project_description TEXT NOT NULL,
    budget VARCHAR(50),
    timeline VARCHAR(50),
    file_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_email ON enquiries(email);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Sample data (optional)
INSERT INTO enquiries (name, email, phone, company, project_description, budget, timeline, status) VALUES
    ('John Doe', 'john@example.com', '+1 234-567-8900', 'Tech Corp', 'Need a e-commerce website with payment gateway', '$10,000 - $50,000', '2-3 months', 'pending'),
    ('Jane Smith', 'jane@example.com', '+1 345-678-9012', 'Design Studio', 'Mobile app UI/UX design for healthcare app', '$5,000 - $10,000', '1-2 months', 'in_review'),
    ('Bob Johnson', 'bob@example.com', '+1 456-789-0123', 'Startup Inc', 'Full stack web application with AI features', '> $100,000', '4-6 months', 'pending');