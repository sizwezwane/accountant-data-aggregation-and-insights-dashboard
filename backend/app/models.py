from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from .database import Base
import datetime

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    date = Column(DateTime)
    status = Column(String) # paid, pending, failed
    description = Column(String)

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    date = Column(DateTime) # Issue date
    due_date = Column(DateTime)
    status = Column(String) # paid, unpaid, overdue
    customer_name = Column(String)

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    event_type = Column(String) # agent_request, summary_call, assistant_query
    details = Column(Text)
    error = Column(Text, nullable=True)
