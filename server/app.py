from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import os
import logging
from logging.config import dictConfig

from models.models import db, User
from routes.auth_routes import auth_blueprint
from routes.student_routes import students_blueprint
from routes.marks_routes import marks_blueprint
from routes.attendance_routes import attendance_blueprint
from routes.student_analytics import student_analytics_blueprint
from routes.faculty import faculty_blueprint
from routes.study_planner import study_planner_blueprint
from routes.progress_tracker import progress_tracker_blueprint
from utils import csv_parser

app = Flask(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or "sqlite:///local.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = "super-secret-key"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
            'formatter': 'default'
        }
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify({'status': 'ok'})

app.register_blueprint(auth_blueprint)
app.register_blueprint(students_blueprint)
app.register_blueprint(marks_blueprint)
app.register_blueprint(attendance_blueprint)
app.register_blueprint(student_analytics_blueprint)
app.register_blueprint(faculty_blueprint)
app.register_blueprint(study_planner_blueprint)
app.register_blueprint(progress_tracker_blueprint)

@app.route("/test")
def test():
    return {"message": "API working"}

@app.route("/")
def home():
    return {"message": "Academic Progress Tracker Backend Running"}
# create tables
with app.app_context():
    db.create_all()
if __name__ == '__main__':  
    app.run()

