import re
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import JobAnalysis, ScamReport, RecruiterEntity

class RecruiterGraphService:
    def build_network_for_entity(self, identifier: str, db: Session) -> Dict[str, Any]:
        """
        Builds a network graph centered around a queried phone, email, domain, or company name.
        Traverses relationships across JobAnalysis and ScamReport records.
        """
        clean_query = identifier.strip().lower()
        nodes: Dict[str, Dict[str, Any]] = {}
        edges: List[Dict[str, str]] = []
        warnings: List[str] = []

        # Find matching job analyses
        analyses = db.query(JobAnalysis).filter(
            (JobAnalysis.recruiter_email.ilike(f"%{clean_query}%")) |
            (JobAnalysis.recruiter_phone.ilike(f"%{clean_query}%")) |
            (JobAnalysis.company_name.ilike(f"%{clean_query}%")) |
            (JobAnalysis.company_website.ilike(f"%{clean_query}%"))
        ).limit(50).all()

        # Find matching scam reports
        reports = db.query(ScamReport).filter(
            (ScamReport.contact_email.ilike(f"%{clean_query}%")) |
            (ScamReport.contact_phone.ilike(f"%{clean_query}%")) |
            (ScamReport.company_name.ilike(f"%{clean_query}%")) |
            (ScamReport.website_url.ilike(f"%{clean_query}%"))
        ).limit(50).all()

        # Add root target node
        root_id = f"target_{clean_query}"
        nodes[root_id] = {
            "id": root_id,
            "label": identifier,
            "type": "target",
            "risk": "medium"
        }

        # Track contact overlaps across distinct companies
        phone_to_companies: Dict[str, set] = {}
        email_to_companies: Dict[str, set] = {}

        # Process Job Analyses
        for job in analyses:
            job_node_id = f"job_{job.id}"
            nodes[job_node_id] = {
                "id": job_node_id,
                "label": f"{job.job_title[:24]}...",
                "type": "job",
                "risk": job.risk_category.lower()
            }
            edges.append({
                "source": root_id,
                "target": job_node_id,
                "label": "Analyzed Posting"
            })

            # Add Company Node
            if job.company_name:
                comp_node_id = f"comp_{job.company_name.lower().replace(' ', '_')}"
                if comp_node_id not in nodes:
                    nodes[comp_node_id] = {
                        "id": comp_node_id,
                        "label": job.company_name,
                        "type": "company",
                        "risk": "medium" if job.risk_score > 50 else "low"
                    }
                edges.append({
                    "source": job_node_id,
                    "target": comp_node_id,
                    "label": "Employer"
                })

            # Track Recruiter Phone
            if job.recruiter_phone:
                p = job.recruiter_phone.strip()
                p_id = f"phone_{p}"
                if p_id not in nodes:
                    nodes[p_id] = {
                        "id": p_id,
                        "label": p,
                        "type": "phone",
                        "risk": "high" if job.risk_score > 60 else "medium"
                    }
                edges.append({
                    "source": job_node_id,
                    "target": p_id,
                    "label": "Contact Phone"
                })
                if p not in phone_to_companies:
                    phone_to_companies[p] = set()
                if job.company_name:
                    phone_to_companies[p].add(job.company_name)

            # Track Recruiter Email
            if job.recruiter_email:
                em = job.recruiter_email.strip().lower()
                em_id = f"email_{em}"
                if em_id not in nodes:
                    nodes[em_id] = {
                        "id": em_id,
                        "label": em,
                        "type": "email",
                        "risk": "high" if job.risk_score > 60 else "medium"
                    }
                edges.append({
                    "source": job_node_id,
                    "target": em_id,
                    "label": "Recruiter Email"
                })
                if em not in email_to_companies:
                    email_to_companies[em] = set()
                if job.company_name:
                    email_to_companies[em].add(job.company_name)

        # Process Scam Reports
        for rep in reports:
            rep_node_id = f"report_{rep.id}"
            nodes[rep_node_id] = {
                "id": rep_node_id,
                "label": f"Report: {rep.title[:20]}",
                "type": "scam_report",
                "risk": "critical"
            }
            edges.append({
                "source": root_id,
                "target": rep_node_id,
                "label": "Community Flag"
            })

            if rep.contact_phone:
                p = rep.contact_phone.strip()
                p_id = f"phone_{p}"
                if p_id not in nodes:
                    nodes[p_id] = {"id": p_id, "label": p, "type": "phone", "risk": "critical"}
                edges.append({"source": rep_node_id, "target": p_id, "label": "Reported Phone"})

            if rep.contact_email:
                em = rep.contact_email.strip().lower()
                em_id = f"email_{em}"
                if em_id not in nodes:
                    nodes[em_id] = {"id": em_id, "label": em, "type": "email", "risk": "critical"}
                edges.append({"source": rep_node_id, "target": em_id, "label": "Reported Email"})

        # Cross-Entity Intelligence: Detect Repeated Contact across multiple different company names
        for phone, comps in phone_to_companies.items():
            if len(comps) > 1:
                comp_str = ", ".join(list(comps)[:3])
                warnings.append(
                    f"Recruiter Connection Warning: Phone number '{phone}' appears in {len(comps)} different company listings ({comp_str}). This is a common syndicate tactic."
                )

        for email, comps in email_to_companies.items():
            if len(comps) > 1:
                comp_str = ", ".join(list(comps)[:3])
                warnings.append(
                    f"Recruiter Connection Warning: Email '{email}' is claiming to represent {len(comps)} unrelated companies ({comp_str})."
                )

        if len(reports) > 0:
            warnings.append(
                f"Threat History Alert: {len(reports)} community scam report(s) directly reference this contact or entity."
            )

        if not warnings:
            warnings.append("No multi-company syndicate connections detected for this identifier at this time.")

        return {
            "nodes": list(nodes.values()),
            "edges": edges,
            "warnings": warnings
        }

recruiter_graph_service = RecruiterGraphService()
