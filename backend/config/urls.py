from django.urls import include, path
from . import views

urlpatterns = [
    path("api/teacher/", include("teacher_api.urls")),
    path("api/student/today-tasks", views.student_today_tasks, name="student_today_tasks"),
    path("api/student/assignments", views.student_assignments, name="student_assignments"),
    path("api/student/submissions", views.student_submissions, name="student_submissions"),
    path("api/student/reports/latest", views.student_latest_report, name="student_latest_report"),
    path("api/student/goals", views.student_patch_goals, name="student_patch_goals"),
    path("api/student/coach", views.student_coach, name="student_coach"),
]
