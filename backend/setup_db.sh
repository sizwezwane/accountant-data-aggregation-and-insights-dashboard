#!/bin/bash
# PostgreSQL Database Setup Script

echo "Setting up PostgreSQL database for Accountant Dashboard..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    echo "You can start it with: sudo systemctl start postgresql"
    exit 1
fi

# Database configuration
DB_NAME="accountant_dashboard"
DB_USER="postgres"

# Check if database exists
if psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database '$DB_NAME' already exists."
    read -p "Do you want to drop and recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping database '$DB_NAME'..."
        dropdb -U $DB_USER $DB_NAME
        echo "Creating database '$DB_NAME'..."
        createdb -U $DB_USER $DB_NAME
        echo "Database recreated successfully!"
    else
        echo "Using existing database."
    fi
else
    echo "Creating database '$DB_NAME'..."
    createdb -U $DB_USER $DB_NAME
    echo "Database created successfully!"
fi

echo ""
echo "Database setup complete!"
echo "Connection string: postgresql://$DB_USER:postgres@localhost:5432/$DB_NAME"
echo ""
echo "The application will automatically create tables on first run."
