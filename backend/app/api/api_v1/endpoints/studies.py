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
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]],
    )
) -> Any:
    """
    Retrieve studies.
    """
    # TODO: permitir acceder a medico informante, pero asegurarse que los estudios
    # estén en estado "Esperando interpretación de resultados e informes"
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
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    )
) -> Any:
    """
    Update a study.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(
            status_code=404, detail="No se encontró el estudio.")
    if not crud.user.is_admin(current_user) and (study.owner_id != current_user.id):
        raise HTTPException(
            status_code=400, detail="No tiene permisos para la acción solicitada.")
    study = crud.study.update(db=db, db_obj=study, obj_in=study_in)
    return study


@router.get("/{id}", response_model=schemas.Study)
def read_study(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    )
) -> Any:
    """
    Get study by ID.
    """
    # TODO: permitir acceder a medico informante, pero asegurarse que el estudio
    # estén en estado "Esperando interpretación de resultados e informes"
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(
            status_code=404, detail="No se encontró el estudio.")
    return study


def retrieve_study(db: Session, id: int, expected_state: Optional[str] = None) -> Optional[models.Study]:
    study = crud.study.get(db=db, id=id)
    if study is None:
        raise HTTPException(
            status_code=404, detail="No se encontró el estudio"
        )
    if expected_state is None or expected_state == study.current_state:
        return study
    raise HTTPException(
        status_code=400, detail="Acción incompatible con el estado del estudio"
    )


@router.post("/{id}/generate-budget")
def generate_budget(
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id)
    # todo: generar pdf en base al estudio y devolverlo
    return {"Devolver el pdf con el presupuesto."}


@router.post("/{id}/payment-receipt/")
async def payment_receipt(
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_ONE)

    # aca recibimos el archivo de comprobante de pago...
    # una vez que se subio, habilitar un boton que permita
    # descargar el consentimiento.

    study.payment_receipt = file.filename

    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_TWO, employee_id=current_user.id)

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
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_TWO)
    type_study = crud.type_study.get(db, id=study.type_study_id)
    pdf = HTML(string=type_study.study_consent_template,
               encoding='UTF-8').write_pdf()
    # al descargarse, se espera que el paciente lo devuelva firmado
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_THREE, employee_id=current_user.id)
    return Response(content=pdf, media_type="application/pdf")


@router.post("/{id}/signed-consent")
async def signed_consent(
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_THREE)
    study.signed_consent = file.filename
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_FOUR, employee_id=current_user.id)
    return {"filename": file.filename}


@router.post("/{id}/register-apointment", response_model=schemas.Appointment)
def register_appointment(
    id: int,
    appointment_in: schemas.AppointmentCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_FOUR)
    try:
        appointment = crud.appointment.create(
            db=db, study_id=study.id, obj_in=appointment_in)
    except StudyAlreadyWithAppointment:
        raise HTTPException(
            status_code=400,
            detail="El estudio ya registra un turno",
        )
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_FIVE, employee_id=current_user.id)
    return appointment


@router.post("/{id}/register-sample", response_model=schemas.Sample)
def register_sample(
    id: int,
    sample_in: schemas.SampleCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_FIVE)
    try:
        sample = crud.sample.create(db=db, study_id=id, obj_in=sample_in)
    except StudyAlreadyWithSample:
        raise HTTPException(
            status_code=400,
            detail="El estudio ya registra una muestra"
        )
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_SIX, employee_id=current_user.id)
    return sample


# @router.post("/{id}/test-batch-generation", response_model=schemas.Sample)
# def test-batch-generation(
#     id: int,
#     sample_in: schemas.SampleCreate,
#     current_user: models.User = Security(
#         deps.get_current_active_user,
#         scopes=[Role.EMPLOYEE["name"]]
#     ),
#     db: Session = Depends(deps.get_db)
# ) -> Any:
#     study = retrieve_study(db, id, expected_state=None)
#     try:
#         sample = crud.sample.create(db=db, study_id=id, obj_in=sample_in)
#     except StudyAlreadyWithSample:
#         raise HTTPException(
#             status_code=400,
#             detail="El estudio ya registra una muestra"
#         )
#     crud.study.update_state(
#         db=db, db_obj=study, new_state=StudyState.STATE_SEVEN, employee_id=current_user.id)
#     return sample



@router.post("/{id}/register-sample-pickup")
def register_sample_pickup(
    id: int,
    picked_up_by: str,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_SIX)
    try:
        sample = crud.sample.register_extractionist(
            db=db, db_obj=study.sample, picked_up_by=picked_up_by)
    except SampleAlreadyPickedUp:
        raise HTTPException(
            status_code=400, detail="La muestra ya fue recogida.")
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_SEVEN,
        employee_id=current_user.id, updated_date=sample.picked_up_date)
    # no informa si se creó un lote
    return {"El retiro de la muestra fue registrado"}


@router.post("/{id}/add-report", response_model=schemas.Report)
def add_report(
    id: int,
    report_in: schemas.ReportCreate,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.REPORTING_PHYSICIAN["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_NINE)
    report = crud.report.create(db=db, study_id=study.id, obj_in=report_in)
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_TEN,
        employee_id=current_user.id, updated_date=report.date_report)
    return report


@router.post("/{id}/send-report")
def send_report(
    id: int,
    email: str,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    study = retrieve_study(db, id, expected_state=StudyState.STATE_TEN)
    referring_physician = crud.referring_physician.get_by_email(
        db=db, email=email)
    if not referring_physician:
        raise HTTPException(
            status_code=400, detail="El email no corresponde a un médico derivante registrado.")
    # TODO: generar pdf y enviarlo al email ingresado
    report = study.report
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_ENDED,
        employee_id=current_user.id, updated_date=report.date_report)
    return {"El reporte fue enviado exitosamente."}


@router.get("/{id}/download-consent", response_class=Response)
def download_consent(
    id: int,
    current_user: models.User = Security(
        deps.get_current_active_user,
        scopes=[Role.EMPLOYEE["name"]]
    ),
    db: Session = Depends(deps.get_db)
) -> Any:
    # FIXME: deberia validar que esté en STATE_TWO o STATE_THREE
    study = retrieve_study(db, id, expected_state=None)
    pdf = HTML(string='<h3>Consentimiento para estudio X</h3><p>En caracter de ...</p>',
               encoding='UTF-8').write_pdf()
    crud.study.update_state(
        db=db, db_obj=study, new_state=StudyState.STATE_THREE, employee_id=current_user.id)
    return Response(content=pdf, media_type="application/pdf")


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
#         raise HTTPException(status_code=404, detail="No se encontró el estudio.")
#     study = crud.study.remove(db=db, id=id)
#     return study
