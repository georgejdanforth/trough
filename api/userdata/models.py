from api.extensions import (
    bcrypt,
    db
)
from api.models import BaseModel


class User(BaseModel):

    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True)
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(45))
    current_login_ip = db.Column(db.String(45))
    login_count = db.Column(db.Integer(), nullable=False, default=0)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.password = (
            bcrypt
            .generate_password_hash(self.password)
            .decode('utf-8')
        )
