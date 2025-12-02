from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import random
from faker import Faker
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Accountant Dashboard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for this demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

fake = Faker()

def seed_data(db: Session):
    if db.query(models.Payment).count() > 0:
        return

    print("Seeding data...")
    # Seed Payments
    statuses = ["paid", "pending", "failed"]
    for _ in range(30):
        payment = models.Payment(
            amount=round(random.uniform(100, 5000), 2),
            date=fake.date_time_between(start_date="-30d", end_date="now"),
            status=random.choice(statuses),
            description=fake.company()
        )
        db.add(payment)

    # Seed Invoices
    inv_statuses = ["paid", "unpaid", "overdue"]
    for _ in range(30):
        date = fake.date_time_between(start_date="-60d", end_date="now")
        invoice = models.Invoice(
            amount=round(random.uniform(500, 10000), 2),
            date=date,
            due_date=date + timedelta(days=30),
            status=random.choice(inv_statuses),
            customer_name=fake.name()
        )
        db.add(invoice)
    
    db.commit()
    print("Data seeded.")

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    seed_data(db)
    db.close()

def log_activity(db: Session, event_type: str, details: str, error: str = None):
    log = models.Log(event_type=event_type, details=details, error=error)
    db.add(log)
    db.commit()

@app.get("/api/payments", response_model=List[schemas.Payment])
def get_payments(
    skip: int = 0, 
    limit: int = 10, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Payment)
    if status:
        query = query.filter(models.Payment.status == status)
    
    payments = query.offset(skip).limit(limit).all()
    log_activity(db, "agent_request", f"Fetched payments. Skip: {skip}, Limit: {limit}, Status: {status}")
    return payments

@app.get("/api/invoices", response_model=List[schemas.Invoice])
def get_invoices(
    skip: int = 0, 
    limit: int = 10, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Invoice)
    if status:
        query = query.filter(models.Invoice.status == status)
    
    invoices = query.offset(skip).limit(limit).all()
    log_activity(db, "agent_request", f"Fetched invoices. Skip: {skip}, Limit: {limit}, Status: {status}")
    return invoices

@app.get("/api/summary", response_model=schemas.Summary)
def get_summary(db: Session = Depends(get_db)):
    total_payments = db.query(models.Payment).with_entities(models.Payment.amount).all()
    total_payments_sum = sum([p.amount for p in total_payments])

    total_invoices = db.query(models.Invoice).with_entities(models.Invoice.amount).all()
    total_invoices_sum = sum([i.amount for i in total_invoices])

    unpaid_invoices = db.query(models.Invoice).filter(models.Invoice.status == "unpaid").all()
    unpaid_invoices_count = len(unpaid_invoices)
    unpaid_invoices_amount = sum([i.amount for i in unpaid_invoices])

    # Monthly breakdown (simple implementation)
    # Group by month-year
    monthly_breakdown = {}
    
    all_payments = db.query(models.Payment).all()
    for p in all_payments:
        key = p.date.strftime("%Y-%m")
        if key not in monthly_breakdown:
            monthly_breakdown[key] = {"payments": 0, "invoices": 0}
        monthly_breakdown[key]["payments"] += p.amount

    all_invoices = db.query(models.Invoice).all()
    for i in all_invoices:
        key = i.date.strftime("%Y-%m")
        if key not in monthly_breakdown:
            monthly_breakdown[key] = {"payments": 0, "invoices": 0}
        monthly_breakdown[key]["invoices"] += i.amount

    log_activity(db, "summary_call", "Generated summary")
    
    return {
        "total_payments": total_payments_sum,
        "total_invoices": total_invoices_sum,
        "unpaid_invoices_count": unpaid_invoices_count,
        "unpaid_invoices_amount": unpaid_invoices_amount,
        "monthly_breakdown": monthly_breakdown
    }

@app.post("/api/ai-assistant", response_model=schemas.ChatResponse)
def ai_assistant(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    query = request.query.lower()
    response_text = ""
    
    # Simple keyword based mock AI
    if "invoice" in query:
        count = db.query(models.Invoice).count()
        unpaid = db.query(models.Invoice).filter(models.Invoice.status == "unpaid").count()
        response_text = f"I found {count} invoices in total. There are {unpaid} unpaid invoices currently."
    elif "payment" in query:
        total = db.query(models.Payment).count()
        response_text = f"There are {total} payment records in the system."
    elif "summary" in query or "overview" in query:
        response_text = "The summary shows we are tracking payments and invoices. You can check the dashboard for charts."
    else:
        response_text = "I can help you with questions about invoices and payments. Try asking 'How many unpaid invoices are there?'"

    log_activity(db, "assistant_query", f"Query: {request.query}", error=None)
    
    return {
        "response": response_text,
        "timestamp": datetime.utcnow()
    }

@app.get("/api/agent-logs", response_model=List[schemas.Log])
def get_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(models.Log).order_by(models.Log.timestamp.desc()).limit(limit).all()
    return logs
