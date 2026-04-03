from pathlib import Path

from django.db import migrations


SQL = (Path(__file__).resolve().parents[3] / "database" / "09_min_teacher_access_schema.sql").read_text(
    encoding="utf-8"
)


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.RunSQL(SQL, reverse_sql=migrations.RunSQL.noop),
    ]
