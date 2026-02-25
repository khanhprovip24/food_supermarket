from django.middleware.csrf import CsrfViewMiddleware

class CustomCsrfMiddleware(CsrfViewMiddleware):
    """
    Custom CSRF middleware that exempts /api/ endpoints from CSRF protection
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Completely exempt /api/ paths from CSRF protection
        if request.path.startswith('/api/'):
            request._dont_enforce_csrf_checks = True
        return super().process_view(request, view_func, view_args, view_kwargs)
