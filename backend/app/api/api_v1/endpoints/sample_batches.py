from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from app.constants.state import SampleBatchState


router = APIRouter()


def retrieve_sample_batch(db: Session, id: int, expected_state: Optional[str] = None) -> Optional[models.SampleBatch]:
    sample_batch = crud.sample_batch.get(db=db, id=id)
    if sample_batch is None:
        raise HTTPException(
            status_code=404, detail="No se encontró el lote"
        )
    if expected_state is None:
        return sample_batch
    if sample_batch.current_state != expected_state:
        raise HTTPException(
            status_code=400, detail="Acción incompatible con el estado del lote"
        )


@router.get("/", response_model=List[schemas.SampleBatch])
def read_batches(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]],
    # )
) -> Any:
    """
    Retrieve batches.
    """
    if True:  # crud.user.is_admin(current_user):
        batches = crud.sample_batch.get_multi(db, skip=skip, limit=limit)
    else:
        batches = crud.sample_batch.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return batches


@router.get("/{id}", response_model=schemas.SampleBatch)
def read_batch(
    *,
    db: Session = Depends(deps.get_db),
    id: int
) -> Any:
    """
    Get batch by ID.
    """
    batch = crud.batch.get(db=db, id=id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.post("/{id}/mark-batch-as-processed", response_model=List[schemas.SampleBatch])
def mark_batch_as_processed(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    db: Session = Depends(deps.get_db)
) -> Any:
    # TODO: Falta el parametro de la url
    sample_batch = retrieve_sample_batch(
        db, id, expected_state=SampleBatchState.STATE_ONE)
    crud.sample_batch.update_state(db=db, db_obj=sample_batch,
                                   new_state=StudyState.STATE_TWO)
    
    return sample_batch
