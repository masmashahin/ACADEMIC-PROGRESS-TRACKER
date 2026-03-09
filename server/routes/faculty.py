from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.models import Student, Mark, Attendance

faculty_blueprint = Blueprint("faculty", __name__)

@faculty_blueprint.route("/api/faculty/overview", methods=["GET"])
@jwt_required()
def faculty_overview():
    claims = get_jwt()
    role = claims["role"]

    if role not in ["faculty", "admin"]:
        return jsonify({"msg": "Access denied"}), 403

    students = Student.query.all()

    total_students = len(students)

    total_academic = 0
    total_attendance = 0

    at_risk_students = []

    for student in students:

        marks = Mark.query.filter_by(roll_number=student.roll_number).all()
        attendance = Attendance.query.filter_by(roll_number=student.roll_number).all()

        academic_percentage = (
            sum(mark.semester_marks for mark in marks) / len(marks)
            if marks else 0
        )

        attendance_percentage = (
            sum(a.attendance_percentage for a in attendance) / len(attendance)
            if attendance else 0
        )

        total_academic += academic_percentage
        total_attendance += attendance_percentage

        if academic_percentage < 60 or attendance_percentage < 75:
            at_risk_students.append({
                "roll_number": student.roll_number,
                "name": student.name,
                "academic_percentage": academic_percentage,
                "attendance_percentage": attendance_percentage
            })

    avg_academic = total_academic / total_students if total_students else 0
    avg_attendance = total_attendance / total_students if total_students else 0

    return jsonify({
        "total_students": total_students,
        "average_academic_percentage": avg_academic,
        "average_attendance_percentage": avg_attendance,
        "at_risk_students": at_risk_students
    })