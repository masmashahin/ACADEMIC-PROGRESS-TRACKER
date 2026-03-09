from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from models.models import db, Attendance
import pandas as pd

attendance_blueprint = Blueprint("attendance", __name__, url_prefix='/api/attendance')

@attendance_blueprint.route('/upload_csv', methods=['POST'])
@jwt_required()
def upload_attendance_csv():

    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"msg": "Invalid file type"}), 400

    df = pd.read_csv(file)

    required_columns = ['roll_number', 'semester', 'attendance_percentage']

    if not all(column in df.columns for column in required_columns):
        return jsonify({"msg": "CSV missing required columns"}), 400

    inserted = 0
    skipped = 0

    for index, row in df.iterrows():

        attendance = Attendance(
            roll_number=row['roll_number'],
            semester=row['semester'],
            attendance_percentage=row['attendance_percentage']
        )

        try:
            db.session.add(attendance)
            db.session.commit()
            inserted += 1

        except IntegrityError:
            db.session.rollback()
            skipped += 1

    return jsonify({
        "message": "Upload completed",
        "inserted": inserted,
        "duplicates_skipped": skipped
    }), 200


@attendance_blueprint.route('/<roll_number>', methods=['GET'])
@jwt_required()
def get_attendance(roll_number):

    records = Attendance.query.filter_by(roll_number=roll_number).all()

    if not records:
        return jsonify({"msg": "Attendance not found"}), 404

    return jsonify([
        {
            "roll_number": record.roll_number,
            "semester": record.semester,
            "attendance_percentage": record.attendance_percentage
        }
        for record in records
    ])
