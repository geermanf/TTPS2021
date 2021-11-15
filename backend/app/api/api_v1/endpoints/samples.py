from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from app.crud.exceptions import SampleAlreadyPaid


router = APIRouter()


def retrieve_sample(db: Session, id: int) -> Optional[models.Sample]:
    sample = crud.sample.get(db=db, id=id)
    if sample is None:
        raise HTTPException(
            status_code=404, detail="No se encontró la muestra."
        )
    return sample


@router.get("/", response_model=List[schemas.Sample])
def read_samples(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]],
    )
) -> Any:
    """
    Retrieve samples.
    """
    if True:  # crud.user.is_admin(current_user):
        samples = crud.sample.get_multi(db, skip=skip, limit=limit)
    else:
        samples = crud.sample.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return samples


@router.get("/{id}", response_model=schemas.Sample)
def read_sample(
    *,
    db: Session = Depends(deps.get_db),
    id: int
) -> Any:
    """
    Get sample by ID.
    """
    sample = crud.sample.get(db=db, id=id)
    if not sample:
        raise HTTPException(status_code=404, detail="Muestra no encontrada")
    return sample


@router.post("/{id}/mark-as-paid", response_model=List[schemas.Sample])
def mark_sample_as_paid(
    id: int,
    url: str,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    sample = retrieve_sample(db, id)
    try:
        sample = crud.sample.mark_as_paid(
        db=db, db_obj=sample, url=url)
    except SampleAlreadyPaid:
        raise HTTPException(
            status_code=400, detail="La muestra ya fue pagada."
        )
    return sample
