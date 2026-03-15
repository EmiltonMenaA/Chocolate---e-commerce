from django.http import HttpRequest, JsonResponse


def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse(
        {
            'success': True,
            'data': {
                'status': 'ok',
                'framework': 'django',
                'version': '4.2.13',
            },
        },
        status=200,
    )
