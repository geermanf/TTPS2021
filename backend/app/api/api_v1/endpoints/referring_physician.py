from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.ReferringPhysician])
def read_referring_physician(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
) -> Any:
    """
    Retrieve referring physician.
    """
    referring_physician = crud.referring_physician.get_multi(db, skip=skip, limit=limit)
    return referring_physician


@router.post("/", response_model=schemas.ReferringPhysician)
def create_referring_physician(
        *,
        db: Session = Depends(deps.get_db),
        referring_physician_in: schemas.ReferringPhysicianCreate
) -> Any:
    """
    Create new referring physician.
    """
    referring_physician = crud.referring_physician.get_by_licence(db, licence=referring_physician_in.licence)
    if referring_physician:
        raise HTTPException(
            status_code=400,
            detail="The referring physician with this licence already exists in the system.",
        )
    referring_physician = crud.referring_physician.create(db, obj_in=referring_physician_in)
    return referring_physician


@router.get("/{referring_physician_id}", response_model=schemas.ReferringPhysician)
def read_referring_physician_by_id(
        referring_physician_id: int,
        db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a referring physician user by id.
    """
    referring_physician = crud.referring_physician.get(db, id=referring_physician_id)
    if not referring_physician:
        raise HTTPException(
            status_code=400,
            detail="The referring physician with this id does not exists in the system.",
        )
    return referring_physician


@router.put("/{referring_physician_id}", response_model=schemas.ReferringPhysician)
def update_referring_physician(
        *,
        db: Session = Depends(deps.get_db),
        referring_physician_id: int,
        referring_physician_in: schemas.ReferringPhysicianUpdate,
) -> Any:
    """
    Update a referring physician.
    """
    doctor = crud.referring_physician.get(db, id=referring_physician_id)
    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="The referring physician with this id does not exist in the system",
        )
    doctor = crud.referring_physician.update(db, db_obj=doctor, obj_in=referring_physician_in)
    return doctor
