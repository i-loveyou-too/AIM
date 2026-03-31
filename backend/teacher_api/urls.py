from django.urls import path
from . import views

urlpatterns = [
    # 기본 조회 API
    path('students', views.teacher_students, name='teacher_students'),
    path('students/<int:student_id>', views.teacher_student_detail, name='teacher_student_detail'),
    path('classes', views.teacher_classes, name='teacher_classes'),
    path('classes/<int:class_group_id>', views.teacher_class_detail, name='teacher_class_detail'),
    path('today-lessons', views.teacher_today_lessons, name='teacher_today_lessons'),

    # 오버뷰 및 요약 API (프론트 경로와 동일)
    path('today-lessons/overview', views.teacher_today_lessons_overview, name='teacher_today_lessons_overview'),
    path('assignments/overview', views.teacher_assignments_overview, name='teacher_assignments_overview'),
    path('curriculum/overview', views.teacher_curriculum_overview, name='teacher_curriculum_overview'),
    path('reports/overview', views.teacher_reports_overview, name='teacher_reports_overview'),
    path('reports/students/<int:student_id>/detail', views.teacher_report_student_detail, name='teacher_report_student_detail'),
    path('settings/overview', views.teacher_settings_overview, name='teacher_settings_overview'),
    path('profile', views.teacher_profile, name='teacher_profile'),
]
