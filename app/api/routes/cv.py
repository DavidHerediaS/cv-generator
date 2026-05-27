from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter
from app.services.pdf_service import generate_pdf
from app.api.dependencies import get_db, get_current_user
from app.database.models.user import User
from app.database.schemas.cv import CVCreate, CVUpdate, CVResponse
from app.services.cv_service import create_cv, get_cv, get_cvs_by_user, update_cv, delete_cv

router = APIRouter(prefix="/cv", tags=["cv"])


class PDFRequest(BaseModel):
    foto_base64: str | None = None


@router.post("", response_model=CVResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=CVResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create(
    data: CVCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_cv(db, current_user.id, data)


@router.get("", response_model=list[CVResponse])
@router.get("/", response_model=list[CVResponse], include_in_schema=False)
def list_cvs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_cvs_by_user(db, current_user.id)


@router.get("/{cv_id}", response_model=CVResponse)
def get_one(
    cv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = get_cv(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )
    return cv


@router.put("/{cv_id}", response_model=CVResponse)
def update(
    cv_id: int,
    data: CVUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"DATA RECIBIDA: {data.model_dump()}")
    cv = update_cv(db, cv_id, current_user.id, data)
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )
    return cv


@router.delete("/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    cv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = delete_cv(db, cv_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )


@router.post("/{cv_id}/pdf")
@limiter.limit("20/minute")
def download_pdf(
    request: Request,
    cv_id: int,
    pdf_request: PDFRequest = PDFRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv = get_cv(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV no encontrado"
        )

    pdf_bytes = generate_pdf(cv, pdf_request.foto_base64)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=cv_{cv.nombre}_{cv.apellidos}.pdf"
        }
    )