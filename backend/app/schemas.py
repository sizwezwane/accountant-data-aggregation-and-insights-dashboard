from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class PaymentBase(BaseModel):
    amount: float
    date: datetime
    status: str
    description: str

class Payment(PaymentBase):
    id: int

    class Config:
        orm_mode = True

class InvoiceBase(BaseModel):
    amount: float
    date: datetime
    due_date: datetime
    status: str
    customer_name: str

class Invoice(InvoiceBase):
    id: int

    class Config:
        orm_mode = True

class LogBase(BaseModel):
    event_type: str
    details: str
    error: Optional[str] = None

class Log(LogBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class Summary(BaseModel):
    total_payments: float
    total_invoices: float
    unpaid_invoices_count: int
    unpaid_invoices_amount: float
    monthly_breakdown: dict

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
