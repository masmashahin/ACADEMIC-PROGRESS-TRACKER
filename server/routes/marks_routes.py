from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd
from models.models import db, Mark

marks_blueprint = Blueprint("marks", __name__)

@marks_blueprint.route("/api/marks/upload_csv", methods=["POST"])
@jwt_required()
def upload_marks_csv():

    try:

        if 'file' not in request.files:
            return jsonify({"msg": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"msg": "No selected file"}), 400

        df = pd.read_csv(file)

        df["roll_number"] = df["roll_number"].astype(str)
        df["subject_id"] = df["subject_id"].astype(str)
        df["semester"] = df["semester"].astype(str)

        required_columns = [
            'roll_number',
            'subject_id',
            'semester',
            'internal_1',
            'internal_2',
            'semester_marks'
        ]

        if not all(col in df.columns for col in required_columns):
            return jsonify({"msg": "Missing required columns"}), 400


        inserted = 0
        updated = 0


        for index, row in df.iterrows():

            existing_mark = Mark.query.filter_by(
                roll_number=row["roll_number"],
                subject_id=row["subject_id"],
                semester=row["semester"]
            ).first()


            if existing_mark:

                existing_mark.internal_1 = row["internal_1"]
                existing_mark.internal_2 = row["internal_2"]
                existing_mark.semester_marks = row["semester_marks"]

                updated += 1


            else:

                new_mark = Mark(
                    roll_number=row["roll_number"],
                    subject_id=row["subject_id"],
                    semester=row["semester"],
                    internal_1=row["internal_1"],
                    internal_2=row["internal_2"],
                    semester_marks=row["semester_marks"]
                )

                db.session.add(new_mark)
                inserted += 1


        db.session.commit()


        return jsonify({
            "message": "Marks upload completed",
            "inserted": inserted,
            "updated": updated
        }), 201


    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500



@marks_blueprint.route("/api/marks/<roll_number>", methods=["GET"])
@jwt_required()
def get_marks_by_roll_number(roll_number):

    marks = Mark.query.filter_by(roll_number=roll_number).all()

    if not marks:
        return jsonify({"msg": "Marks not found"}), 404


    return jsonify([
        {
            "roll_number": mark.roll_number,
            "subject_id": mark.subject_id,
            "semester": mark.semester,
            "internal_1": mark.internal_1,
            "internal_2": mark.internal_2,
            "semester_marks": mark.semester_marks
        }
        for mark in marks
    ])
