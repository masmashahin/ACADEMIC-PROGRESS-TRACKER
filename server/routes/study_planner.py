from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.models import db, StudyPlanner, Student
study_planner_blueprint = Blueprint("study_planner", __name__)

@study_planner_blueprint.route("/api/study_planner", methods=["POST"])
@jwt_required()
def create_study_plan():

    claims = get_jwt()
    role = claims["role"]

    if role not in ["student", "admin"]:
        return jsonify({"msg": "Only students can access study planner"}), 403
    
    data = request.get_json()

    roll_number = data.get("roll_number")
    subject = data.get("subject")
    weekly_target_hours = data.get("weekly_target_hours")
    goal_marks = data.get("goal_marks")
    deadline = data.get("deadline")

    student = Student.query.filter_by(roll_number=roll_number).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404
    # Check duplicate
    existing_plan = StudyPlanner.query.filter_by(
        student_id=student.id,
        subject=subject
    ).first()

    if existing_plan:
        return jsonify({"msg": "Study plan already exists for this subject"}), 400
    
    plan = StudyPlanner(
        student_id=student.id,
        subject=subject,
        weekly_target=weekly_target_hours,
        goal_marks=goal_marks,
        deadline=deadline
    )

    db.session.add(plan)
    db.session.commit()

    return jsonify({"msg": "Study plan created successfully"}), 201

@study_planner_blueprint.route("/api/study_planner/<roll_number>", methods=["GET"])
@jwt_required()
def get_study_plans(roll_number):
    student = Student.query.filter_by(roll_number=roll_number).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    plans = StudyPlanner.query.filter_by(student_id=student.id).all()

    return jsonify([
        {
            "id": plan.id,
            "subject": plan.subject,
            "weekly_target_hours": plan.weekly_target,
            "goal_marks": plan.goal_marks,
            "deadline": plan.deadline
        }
        for plan in plans
    ])

@study_planner_blueprint.route("/api/study_planner/<id>", methods=["PUT"])
@jwt_required()
def update_study_plan(id):

    plan = StudyPlanner.query.get(id)

    if not plan:
        return jsonify({"msg": "Plan not found"}), 404

    data = request.get_json()

    plan.subject = data.get("subject", plan.subject)
    plan.weekly_target = data.get("weekly_target_hours", plan.weekly_target)
    plan.goal_marks = data.get("goal_marks", plan.goal_marks)
    plan.deadline = data.get("deadline", plan.deadline)

    db.session.commit()

    return jsonify({"msg": "Study plan updated successfully"})

@study_planner_blueprint.route("/api/study_planner/<id>", methods=["DELETE"])
@jwt_required()
def delete_study_plan(id):

    plan = StudyPlanner.query.get(id)

    if not plan:
        return jsonify({"msg": "Plan not found"}), 404

    db.session.delete(plan)
    db.session.commit()

    return jsonify({"msg": "Study plan deleted successfully"})


