from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.models import db, Student, Mark, Attendance
from sqlalchemy import cast, Integer
student_analytics_blueprint = Blueprint("student_analytics", __name__)

@student_analytics_blueprint.route("/api/student_analytics/<roll_number>", methods=["GET"])
@jwt_required()
def get_student_analytics(roll_number):
    
    claims = get_jwt()
    role = claims["role"]

    if role == "student":
        # later we can restrict to their own roll_number
        pass
    student = Student.query.filter_by(roll_number=roll_number).first()
    if student is None:
        return jsonify({"msg": "Student not found"}), 404

    semester = request.args.get("semester")
    if semester is not None:
        semester = str(semester)
    if semester:
        marks = Mark.query.filter_by(
            roll_number=roll_number,
            semester=semester
        ).all()
    
        attendance = Attendance.query.filter_by(
            roll_number=roll_number,
            semester=semester
        ).all()
    else:
        marks = Mark.query.filter_by(roll_number=roll_number).all()
        attendance = Attendance.query.filter_by(roll_number=roll_number).all()

    academic_percentage = round(
        sum(mark.semester_marks for mark in marks) / len(marks), 2
    )if marks else 0
        
    attendance_percentage = (
        sum(attendance_record.attendance_percentage for attendance_record in attendance) / len(attendance)
        if attendance else 0
    )
    cgpa = round(academic_percentage / 10, 2)
    semester_cgpa = {}

    all_marks = Mark.query.filter_by(roll_number=roll_number).all()

    for mark in all_marks:
        sem = mark.semester
        semester_cgpa.setdefault(sem, []).append(mark.semester_marks)

    cgpa_trend = []

    for sem, marks_list in semester_cgpa.items():
        avg = sum(marks_list) / len(marks_list)
        cgpa_trend.append({
            "semester": sem,
            "cgpa": round(avg / 10, 2)
        })

    cgpa_trend = sorted(cgpa_trend, key=lambda x: x["semester"])
    
    if not marks and not attendance:
        risk_status = "No Data"
        recommendations = []
    else:
        risk_status = "High Risk" if academic_percentage < 60 or attendance_percentage < 75 else "Safe"

        recommendations = []
        if academic_percentage < 60:
            recommendations.extend(["Increase study hours", "Focus on weak subjects"])
        if attendance_percentage < 75:
            recommendations.extend(["Increase class attendance"])
        if risk_status == "High Risk":
            recommendations.append("Meet faculty mentor")

    return jsonify({
        "student_info": {
            "roll_number": student.roll_number,
            "name": student.name,
            "email": student.email,
            "department": student.department
        },
        "academic_percentage": academic_percentage,
        "attendance_percentage": attendance_percentage,
        "cgpa": cgpa,
        "cgpa_trend": cgpa_trend,
        "risk_status": risk_status,
        "recommendations": recommendations,
        "marks": [
            {
                "subject_id": mark.subject_id,
                "internal_1": mark.internal_1,
                "internal_2": mark.internal_2,
                "semester_marks": mark.semester_marks
            }
            for mark in marks
        ],
        "attendance": [
            {
                "semester": attendance_record.semester,
                "attendance_percentage": attendance_record.attendance_percentage
            }
            for attendance_record in attendance
        ]
    })
