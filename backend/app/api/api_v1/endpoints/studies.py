from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Security, File, UploadFile
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.constants.role import Role
from app.constants.state import StudyState
from app.crud.exceptions import *
from weasyprint import HTML
from fastapi.responses import Response


router = APIRouter()


@router.get("/", response_model=List[schemas.Study])
def read_studies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]],
    # )
) -> Any:
    """
    Retrieve studies.
    """
    if True:  # crud.user.is_admin(current_user):
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
    study = crud.study.create_with_owner(
        db=db, obj_in=study_in, employee_id=current_user.id)
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
    Update a study.
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


def retrieve_study(db: Session, id: int, expected_state: Optional[str] = None) -> Optional[models.Study]:
    study = crud.study.get(db=db, id=id)
    if study is None:
        raise HTTPException(
            status_code=404, detail="No se encontró el estudio"
        )
    if expected_state is None:
        return study
    if study.current_state != expected_state:
        raise HTTPException(
            status_code=400, detail="Acción incompatible con el estado del estudio"
        )


@router.post("/{id}/generate-budget")
def generate_budget(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id)
    # generar pdf en base al estudio y devolverlo
    return {"devuelvo el pdf con el presupuesto aca": expected_state}


@router.post("/{id}/payment-receipt/")
async def payment_receipt(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=None) # StudyState.STATE_ONE

    # aca recibimos el archivo de comprobante de pago...
    # una vez que se subio, habilitar un boton que permita
    # descargar el consentimiento.
    # Idea: agregar columna str en Study: payment_receipt
    # por default en None, dsps en el front, consultan
    # por un endpoint studies/{id}/payment-receipt
    # si devuelve un 404 es porque todavia no lo subio
    # si devuelve un string, habilitar el boton para descargar el consentimiento
    # ese atributo lo cargo con el nombre del archivo subido,
    # que lo obtengo de file.filename

    study.payment_receipt = file.filename

    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_HIDDEN)

    return {"filename": file.filename}


# @router.get("/{id}/payment-receipt/")
# def payment_receipt(
#     id: int,
#     # current_user: models.User = Security(
#     #     deps.get_current_active_user,
#     #     scopes=[Role.EMPLOYEE["name"]]
#     # ),
#     db: Session = Depends(deps.get_db)
# ) -> Any:
#     study = retrieve_study(db, id)
#     if study.payment_receipt is None:
#         raise HTTPException(
#             status_code=404, detail="No hay registro de comprobante de pago para el estudio"
#         )
#     return {"filename": study.payment_receipt}


@router.get("/{id}/download-consent", response_class=Response)
def download_consent(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=None) # FIXME: deberia validar que esté en STATE_HIDDEN o STATE_TWO
    pdf = HTML(string='<h3>Consentimiento para estudio X</h3><p>En caracter de ...</p>',
               encoding='UTF-8').write_pdf()
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_TWO)
    return Response(content=pdf, media_type="application/pdf")


@router.post("/{id}/signed-consent")
async def signed_consent(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_TWO)
    study.signed_consent = file.filename
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_THREE)
    return {"filename": file.filename}


@router.post("/{id}/register-apointment", response_model=schemas.Appointment)
def register_apointment(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    appointment_in: schemas.AppointmentCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_THREE)
    try:
        appointment = crud.appointment.create(db=db, study_id=study.id, obj_in=appointment_in)
    except StudyAlreadyWithAppointment:
        raise HTTPException(
            status_code=400,
            detail="El estudio ya registra un turno",
        )
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_FOUR)
    return appointment


@router.post("/{id}/register-sample", response_model=schemas.Sample)
def register_sample(
    id: int,
    sample_in: schemas.SampleCreate,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_FOUR)
    try:
        sample = crud.sample.create(db=db, study_id=id, obj_in=sample_in)
    except StudyAlreadyWithSample:
        raise HTTPException(
            status_code=400,
            detail="El estudio ya registra una muestra",
        )
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_FIVE)
    return sample


@router.post("/{id}/register-sample-retirement")
def register_sample_retirement(
    id: int,
    # current_user: models.User = Security(
    #     deps.get_current_active_user,
    #     scopes=[Role.EMPLOYEE["name"]]
    # ),
    sample_in: schemas.SamplePickedUp,
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_FIVE)

    # TODO: eliminar SamplePickedUp y usar solo el argumento str,
    # tambien, cargar ese string en la muestra

    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_SIX)
    # no informa si se creó un lote
    return {"El retiro de la muestra fue registrado"}


# @router.delete("/{id}", response_model=schemas.Study)
# def delete_study(
#     *,
#     db: Session = Depends(deps.get_db),
#     id: int,
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     """
#     Delete an study.
#     """
#     study = crud.study.get(db=db, id=id)
#     if not study:
#         raise HTTPException(status_code=404, detail="Study not found")
#     study = crud.study.remove(db=db, id=id)
#     return study
