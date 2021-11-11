from typing import Any, Dict, Optional, Union
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.schemas.referring_physician import ReferringPhysicianUpdate, ReferringPhysicianCreate
from app.models.referring_physician import ReferringPhysician



class CRUDReferringPhysician(CRUDBase[ReferringPhysician, ReferringPhysicianCreate, ReferringPhysicianUpdate]):

    def get_by_license(self, db: Session, license: int) -> Optional[ReferringPhysician]:
        return db.query(ReferringPhysician).filter(ReferringPhysician.license == license).first()

    def get_by_email(self, db: Session, email: str) -> Optional[ReferringPhysician]:
        return db.query(ReferringPhysician).filter(ReferringPhysician.email == email).first()

    def update(
            self, db: Session, db_obj: ReferringPhysician, obj_in: Union[ReferringPhysicianUpdate, Dict[str, Any]]
    ) -> ReferringPhysician:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)


referring_physician = CRUDReferringPhysician(ReferringPhysician)
