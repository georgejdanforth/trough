import re
import functools

from flask import (
    request,
    Response
)
from http import HTTPStatus


class StringConverters:

    @staticmethod
    def camel_to_snake(string):
        def _join(match):
            chunk = match.group()
            if len(chunk) > 1:
                return f'_{chunk[:-1]}_{chunk[-1]}'.lower()

            return f'_{chunk.lower()}'

        return (
            re.compile(r'([A-Z]+)(?=[a-z0-9])')
            .sub(_join, string)
            .lstrip('_')
        )

    @staticmethod
    def snake_to_camel(string):
        words = [word for word in re.split(r'_+', string) if word]
        return words[0] + ''.join(word.title() for word in words)

class Responses:

    @staticmethod
    def ok():
        return Response(status=HTTPStatus.OK.value)


def receives_json(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        request.json_data = {
            StringConverters.camel_to_snake(key)
            if isinstance(key, str)
            else key: value
            for key, value in request.get_json().items()
        }

        return func(*args, **kwargs)

    return wrapper

