from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base  # noqa: F401
from app.constants.role import Role

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    user = crud.admin.get_by_username(db, username=settings.ADMIN_USERNAME)
    if not user:
        user_in = schemas.AdminCreate(
            username=settings.ADMIN_USERNAME,
            password=settings.ADMIN_PASSWORD,
            first_name='admin',
            last_name='admin'
        )

        user = crud.admin.create(db, obj_in=user_in)  # noqa: F841
    
    # Cargar data inicial ...
    
    
    
    # Create Roles If They Doesn't Exist
    guest_role = crud.role.get_by_name(db, name=Role.GUEST["name"])
    if not guest_role:
        guest_role_in = schemas.RoleCreate(
            name=Role.GUEST["name"], description=Role.GUEST["description"]
        )
        crud.role.create(db, obj_in=guest_role_in)
    admin_role = crud.role.get_by_name(db, name=Role.ADMIN["name"])
    if not admin_role:
        admin_role_in = schemas.RoleCreate(
            name=Role.ADMIN["name"], description=Role.ADMIN["description"]
        )
        crud.role.create(db, obj_in=admin_role_in)
    configurator_role = crud.role.get_by_name(db, name=Role.CONFIGURATOR["name"])
    if not configurator_role:
        configurator_role_in = schemas.RoleCreate(
            name=Role.CONFIGURATOR["name"], description=Role.CONFIGURATOR["description"]
        )
        crud.role.create(db, obj_in=configurator_role_in)
    employee_role = crud.role.get_by_name(db, name=Role.EMPLOYEE["name"])
    if not employee_role:
        employee_role_in = schemas.RoleCreate(
            name=Role.EMPLOYEE["name"], description=Role.EMPLOYEE["description"]
        )
        crud.role.create(db, obj_in=employee_role_in)
    reporting_physician_role = crud.role.get_by_name(db, name=Role.REPORTING_PHYSICIAN["name"])
    if not reporting_physician_role:
        reporting_physician_role_in = schemas.RoleCreate(
            name=Role.REPORTING_PHYSICIAN["name"], description=Role.REPORTING_PHYSICIAN["description"]
        )
        crud.role.create(db, obj_in=reporting_physician_role_in)
    patient_physician_role = crud.role.get_by_name(db, name=Role.PATIENT["name"])
    if not patient_physician_role:
        patient_physician_role_in = schemas.RoleCreate(
            name=Role.PATIENT["name"], description=Role.PATIENT["description"]
        )
        crud.role.create(db, obj_in=patient_physician_role_in)
