import os
from pathlib import Path
from typing import Optional
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def _load_env_file(file_path: Path) -> None:
    if not file_path.exists():
        return

    for raw_line in file_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()

        if (
            len(value) >= 2
            and value[0] == value[-1]
            and value[0] in {"'", '"'}
        ):
            value = value[1:-1]

        os.environ.setdefault(key, value)


# Local development convenience: automatically read .env.local/.env when present.
PROJECT_ROOT = BASE_DIR.parent
_load_env_file(PROJECT_ROOT / ".env.local")
_load_env_file(PROJECT_ROOT / ".env")


def _get_env_bool(key: str, default: bool = False) -> bool:
    raw = os.getenv(key)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "t", "yes", "y", "on"}


def _get_env_list(key: str, default=None):
    raw = os.getenv(key)
    if raw is None:
        return list(default or [])
    values = [item.strip() for item in raw.split(",")]
    return [item for item in values if item]


def _get_required_env(primary_key: str, legacy_key: Optional[str] = None) -> str:
    value = os.getenv(primary_key)
    if value:
        return value

    if legacy_key:
        legacy = os.getenv(legacy_key)
        if legacy:
            return legacy

    raise ImproperlyConfigured(
        f"Required environment variable is missing: {primary_key}"
        + (f" (or legacy {legacy_key})" if legacy_key else "")
    )


SECRET_KEY = _get_required_env("DJANGO_SECRET_KEY")
DEBUG = _get_env_bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = _get_env_list("DJANGO_ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'teacher_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': _get_required_env('DJANGO_DB_NAME', legacy_key='DB_NAME'),
        'USER': _get_required_env('DJANGO_DB_USER', legacy_key='DB_USER'),
        'PASSWORD': _get_required_env('DJANGO_DB_PASSWORD', legacy_key='DB_PASSWORD'),
        'HOST': _get_required_env('DJANGO_DB_HOST', legacy_key='DB_HOST'),
        'PORT': _get_required_env('DJANGO_DB_PORT', legacy_key='DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

# Media Files (Uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Settings
CORS_ALLOWED_ORIGINS = _get_env_list("DJANGO_CORS_ALLOWED_ORIGINS", default=[])
