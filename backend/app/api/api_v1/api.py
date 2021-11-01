from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    login, employees, patients,
    studies, health_insurances, utils
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(informant_doctors.router, prefix="/informant-doctors", tags=["informant-doctors"])
api_router.include_router(studies.router, prefix="/studies", tags=["studies"])
api_router.include_router(referring_physician.router, prefix="/referring-physician", tags=["Referring Physician"])
api_router.include_router(type_study.router, prefix="/type-study", tags=["Type Study"])
