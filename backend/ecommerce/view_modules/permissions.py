from rest_framework import permissions

from ..models import PerfilUsuario


class IsTienda(permissions.BasePermission):
    """Allows access only to users with rol=tienda or rol=admin."""

    def has_permission(self, request, view) -> bool:
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.perfil.rol in (
                PerfilUsuario.Rol.TIENDA,
                PerfilUsuario.Rol.ADMIN,
            )
        except PerfilUsuario.DoesNotExist:
            return False


class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level: only the product owner or admin can modify."""

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user.is_authenticated:
            return False
        try:
            rol = request.user.perfil.rol
        except PerfilUsuario.DoesNotExist:
            return False
        if rol == PerfilUsuario.Rol.ADMIN:
            return True
        return obj.tienda == request.user
