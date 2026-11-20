from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import RecruiterNetworkGraph
from app.services.graph_service import recruiter_graph_service

router = APIRouter(prefix="/recruiter-intel", tags=["Recruiter Connection Intelligence"])

@router.get("/graph", response_model=RecruiterNetworkGraph)
def get_recruiter_network(
    query: str = Query(..., min_length=2, description="Email, phone, domain, or company name to trace"),
    db: Session = Depends(get_db)
):
    graph_data = recruiter_graph_service.build_network_for_entity(query, db)
    return RecruiterNetworkGraph(**graph_data)
