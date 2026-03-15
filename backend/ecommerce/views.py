from django.http import JsonResponse


def health(request):
	return JsonResponse({'status': 'ok', 'framework': 'django', 'version': '4.2.13'})
