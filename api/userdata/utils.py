import datetime

from flask_jwt_extended import decode_token
from sqlalchemy.orm.exc import NoResultFound

from api.extensions import (
    db,
    jwt
)
from api.userdata.models import JsonWebToken
from api.userdata.types import TokenType


class TokenNotFound(Exception):
    pass


@jwt.user_identity_loader
def set_token_identity(user):
    return user.id


@jwt.user_claims_loader
def set_token_claims(user):
    return {'email': user.email}


@jwt.token_in_blacklist_loader
def is_token_blacklisted(decoded_token):
    try:
        return (
            JsonWebToken
            .query
            .filter_by(jti=decoded_token['jti'])
            .one()
            .blacklisted
        )
    except NoResultFound:
        return True


def store_token(encoded_token):
    decoded_token = decode_token(encoded_token)
    token_type = {
        'access': TokenType.access_token.value,
        'refresh': TokenType.refresh_token.value
    }.get(decoded_token['type'])
    expires = datetime.datetime.utcfromtimestamp(decoded_token['exp'])

    token_object = JsonWebToken(
        jti=decoded_token['jti'],
        token_type=token_type,
        user_id=int(decoded_token['identity']),
        expires=expires
    )

    db.session.add(token_object)
    db.session.commit()


def blacklist_token(jti, user_id):
    try:
        token_object = (
            JsonWebToken
            .query
            .filter_by(jti=jti, user_id=user_id)
            .one()
        )
        token_object.blacklisted = True
        db.session.commit()
    except NoResultFound:
        raise TokenNotFound


def cleanup_expired_tokens():
    num_items_deleted = (
        JsonWebToken
        .query
        .filter(JsonWebToken.expires < datetime.datetime.utcnow())
        .delete()
    )
    db.session.commit()
    print(f'{num_items_deleted} tokens deleted.')
