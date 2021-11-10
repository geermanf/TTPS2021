from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base  # noqa: F401

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    admin = crud.admin.get_by_username(db, username=settings.ADMIN_USERNAME)
    if not admin:
        admin_in = schemas.AdminCreate(
            username=settings.ADMIN_USERNAME,
            password=settings.ADMIN_PASSWORD,
            first_name='admin',
            last_name='admin'
        )
        admin = crud.admin.create(db, obj_in=admin_in)  # noqa: F841
    
    config = crud.config.get_by_username(db, username=settings.CONFIG_USERNAME)
    if not config:
        config_in = schemas.ConfigCreate(
            username=settings.CONFIG_USERNAME,
            password=settings.CONFIG_PASSWORD,
            first_name='config',
            last_name='config'
        )
        config = crud.config.create(db, obj_in=config_in)  # noqa: F841
    
    # Cargar data inicial ...
