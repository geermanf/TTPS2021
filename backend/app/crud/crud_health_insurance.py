from sqlalchemy.orm import Session
from app.models import HealthInsurance
from app.schemas import HealthInsurance, HealthInsuranceCreate, HealthInsuranceInDB, HealthInsuranceUpdate


class CRUDStudy(CRUDBase[Study, StudyCreate, StudyUpdate]):
    # implementar
    pass

study = CRUDStudy(Study)