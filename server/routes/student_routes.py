from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import pandas as pd
from werkzeug.security import generate_password_hash
from models.models import db, Student, User

students_blueprint = Blueprint("students", __name__)

@students_blueprint.route("/api/students/upload_csv", methods=["POST"])
@jwt_required()
def upload_students_csv():
    claims = get_jwt()
    role = claims["role"]

    if role not in ["faculty", "admin"]:
        return jsonify({"msg": "Only faculty can upload CSV"}), 403
    user_id = get_jwt_identity()
    try:
        if 'file' not in request.files:
            return jsonify({"msg": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"msg": "No selected file"}), 400

        df = pd.read_csv(file)

        required_columns = ['roll_number', 'name', 'email', 'department']

        if not all(col in df.columns for col in required_columns):
            return jsonify({"msg": "Missing required columns"}), 400

        inserted = 0
        updated = 0

        for index, row in df.iterrows():

            student = Student.query.filter_by(
                roll_number=row["roll_number"]
            ).first()

            if student:
                student.name = row["name"]
                student.email = row["email"]
                student.department = row["department"]
                updated += 1

            else:
                # create login account
                new_user = User(
                    email=row["email"],
                    password=generate_password_hash(str(row["roll_number"])),
                    role="student"
                )

                db.session.add(new_user)
                db.session.flush()   # gets the new_user.id before commit

                # create student record
                new_student = Student(
                    roll_number=row["roll_number"],
                    name=row["name"],
                    email=row["email"],
                    department=row["department"],
                    user_id=new_user.id
                )

                db.session.add(new_student)

                inserted += 1

        db.session.commit()

        return jsonify({
            "message": "Upload completed",
            "inserted": inserted,
            "updated": updated
        }), 201

    except Exception as e:
        db.session.rollback()
        print("UPLOAD ERROR:", e) 
        return jsonify({"msg": str(e)}), 500

@students_blueprint.route("/api/students", methods=["GET"])
@jwt_required()
def get_students():
    students = Student.query.all()
    return jsonify([{
        'roll_number': student.roll_number,
        'name': student.name,
        'email': student.email,
        'department': student.department
    } for student in students])

@students_blueprint.route("/api/students/<roll_number>", methods=["GET"])
@jwt_required()
def get_student_by_roll_number(roll_number):
    student = Student.query.filter_by(roll_number=roll_number).first()
    if student is None:
        return jsonify({"msg": "Student not found"}), 404
    return jsonify({
        'roll_number': student.roll_number,
        'name': student.name,
        'email': student.email,
        'department': student.department
    })
