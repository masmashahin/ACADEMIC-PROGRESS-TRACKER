from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
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
    
    subject = data.get("subject")
    topic = data.get("topic")
    estimated_hours = data.get("estimated_hours")
    deadline = data.get("deadline")
    priority = data.get("priority")
    if not subject or not topic or not estimated_hours or not priority:
        return jsonify({"msg": "All fields are required"}), 400

    user_id = get_jwt_identity() 
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404
    # Check duplicate
    existing_plan = StudyPlanner.query.filter_by(
        student_id=student.id,
        subject=subject,
        topic=topic
    ).first()

    if existing_plan:
        return jsonify({"msg": "This topic already exists for this subject"}), 400
    
    plan = StudyPlanner(
        student_id=student.id,
        subject=subject,
        topic=topic,
        estimated_hours=estimated_hours,
        deadline=deadline,
        priority=priority,
        completed=False
    )

    db.session.add(plan)
    db.session.commit()

    return jsonify({"msg": "Study plan created successfully"}), 201

@study_planner_blueprint.route("/api/study_planner", methods=["GET"])
@jwt_required()
def get_study_plans():

    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    plans = StudyPlanner.query.filter_by(student_id=student.id).all()

    return jsonify([
        {
            "id": plan.id,
            "subject": plan.subject,
            "topic": plan.topic,
            "estimated_hours": plan.estimated_hours,
            "deadline": plan.deadline,
            "priority": plan.priority,
            "completed": plan.completed
        }
        for plan in plans
    ])

@study_planner_blueprint.route("/api/study_planner/<int:plan_id>", methods=["PUT"])
@jwt_required()
def update_study_plan(plan_id):

    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    plan = StudyPlanner.query.filter_by(id=plan_id, student_id=student.id).first()

    if not plan:
        return jsonify({"msg": "Study plan not found"}), 404

    data = request.get_json()

    plan.subject = data.get("subject", plan.subject)
    plan.topic = data.get("topic", plan.topic)
    plan.estimated_hours = data.get("estimated_hours", plan.estimated_hours)
    plan.deadline = data.get("deadline", plan.deadline)
    plan.priority = data.get("priority", plan.priority)
    plan.completed = data.get("completed", plan.completed)

    db.session.commit()

    return jsonify({"msg": "Study plan updated successfully"})

@study_planner_blueprint.route("/api/study_planner/<int:plan_id>", methods=["DELETE"])
@jwt_required()
def delete_study_plan(plan_id):

    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    plan = StudyPlanner.query.filter_by(id=plan_id, student_id=student.id).first()

    if not plan:
        return jsonify({"msg": "Study plan not found"}), 404

    db.session.delete(plan)
    db.session.commit()

    return jsonify({"msg": "Study plan deleted successfully"})

