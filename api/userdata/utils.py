import datetime

from flask_jwt_extended import decode_token

from api.extensions import (
    db,
    jwt
)


@jwt.user_identity_loader
def set_token_identity(user):
    return user.id


@jwt.user_claims_loader
def set_token_claims(user):
    return {
        'email': user.email,
        'username': user.username
    }


@jwt.token_in_blacklist_loader
def is_token_blacklisted(decrypted_token):
    return False
