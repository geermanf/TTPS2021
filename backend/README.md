### Pasos (Completar)

Primero crear en la carpeta raiz del proyecto el archivo .env con al menos estos valores:

```
PROJECT_NAME=ttps-grupo8

SERVER_HOST=http://localhost
FIRST_SUPERUSER=admin@mylab.com
FIRST_SUPERUSER_PASSWORD=changeme

# Postgres
POSTGRES_SERVER=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=ttps-grupo8

# PgAdmin
PGADMIN_DEFAULT_EMAIL=pgadmin4@pgadmin.org
PGADMIN_DEFAULT_PASSWORD=changeme
PGADMIN_CONFIG_SERVER_MODE=False
```


Abrir una terminal en la misma ruta y ejecutar:

```
docker-compose up -d
```

Luego:

```
docker-compose backend bash
```

dentro del contenedor:

```
./startup.sh
```

Por último, acceder a:

```
http://localhost:8000/docs
```

## Sección para desarrolladores del backend

### Migrations

Make sure you create a "revision" of your models and that you "upgrade" your database with that revision every time you change them. As this is what will update the tables in the database. Otherwise, the application will have errors.

* As an example, if you created a new model in `./backend/app/models/`, make sure to import it in `./backend/app/db/base.py`, that Python module (`base.py`) that imports all the models will be used by Alembic.

* After changing a model (for example, adding a column), inside the container, create a revision, e.g.:

```console
$ alembic revision --autogenerate -m "Add column last_name to User model"
```

* Commit to the git repository the files generated in the alembic directory.

* After creating the revision, run the migration in the database (this is what will actually change the database):

```console
$ alembic upgrade head
```
