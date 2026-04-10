from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models.models import db, StudyPlanner, Student
from datetime import datetime
from models.models import StudySession
from sqlalchemy.exc import IntegrityError
study_planner_blueprint = Blueprint("study_planner", __name__)

def calculate_efficiency(start, end, break_duration):
    total = (end - start).total_seconds() / 3600

    if total <= 0:
        return 0, 0

    if break_duration > total:
        return 0, 0  # don't return jsonify here

    study_time = total - break_duration
    efficiency = (study_time / total) * 100

    return study_time, efficiency

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

@study_planner_blueprint.route("/api/study_planner/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_task(id):

    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    task = StudyPlanner.query.filter_by(id=id, student_id=student.id).first()

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    try:
        # Detach linked sessions before deleting the goal to avoid FK constraint errors.
        StudySession.query.filter_by(goal_id=task.id, student_id=student.id).update(
            {"goal_id": None},
            synchronize_session=False
        )

        db.session.delete(task)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Unable to delete task due to linked records"}), 409
    except Exception:
        db.session.rollback()
        return jsonify({"msg": "Failed to delete task"}), 500

    return jsonify({"msg": "Deleted successfully"}), 200


@study_planner_blueprint.route("/api/study_session", methods=["POST"])
@jwt_required()
def add_study_session():

    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"msg": "Student not found"}), 404

    data = request.get_json()
    if not data.get("start_time") or not data.get("end_time"):
        return jsonify({"msg": "Start time and end time required"}), 400

    start = datetime.fromisoformat(data["start_time"].replace("Z",""))
    end = datetime.fromisoformat(data["end_time"].replace("Z",""))

    if end <= start:
        return jsonify({"msg": "End time must be after start time"}), 400

    break_type = data.get("break_type")
    try:
        break_duration = float(data.get("break_duration", 0))
    except:
        break_duration = 0

    # RULE: sleep max 8 hrs
    if break_type == "sleep" and break_duration > 8:
        return jsonify({"msg": "Sleep break cannot exceed 8 hours"}), 400
    
    total_hours = (end - start).total_seconds() / 3600
    if break_duration > total_hours:
        return jsonify({"msg": "Break cannot exceed total session time"}), 400

    study_time, efficiency = calculate_efficiency(start, end, break_duration)

    session = StudySession(
        student_id=student.id,
        goal_id=data.get("goal_id"),
        start_time=start,
        end_time=end,
        break_type=break_type,
        break_duration=break_duration,
        study_duration=study_time,
        efficiency=efficiency
    )

    db.session.add(session)
    db.session.commit()

    return jsonify({
        "msg": "Session saved",
        "efficiency": round(efficiency, 2)
    })
