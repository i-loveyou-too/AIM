from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update a development-only test teacher account safely."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="teacher", help="Login username")
        parser.add_argument("--password", default="teacher", help="Login password")
        parser.add_argument(
            "--group",
            default="teacher",
            help="Group name to attach (set empty string to skip)",
        )

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError(
                "This command is only available in DEBUG mode. "
                "Do not run it in production."
            )

        username = options["username"].strip()
        password = options["password"]
        group_name = options["group"].strip()

        if not username:
            self.stderr.write(self.style.ERROR("username is required"))
            return

        if not password:
            self.stderr.write(self.style.ERROR("password is required"))
            return

        user_model = get_user_model()
        username_field = user_model.USERNAME_FIELD

        user, created = user_model._default_manager.get_or_create(
            **{username_field: username}
        )

        # Login policy in this project allows teacher when is_staff=True
        # or when attached to 'teacher' group. We set both for robustness.
        user.is_active = True
        user.is_staff = True
        user.set_password(password)
        user.save()

        if group_name:
            group, _ = Group.objects.get_or_create(name=group_name)
            user.groups.add(group)

        action = "created" if created else "updated"
        groups = list(user.groups.values_list("name", flat=True))
        self.stdout.write(
            self.style.SUCCESS(
                f"{action}: username={user.get_username()} "
                f"is_active={user.is_active} is_staff={user.is_staff} "
                f"is_superuser={user.is_superuser} groups={groups}"
            )
        )

