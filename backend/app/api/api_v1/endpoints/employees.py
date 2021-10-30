from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

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
    current_user: models.Employee = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve employees.
    """
    employees = crud.employee.get_multi(db, skip=skip, limit=limit)
    return employees


@router.post("/", response_model=schemas.Employee)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.EmployeeCreate,
    current_user: models.Employee = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un empleado con el mismo nombre de usuario.",
        )
    user = crud.employee.create(db, obj_in=user_in)
    if settings.EMAILS_ENABLED and user_in.email:
        send_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
    return user


@router.post("/open", response_model=schemas.Employee)
def create_user_open(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(...),
    email: EmailStr = Body(...),
    first_name: str = Body(None),
    last_name: str = Body(None),
) -> Any:
    """
    Create new employee without the need to be logged in.
    """
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    employee = crud.employee.get_by_email(db, email=email)
    if employee:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un empleado con el mismo nombre de usuario.",
        )
    employee_in = schemas.EmployeeCreate(password=password, first_name=first_name, last_name=last_name)
    employee = crud.employee.create(db, obj_in=employee_in)
    return employee


@router.get("/{employee_id}", response_model=schemas.Employee)
def read_employee_by_id(
    employee_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    employee = crud.employee.get(db, id=employee_id)
    # if user == current_user:
    #     return user
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(
    *,
    db: Session = Depends(deps.get_db),
    employee_id: int,
    employee_in: schemas.EmployeeUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a employee.
    """
    employee = crud.employee.get(db, id=employee_id)
    if not employee:
        raise HTTPException(
            status_code=404,
            detail="The employee with this username does not exist in the system",
        )
    employee = crud.employee.update(db, db_obj=employee, obj_in=employee_in)
    return employee