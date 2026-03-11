from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import StudyPlanner, Student

progress_tracker_blueprint = Blueprint("progress_tracker", __name__)


@progress_tracker_blueprint.route("/api/progress_tracker", methods=["GET"])
@jwt_required()
def track_progress():

    user_id = get_jwt_identity()

    student = Student.query.filter_by(user_id=user_id).first()

    goals = StudyPlanner.query.filter_by(student_id=student.id).all()

    total_goals = len(goals)
    completed_goals = len([g for g in goals if g.completed])
    remaining_goals = total_goals - completed_goals

    completion_rate = round((completed_goals / total_goals) * 100, 2) if total_goals else 0

    total_hours = sum(g.estimated_hours for g in goals)
    completed_hours = sum(g.estimated_hours for g in goals if g.completed)
    remaining_hours = total_hours - completed_hours

    efficiency_score = round((completed_hours / total_hours) * 100, 2) if total_hours else 0

    recommendations = []

    if completion_rate < 30:
        recommendations.append("You are behind schedule. Increase daily study time.")

    if completion_rate >= 30 and completion_rate < 70:
        recommendations.append("Your progress is moderate. Stay consistent.")

    if completion_rate >= 70:
        recommendations.append("Excellent progress. Keep it up!")

    high_priority_remaining = [
        g for g in goals if g.priority == "High" and not g.completed
    ]

    if high_priority_remaining:
        recommendations.append("Complete high priority topics first.")

    if efficiency_score < 50:
        recommendations.append("Your study efficiency is low. Try focused study sessions.")

    return jsonify({
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "remaining_goals": remaining_goals,
        "completion_rate": completion_rate,
        "total_hours": total_hours,
        "completed_hours": completed_hours,
        "remaining_hours": remaining_hours,
        "efficiency_score": efficiency_score,
        "recommendations": recommendations
    })