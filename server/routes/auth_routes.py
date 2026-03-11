from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import db, User, Student

auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")


        if not all([email, password, role]):
            return jsonify({"msg": "Missing required fields"}), 400

        if User.query.filter_by(email=email).first() is not None:
            return jsonify({"msg": "User with same email already exists"}), 400

        password_hash = generate_password_hash(password)

        user = User(email=email, password=password_hash, role=role)
        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"msg": str(e)}), 500


@auth_blueprint.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not all([email, password]):
            return jsonify({"msg": "Missing required fields"}), 400

        user = User.query.filter_by(email=email).first()

        if user is None or not check_password_hash(user.password, password):
            return jsonify({"msg": "Bad username or password"}), 401

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role, "email": user.email}
        )

        roll_number = None

        if user.role == "student":
            student = Student.query.filter_by(user_id=user.id).first()
            if student:
                roll_number = student.roll_number

        return jsonify(
            access_token=access_token,
            role=user.role,
            roll_number=roll_number
        ), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500
