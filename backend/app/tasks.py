import sys
sys.path.append("/")
from sqlalchemy import and_
from app.constants.state import StudyState
from datetime import datetime, timedelta
from time import sleep
import logging
from app import crud
from app.models import Study, Appointment
from app.db.session import SessionLocal


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info('-- Tareas diarias --')

try:
    db = SessionLocal()
    # Try to create session to check if DB is awake
    db.execute("SELECT 1")
except Exception as e:
    logger.error(e)
    raise e


# 3 tareas:

# 1-Anular estudios que no fueron pagados pasados 30 dias del inicio

filter_before = datetime.today() - timedelta(days=30)
studies = db.query(Study).filter(
    and_(Study.current_state == StudyState.STATE_ONE,
         Study.created_date < filter_before)).all()
for study in studies:
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_ONE_ERROR)


# 2-Cancelar turnos de estudios que pasaron 30 días del turno asignado
# Pasar los estudios al estado anterior

studies = db.query(Study).join(Appointment).filter(
    and_(Study.current_state == StudyState.STATE_FOUR,
         Appointment.date_appointment < filter_before)).all()
for study in studies:
    crud.study.update_state(db=db, db_obj=study,
                            new_state=StudyState.STATE_THREE)
    crud.appointment.remove(db=db, id=study.appointment.id)


# 3-Buscar estudios con muestra retrasadas (90 dias) y marcarlas

filter_before = datetime.today() - timedelta(days=90)
studies = db.query(Study).filter(
    and_(Study.current_state == StudyState.STATE_FIVE,
         Study.current_state_entered_date < filter_before)).all()
for study in studies:
    crud.study.mark_delayed(db=db, db_obj=study)