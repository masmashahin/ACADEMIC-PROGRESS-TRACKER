from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import StudyPlanner, Student, StudySession
from datetime import datetime, timedelta, date

progress_tracker_blueprint = Blueprint("progress_tracker", __name__)


@progress_tracker_blueprint.route("/api/progress_tracker", methods=["GET"])
@jwt_required()
def track_progress():

    user_id = get_jwt_identity()

    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    goals = StudyPlanner.query.filter_by(student_id=student.id).all()

    # 🔹 BASIC METRICS
    total_goals = len(goals)
    completed_goals = len([g for g in goals if g.completed])
    remaining_goals = total_goals - completed_goals

    completion_rate = round((completed_goals / total_goals) * 100, 2) if total_goals else 0

    total_hours = sum(g.estimated_hours for g in goals)
    completed_hours = sum(g.estimated_hours for g in goals if g.completed)
    remaining_hours = total_hours - completed_hours

    # 🔹 SESSIONS
    sessions = StudySession.query.filter_by(student_id=student.id).all()

    # 🔹 TODAY STUDY
    today = datetime.utcnow().date()


    # 🔹 EFFICIENCY
    total_study = sum(s.study_duration for s in sessions if s.study_duration)
    total_break = sum(s.break_duration for s in sessions if s.break_duration)

    if (total_study + total_break) > 0:
        efficiency_score = round((total_study / (total_study + total_break)) * 100, 2)
    else:
        efficiency_score = 0

    # 🔹 RECOMMENDATIONS
    recommendations = []

    # 🔥 Study vs Goal
    if completed_hours < total_hours * 0.5:
        recommendations.append("You have completed less than 50% of your plan. Increase study time.")

    # 🔥 Efficiency-based
    if efficiency_score < 50:
        recommendations.append("You are spending too much time on breaks. Try focused sessions.")
    elif efficiency_score < 75:
        recommendations.append("Your efficiency is moderate. Try reducing distractions.")
    else:
        recommendations.append("Excellent focus. Keep it up!")

    # 🔥 Deadline urgency
    urgent_goals = [
        g for g in goals
        if g.deadline and (g.deadline - today).days <= 2 and not g.completed
    ]

    if urgent_goals:
        recommendations.append("Some goals are near deadline. Prioritize them immediately.")
    
    goal_progress = []

    for g in goals:

        if g.completed:
            continue

        # 🔹 daily target
        days_left = 1

        if g.deadline:
            try:
                days_left = max((g.deadline - today).days, 1)
            except:
                days_left = 1

        daily_target = round(g.estimated_hours / days_left, 2)

        start_of_today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_today = start_of_today + timedelta(days=1)

        # 🔹 today's study for THIS goal
        goal_sessions = [
            s for s in sessions
            if s.goal_id == g.id
            and s.start_time
            and start_of_today <= s.start_time < end_of_today
            
        ]
        print("SESSION COUNT:", len(goal_sessions))

        study_time = 0.0
        break_time = 0.0

        for s in goal_sessions:
            if s.study_duration:
                study_time += float(s.study_duration)   # ⚠️ NO /60
            if s.break_duration:
                break_time += float(s.break_duration)

        study_time = round(study_time, 4)
        break_time = round(break_time, 4)

        print("FINAL study_time (hours):", study_time)
        print("FINAL break_time (hours):", break_time)

        total_time = study_time + break_time

        if total_time > 0:
            efficiency = round((study_time / total_time) * 100, 2)
        else:
            efficiency = 0

        # 🔥 BONUS: completion ratio (total progress vs goal)
        completion_ratio = 0
        if g.estimated_hours > 0:
            completion_ratio = study_time / g.estimated_hours

        if g.deadline and today > g.deadline:
            if study_time >= g.estimated_hours:
                status = "Completed ✅"
            else:
                status = "Missed ❌"
        else:
        # 🔹 status
            if study_time < daily_target:
                status = "Behind"
            elif study_time > daily_target:
                status = "Ahead"
            else:
                status = "On Track"

        goal_progress.append({
            "subject": g.subject,
            "topic": g.topic,
            "daily_target": daily_target,
            "study_time": round(study_time, 4),
            "break_time": round(break_time, 4),
            "efficiency": efficiency,
            "status": status,
            "completion_ratio": round(completion_ratio, 2)   
        })
    return jsonify({
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "remaining_goals": remaining_goals,
        "completion_rate": completion_rate,
        "efficiency_score": efficiency_score,
        "recommendations": recommendations,
        "goal_progress": goal_progress
    })