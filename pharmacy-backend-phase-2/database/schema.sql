CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- IDENTITY
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER'
        CHECK (role IN ('CUSTOMER', 'PHARMACIST', 'PHARMACY_ADMIN', 'DELIVERY_AGENT', 'SUPER_ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING', 'DEACTIVATED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =========================================================
-- PHARMACIES
-- =========================================================

CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    phone VARCHAR(30),
    email VARCHAR(150),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pharmacies_status ON pharmacies(status);
CREATE INDEX IF NOT EXISTS idx_pharmacies_city ON pharmacies(city);

-- =========================================================
-- PHARMACY STAFF
-- =========================================================

CREATE TABLE IF NOT EXISTS pharmacy_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    staff_role VARCHAR(30) NOT NULL
        CHECK (staff_role IN ('PHARMACIST', 'MANAGER', 'ASSISTANT')),
    license_number VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pharmacy_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_staff_pharmacy ON pharmacy_staff(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_staff_user ON pharmacy_staff(user_id);

-- =========================================================
-- MEDICINE CATEGORIES
-- =========================================================

CREATE TABLE IF NOT EXISTS medicine_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES medicine_categories(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON medicine_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_status ON medicine_categories(status);

-- =========================================================
-- MEDICINES / MASTER CATALOG
-- =========================================================

CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES medicine_categories(id) ON DELETE SET NULL,
    generic_name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    strength VARCHAR(100),
    dosage_form VARCHAR(100),
    manufacturer VARCHAR(200),
    description TEXT,
    active_ingredients TEXT,
    prescription_required BOOLEAN NOT NULL DEFAULT FALSE,
    controlled_drug BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicines_generic_name ON medicines(generic_name);
CREATE INDEX IF NOT EXISTS idx_medicines_brand_name ON medicines(brand_name);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);

-- =========================================================
-- SUPPLIERS
-- =========================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(30),
    email VARCHAR(150),
    address TEXT,
    license_number VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- PHARMACY INVENTORY
-- =========================================================

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
    reorder_quantity INTEGER NOT NULL DEFAULT 50 CHECK (reorder_quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pharmacy_id, medicine_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_pharmacy ON inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_medicine ON inventory(medicine_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);

-- =========================================================
-- INVENTORY BATCHES
-- =========================================================

CREATE TABLE IF NOT EXISTS inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    batch_number VARCHAR(120) NOT NULL,
    quantity_received INTEGER NOT NULL CHECK (quantity_received > 0),
    quantity_available INTEGER NOT NULL CHECK (quantity_available >= 0),
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
    selling_price NUMERIC(12, 2) CHECK (selling_price >= 0),
    manufactured_at DATE,
    expiry_date DATE NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'DEPLETED', 'EXPIRED', 'RECALLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (inventory_id, batch_number),
    CHECK (expiry_date >= COALESCE(manufactured_at, expiry_date)),
    CHECK (quantity_available <= quantity_received)
);

CREATE INDEX IF NOT EXISTS idx_batches_inventory ON inventory_batches(inventory_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON inventory_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_batches_status ON inventory_batches(status);

-- =========================================================
-- INVENTORY TRANSACTIONS / AUDITABLE STOCK MOVEMENT
-- =========================================================

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES inventory_batches(id) ON DELETE SET NULL,
    transaction_type VARCHAR(30) NOT NULL
        CHECK (transaction_type IN (
            'PURCHASE',
            'SALE',
            'RETURN',
            'ADJUSTMENT',
            'DAMAGED',
            'EXPIRED',
            'TRANSFER_IN',
            'TRANSFER_OUT'
        )),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    notes TEXT,
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_inventory ON inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_batch ON inventory_transactions(batch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_created ON inventory_transactions(created_at);

-- =========================================================
-- MIGRATION TRACKING
-- =========================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO schema_migrations (migration_name)
VALUES ('001_initial_schema_v2')
ON CONFLICT (migration_name) DO NOTHING;
