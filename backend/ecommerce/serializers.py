from __future__ import annotations

from typing import Any, Dict
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import DetallePedido, Pedido, PerfilUsuario, Producto

User = get_user_model()


class RegistroClienteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'password2')

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email.')
        return value

    def validate(self, data: Dict):  # type: ignore
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Las contraseñas no coinciden.'})
        return data

    @transaction.atomic
    def create(self, validated_data: Dict):  # type: ignore
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        PerfilUsuario.objects.create(
            usuario=user,
            rol=PerfilUsuario.Rol.CLIENTE,
            nombre=user.get_full_name() or user.email,
        )
        return user


class RegistroTiendaSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)
    nombre_tienda = serializers.CharField(max_length=200)
    telefono = serializers.CharField(
        max_length=20, required=False, allow_blank=True, default=''
    )

    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'email',
            'password', 'password2', 'nombre_tienda', 'telefono',
        )

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email.')
        return value

    def validate(self, data: Dict):  # type: ignore
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Las contraseñas no coinciden.'})
        return data

    @transaction.atomic
    def create(self, validated_data: Dict):  # type: ignore
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        nombre_tienda = validated_data.pop('nombre_tienda')
        telefono = validated_data.pop('telefono', '')
        email = validated_data.pop('email')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        PerfilUsuario.objects.create(
            usuario=user,
            rol=PerfilUsuario.Rol.TIENDA,
            nombre=user.get_full_name() or user.email,
            nombre_tienda=nombre_tienda,
            telefono=telefono,
        )
        return user


def _build_user_dict(user):  # type: ignore[no-untyped-def]
    """Return a plain dict with user info + JWT tokens."""
    if user is None:
        raise ValueError("user cannot be None")
    
    refresh = RefreshToken.for_user(user)
    data = {
        'id': user.id,
        'email': user.email,
        'nombre': user.get_full_name() or user.email,
        'rol': 'cliente',
        'nombre_tienda': '',
        'telefono': '',
        'direccion': '',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
    try:
        perfil = user.perfil
        data['rol'] = perfil.rol
        data['nombre_tienda'] = perfil.nombre_tienda
        data['nombre'] = perfil.nombre or data['nombre']
        data['telefono'] = perfil.telefono
        data['direccion'] = perfil.direccion
    except PerfilUsuario.DoesNotExist:
        pass
    return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict):  # type: ignore
        data = super().validate(attrs)
        user = self.user
        if user is None:
            raise ValueError("user cannot be None")
        
        data['user'] = {
            'id': user.id,
            'email': user.email,
            'nombre': user.get_full_name() or user.email,
            'rol': 'cliente',
            'nombre_tienda': '',
            'telefono': '',
            'direccion': '',
        }
        try:
            perfil = user.perfil
            data['user']['rol'] = perfil.rol
            data['user']['nombre_tienda'] = perfil.nombre_tienda
            data['user']['nombre'] = perfil.nombre or data['user']['nombre']
            data['user']['telefono'] = perfil.telefono
            data['user']['direccion'] = perfil.direccion
        except PerfilUsuario.DoesNotExist:
            pass
        return data


class ProductoSerializer(serializers.ModelSerializer):
    tienda_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Producto
        fields = (
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'marca', 'categoria', 'imagen', 'activo', 'tienda', 'tienda_nombre',
        )
        read_only_fields = ('id', 'tienda', 'tienda_nombre')

    def get_tienda_nombre(self, obj) -> str:
        if obj.tienda:
            try:
                return obj.tienda.perfil.nombre_tienda or obj.tienda.get_full_name()
            except PerfilUsuario.DoesNotExist:
                return obj.tienda.get_full_name() or obj.tienda.email
        return ''

    def create(self, validated_data: "dict[str, Any]") -> "Producto":
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['tienda'] = request.user
        # If frontend omits this field in multipart requests, keep products visible in catalog.
        validated_data.setdefault('activo', True)
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Return media as relative path so frontend proxy resolves it correctly in Docker.
        data['imagen'] = instance.imagen.url if instance.imagen else None
        return data


class PedidoResumenSerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    factura_pdf_url = serializers.SerializerMethodField()
    envio = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = (
            'id',
            'fecha',
            'estado',
            'total',
            'items_count',
            'factura_pdf_url',
            'envio',
        )

    def get_items_count(self, obj: Pedido) -> int:
        # Reuse prefetched details when available; fallback to query for safety.
        detalles = getattr(obj, '_prefetched_objects_cache', {}).get('detalles')
        if detalles is not None:
            return sum(detalle.cantidad for detalle in detalles)
        return (
            DetallePedido.objects
            .filter(pedido=obj)
            .aggregate(total=Sum('cantidad'))
            .get('total')
            or 0
        )

    def get_factura_pdf_url(self, obj: Pedido) -> str | None:
        return obj.factura_pdf.url if obj.factura_pdf else None

    def get_envio(self, obj: Pedido) -> dict | None:
        envio = getattr(obj, 'envio', None)
        if envio is None:
            return None
        return {
            'estado': envio.estado,
            'direccion_entrega': envio.direccion_entrega,
            'numero_guia': envio.numero_guia,
            'fecha_entrega': envio.fecha_entrega.isoformat() if envio.fecha_entrega else None,
        }


class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ('nombre', 'telefono', 'direccion')


class PanelPedidoSerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    cliente_nombre = serializers.SerializerMethodField()
    cliente_email = serializers.SerializerMethodField()
    envio = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = (
            'id',
            'fecha',
            'estado',
            'total',
            'items_count',
            'cliente_nombre',
            'cliente_email',
            'envio',
        )

    def get_items_count(self, obj: Pedido) -> int:
        detalles = getattr(obj, '_prefetched_objects_cache', {}).get('detalles')
        if detalles is not None:
            return sum(detalle.cantidad for detalle in detalles)
        return (
            DetallePedido.objects
            .filter(pedido=obj)
            .aggregate(total=Sum('cantidad'))
            .get('total')
            or 0
        )

    def get_cliente_nombre(self, obj: Pedido) -> str:
        return obj.usuario.get_full_name() or obj.usuario.email

    def get_cliente_email(self, obj: Pedido) -> str:
        return obj.usuario.email

    def get_envio(self, obj: Pedido) -> dict | None:
        envio = getattr(obj, 'envio', None)
        if envio is None:
            return None
        return {
            'estado': envio.estado,
            'direccion_entrega': envio.direccion_entrega,
            'numero_guia': envio.numero_guia,
            'fecha_entrega': envio.fecha_entrega.isoformat() if envio.fecha_entrega else None,
        }
