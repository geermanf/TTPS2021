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

router = APIRouter()


@router.get("/", response_model=List[schemas.Employee])
def read_employees(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Retrieve employees.
    """
    employees = crud.employee.get_multi(db, skip=skip, limit=limit)
    return employees


@router.post("/", response_model=schemas.Employee)
def create_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_in: schemas.EmployeeCreate,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Create new employee.
    """
    try:
        employee = crud.employee.create(db, obj_in=employee_in)
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
    if settings.EMAILS_ENABLED and employee_in.email:
        send_new_account_email(
            email_to=employee_in.email, username=employee_in.username, password=employee_in.password
        )
    return employee


@router.get("/{employee_id}", response_model=schemas.Employee)
def read_employee_by_id(
    employee_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific employee by id.
    """
    employee = crud.employee.get(db, id=employee_id)
    if employee == current_user:
        return employee
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The employee doesn't have enough privileges"
        )
    return employee


@router.put("/{employee_id}", response_model=schemas.Employee) #TODO: validar que el username no corresponda a otro
def update_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_id: int,
    employee_in: schemas.EmployeeUpdate,
    current_user: models.User = Depends(deps.get_current_if_admin),
) -> Any:
    """
    Update an employee.
    """
    try:
        employee = crud.employee.update(db, db_obj=employee, obj_in=employee_in)
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
    return employee
