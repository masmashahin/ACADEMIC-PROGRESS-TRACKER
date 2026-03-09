from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.models import db, Student, ProgressTracker

progress_tracker_blueprint = Blueprint("progress_tracker", __name__)


# CREATE PROGRESS
@progress_tracker_blueprint.route("/api/progress_tracker", methods=["POST"])
@jwt_required()
def create_progress():

    data = request.get_json()

    student_id = data.get("student_id")
    planned_hours = data.get("planned_hours")
    completed_hours = data.get("completed_hours")
    if planned_hours == 0:
        completion_percentage = 0
    else:
        completion_percentage = (completed_hours / planned_hours) * 100

    student = Student.query.filter_by(id=student_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    progress = ProgressTracker(
        student_id=student_id,
        planned_hours=planned_hours,
        completed_hours=completed_hours,
        completion_percentage=completion_percentage
    )

    db.session.add(progress)
    db.session.commit()

    return jsonify({"msg": "Progress added successfully"}), 201


# GET PROGRESS
@progress_tracker_blueprint.route("/api/progress_tracker/<roll_number>", methods=["GET"])
@jwt_required()
def get_progress(roll_number):

    student = Student.query.filter_by(roll_number=roll_number).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    records = ProgressTracker.query.filter_by(student_id=student.id).all()

    result = []

    for record in records:

        if record.planned_hours == 0:
            completion_percentage = 0
        else:
            completion_percentage = (
                record.completed_hours / record.planned_hours
            ) * 100

        result.append({
            "planned_hours": record.planned_hours,
            "completed_hours": record.completed_hours,
            "completion_percentage": round(completion_percentage, 2)
        })

    return jsonify(result)