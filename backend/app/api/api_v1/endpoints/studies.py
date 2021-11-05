from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role

router = APIRouter()


@router.get("/", response_model=List[schemas.Study])
def read_studies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]],
    )
) -> Any:
    """
    Retrieve studies.
    """
    if True: #crud.user.is_admin(current_user):
        studies = crud.study.get_multi(db, skip=skip, limit=limit)
    else:
        studies = crud.study.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return studies


@router.post("/", response_model=schemas.Study)
def create_study(
    *,
    db: Session = Depends(deps.get_db),
    study_in: schemas.StudyCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]],
    )
) -> Any:
    """
    Create new study.
    """
    study = crud.study.create_with_owner(db=db, obj_in=study_in, employee_id=current_employee.id)
    return study


@router.put("/{id}", response_model=schemas.Study)
def update_study(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    study_in: schemas.StudyUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an study.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    if not crud.user.is_admin(current_user) and (study.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    study = crud.study.update(db=db, db_obj=study, obj_in=study_in)
    return study


@router.get("/{id}", response_model=schemas.Study)
def read_study(
    *,
    db: Session = Depends(deps.get_db),
    id: int
) -> Any:
    """
    Get study by ID.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study


@router.post("/{id}/generate-budget")
def generate_budget(
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    return []


@router.delete("/{id}", response_model=schemas.Study)
def delete_study(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an study.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    if not crud.user.is_admin(current_user) and (study.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    study = crud.study.remove(db=db, id=id)
    return study

