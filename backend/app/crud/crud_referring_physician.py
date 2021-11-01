from typing import Any, Dict, Optional, Union
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.schemas.referring_physician import ReferringPhysicianUpdate, ReferringPhysicianCreate
from app.models.referring_physician import ReferringPhysician



class CRUDReferringPhysician(CRUDBase[ReferringPhysician, ReferringPhysicianCreate, ReferringPhysicianUpdate]):

    def get_by_licence(self, db: Session, *, licence: int) -> Optional[ReferringPhysician]:
        return db.query(ReferringPhysician).filter(ReferringPhysician.licence == licence).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[ReferringPhysician]:
        return db.query(ReferringPhysician).filter(ReferringPhysician.email == email).first()

    def create(self, db: Session, *, obj_in: ReferringPhysicianCreate) -> ReferringPhysician:
        db_obj = ReferringPhysician(
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            licence=obj_in.licence,
            phone=obj_in.phone,
            email=obj_in.email,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
            self, db: Session, *, db_obj: ReferringPhysician, obj_in: Union[ReferringPhysicianUpdate, Dict[str, Any]]
    ) -> ReferringPhysician:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)


referring_physician = CRUDReferringPhysician(ReferringPhysician)
