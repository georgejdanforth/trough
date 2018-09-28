import re
import functools

from flask import (
    json,
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
        return words[0] + ''.join(word.title() for word in words[1:])

class Responses:

    @staticmethod
    def ok():
        return Response(status=HTTPStatus.OK.value)

    @staticmethod
    def json_response(data, status_code=HTTPStatus.OK.value):
        response_json = json.dumps({
            StringConverters.snake_to_camel(key)
            if isinstance(key, str)
            else key: value
            for key, value in data.items()
        })

        return Response(
            response_json,
            status=status_code,
            mimetype='application/json'
        )

    @staticmethod
    def error(message, status_code):
        return Response(
            json.dumps({'error': message}),
            status=status_code,
            mimetype='application/json'
        )


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

