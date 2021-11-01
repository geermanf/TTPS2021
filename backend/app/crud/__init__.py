from .crud_user import admin, user, employee, patient, informant_physician
from .study import study
from .crud_referring_physician import referring_physician
from .crud_type_study import type_study

# For a new basic set of CRUD operations you could just do

# from .base import CRUDBase
# from app.models.item import Item
# from app.schemas.item import ItemCreate, ItemUpdate

# item = CRUDBase[Item, ItemCreate, ItemUpdate](Item)