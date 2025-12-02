# Database Setup Guide

This application supports both **PostgreSQL** (recommended) and **SQLite** (for quick development).

## Option 1: PostgreSQL Setup (Recommended)

### Step 1: Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### Step 2: Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL console, run:
CREATE DATABASE accountant_dashboard;
CREATE USER accountant WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE accountant_dashboard TO accountant;
\q
```

### Step 3: Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
DATABASE_URL=postgresql://accountant:your_secure_password@localhost:5432/accountant_dashboard
```

### Step 4: Initialize Database

The application will automatically create tables when you first run it:

```bash
cd backend
./venv/bin/uvicorn app.main:app --reload
```

## Option 2: SQLite Setup (Quick Development)

If you want to use SQLite instead (no PostgreSQL installation needed):

### Step 1: Configure Environment

Create a `.env` file in the `backend/` directory:

```bash
USE_SQLITE=true
```

### Step 2: Run Application

```bash
cd backend
./venv/bin/uvicorn app.main:app --reload
```

The SQLite database file (`sql_app.db`) will be created automatically.

## Using the Python Initialization Script

We've provided a script to create the PostgreSQL database automatically:

```bash
cd backend
./venv/bin/python init_db.py
```

This script will:
- Check if PostgreSQL is running
- Create the database if it doesn't exist
- Provide helpful error messages if there are issues

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "password authentication failed"**
```bash
# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

**Error: "connection refused"**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql
```

**Error: "database does not exist"**
```bash
# Create database using postgres user
sudo -u postgres createdb accountant_dashboard

# Or using psql
sudo -u postgres psql -c "CREATE DATABASE accountant_dashboard;"
```

### SQLite Permissions

If you get permission errors with SQLite:
```bash
# Ensure the backend directory is writable
chmod 755 backend/
```

## Database Migration

To switch between databases:

1. **From SQLite to PostgreSQL:**
   - Update `.env` to use PostgreSQL URL
   - Remove or comment out `USE_SQLITE=true`
   - Restart the application

2. **From PostgreSQL to SQLite:**
   - Add `USE_SQLITE=true` to `.env`
   - Restart the application

**Note:** Data will NOT be automatically migrated between databases. You'll start with fresh data when switching.

## Verifying Database Connection

Check the application logs when starting the server. You should see:
```
Using database: postgresql://...
```
or
```
Using SQLite database
```

Then you'll see:
```
Seeding data...
Data seeded.
```

This confirms the database connection is working and tables have been created.

## Production Considerations

For production deployment:

1. **Use PostgreSQL** (better performance, concurrent connections)
2. **Secure credentials** (use strong passwords, environment variables)
3. **Enable SSL** for database connections
4. **Set up backups** (pg_dump for PostgreSQL)
5. **Configure connection pooling**
6. **Implement database migrations** (use Alembic)

Example production DATABASE_URL:
```
DATABASE_URL=postgresql://user:password@db.example.com:5432/accountant_dashboard?sslmode=require
```
