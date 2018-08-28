from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


bcrypt = Bcrypt()
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


extensions = {
    'bcrypt': bcrypt,
    'db': db,
    'jwt': jwt,
    'migrate': migrate
}
