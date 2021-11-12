from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from weasyprint import HTML, CSS
from fastapi.responses import Response
from app import crud, schemas
from app.api import deps
from weasyprint.text.fonts import FontConfiguration
from app.constants.css import CSS as Css

router = APIRouter()


@router.get("/", response_model=List[schemas.TypeStudy])
def read_type_study(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
) -> Any:
    """
    Retrieve type study.
    """
    type_study = crud.type_study.get_multi(db, skip=skip, limit=limit)
    return type_study


@router.post("/", response_model=schemas.TypeStudy)
def create_type_study(
        *,
        db: Session = Depends(deps.get_db),
        type_study_in: schemas.TypeStudyCreate
) -> Any:
    """
    Create new type study.
    """
    type_study = crud.type_study.get_by_name(db, name=type_study_in.name)
    if type_study:
        raise HTTPException(
            status_code=400,
            detail="The type study with this name already exists in the system.",
        )
    type_study = crud.type_study.create(db, obj_in=type_study_in)
    print('CREADO', type_study)
    return type_study

@router.get("/{type_study_id}", response_model=schemas.TypeStudy)
def read_referring_physician_by_id(
        type_study_id: int,
        db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a type study by id.
    """
    type_study = crud.type_study.get(db, id=type_study_id)
    if not type_study:
        raise HTTPException(
            status_code=400,
            detail="The type study with this id does not exists in the system.",
        )
    return type_study


@router.put("/{type_study_id}", response_model=schemas.TypeStudy)
def update_type_study(
        *,
        db: Session = Depends(deps.get_db),
        type_study_id: int,
        type_study_in: schemas.TypeStudy,
) -> Any:
    """
    Update a type study.
    """
    type_study = crud.type_study.get(db, id=type_study_id)
    if not type_study:
        raise HTTPException(
            status_code=404,
            detail="The type study with this id does not exist in the system",
        )
    type_study = crud.type_study.update(db, db_obj=type_study, obj_in=type_study_in)
    return type_study


@router.get("/get-study-consent-template/{type_study_id}")
def generate_pdf(
        type_study_id: int,
        db: Session = Depends(deps.get_db),
) -> Any:
    """
      Return a pdf with consent template text.
    """
    font_config = FontConfiguration()
    type_study = crud.type_study.get(db, id=type_study_id)
    html = HTML(string=type_study.study_consent_template,
               encoding='UTF-8')
    css = CSS(string=Css.CSS, font_config=font_config)

    return Response(content=html.write_pdf(stylesheets=[css],
    font_config=font_config), media_type="application/pdf")
