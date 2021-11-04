from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session
from app.crud.crud_user import (
    UsernameAlreadyRegistered,
    LicenseAlreadyRegistered
)
from app import crud, models, schemas
from app.api import deps

from fastapi import APIRouter

router = APIRouter()


@router.get("/", response_model=List[schemas.InformantPhysician])
def read_informant_physicians(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Retrieve informant physicians.
    """
    informants = crud.informant_physician.get_multi(db, skip=skip, limit=limit)
    return informants

# TODO: current_user no se usa, asi que llamar adentro para validar permiso


@router.post("/", response_model=schemas.InformantPhysician)
def create_informant_physician(
    *,
    db: Session = Depends(deps.get_db),
    informant_in: schemas.InformantCreate,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Create new informant physician.
    """
    try:
        return crud.informant_physician.create(db, obj_in=informant_in)
    except UsernameAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El username ingresado ya se encuentra registrado",
        )
    except LicenseAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="La licencia ingresada ya se encuentra registrada",
        )


@router.get("/{informant_id}", response_model=schemas.InformantPhysician)
def read_informant_physician_by_id(
    informant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific informant by id.
    """
    informant = crud.informant_physician.get(db, id=informant_id)
    if informant == current_user:
        return informant
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The current user doesn't have enough privileges"
        )
    return informant


@router.put("/{informant_id}", response_model=schemas.InformantPhysician)
def update_informant_physician(
    *,
    db: Session = Depends(deps.get_db),
    informant_id: int,
    informant_in: schemas.InformantUpdate,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Update an informant physician.
    """
    informant = crud.informant_physician.get(db, id=informant_id)
    if not informant:
        raise HTTPException(
            status_code=404,
            detail="The informant with this id does not exist in the system",
        )
    try:
        return crud.informant_physician.update(
            db, db_obj=informant, obj_in=informant_in)
    except UsernameAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="El username ingresado ya se encuentra registrado",
        )
    except LicenseAlreadyRegistered:
        raise HTTPException(
            status_code=400,
            detail="La licencia ingresada ya se encuentra registrada",
        )
