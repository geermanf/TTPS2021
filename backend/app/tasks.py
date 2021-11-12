import sys
sys.path.append("/")
from app.db.session import SessionLocal
from app import crud, models, schemas
import logging
from time import sleep

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


print('-- Tareas diarias --')

print ("hello worRRRRRRRRRRAAAAld!")
print ("Welcome to python cron job")
try:
    db = SessionLocal()
    #Try to create session to check if DB is awake
    db.execute("SELECT 1")
except Exception as e:
        logger.error(e)
        raise e

# TODO:
# Anular estudios que no fueron pagados pasados 30 dias del inicio
# Cancelar turnos de estudios que pasaron 30 días del turno asignado

users = crud.user.get_multi(db=db)
for user in users:
    print(user.username)
