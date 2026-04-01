from django.urls import path

from . import views


urlpatterns = [
    path("csrf", views.auth_csrf, name="auth_csrf_no_slash"),
    path("csrf/", views.auth_csrf, name="auth_csrf"),
    path("login", views.auth_login, name="auth_login_no_slash"),
    path("login/", views.auth_login, name="auth_login"),
    path("logout", views.auth_logout, name="auth_logout_no_slash"),
    path("logout/", views.auth_logout, name="auth_logout"),
    path("me", views.auth_me, name="auth_me_no_slash"),
    path("me/", views.auth_me, name="auth_me"),
]
