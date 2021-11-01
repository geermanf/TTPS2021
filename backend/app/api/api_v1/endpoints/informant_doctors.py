from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session
from app.crud.crud_user import (
    UsernameAlreadyRegistered,
    EmailAlreadyRegistered
)
from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

from fastapi import APIRouter

router = APIRouter()


@router.get("/", response_model=List[schemas.InformantDoctor])
def read_informant_doctors(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve informant doctors.
    """
    informants = crud.informant_doctor.get_multi(db, skip=skip, limit=limit)
    return informants


@router.post("/", response_model=schemas.InformantDoctor)
def create_informant_doctor(
    *,
    db: Session = Depends(deps.get_db),
    informant_in: schemas.InformantCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new informant doctor.
    """
    try:
        informant = crud.informant.create(db, obj_in=informant_in)
    except UsernameAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El username ingresado ya se encuentra registrado",
        )
    except EmailAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El email ingresado ya se encuentra registrado",
        )
    if settings.EMAILS_ENABLED and informant_in.email:
        send_new_account_email(
            email_to=informant_in.email, username=informant_in.username, password=informant_in.password
        )
    return informant


@router.get("/{informant_id}", response_model=schemas.InformantDoctor)
def read_informant_doctor_by_id(
    informant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific informant by id.
    """
    informant = crud.informant_doctor.get(db, id=informant_id)
    if informant == current_user:
        return informant
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The current user doesn't have enough privileges"
        )
    return informant


@router.put("/{informant_id}", response_model=schemas.InformantDoctor)
def update_informant_doctor(
    *,
    db: Session = Depends(deps.get_db),
    informant_id: int,
    informant_in: schemas.InformantUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update an informant doctor.
    """
    try:
        informant = crud.informant_doctor.update(
            db, db_obj=informant, obj_in=informant_in)
    except UsernameAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El username ingresado ya se encuentra registrado",
        )
    except EmailAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El email ingresado ya se encuentra registrado",
        )
    return informant
