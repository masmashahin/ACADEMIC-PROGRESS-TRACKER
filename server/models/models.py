from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    students = relationship('Student', backref='user', lazy='dynamic')

class Student(db.Model):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    roll_number = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    marks = relationship('Mark', backref='student', lazy='dynamic')
    attendance = relationship('Attendance', backref='student', lazy='dynamic')
    study_planner = relationship('StudyPlanner', backref='student', lazy='dynamic')
    progress_tracker = relationship('ProgressTracker', backref='student', lazy='dynamic')

class Mark(db.Model):
    __tablename__ = 'marks'
    id = Column(Integer, primary_key=True)
    roll_number = Column(String, ForeignKey('students.roll_number'), nullable=False)
    subject_id = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    internal_1 = Column(Integer, nullable=False)
    internal_2 = Column(Integer, nullable=False)
    semester_marks = Column(Integer, nullable=False)
    __table_args__ = (
    db.UniqueConstraint('roll_number', 'subject_id', 'semester'),
    )

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True)
    roll_number = Column(String, ForeignKey('students.roll_number'), nullable=False)
    semester = Column(String, nullable=False)
    attendance_percentage = Column(Integer, nullable=False)
    __table_args__ = (
    db.UniqueConstraint('roll_number', 'semester'),
    )

class StudyPlanner(db.Model):
    __tablename__ = 'study_planner'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    subject = Column(String, nullable=False)
    weekly_target = Column(Integer, nullable=False)
    goal_marks = Column(Integer, nullable=False)
    deadline = Column(DateTime, nullable=False)
    __table_args__ = (
    db.UniqueConstraint('student_id', 'subject', name='unique_student_subject'),
)

class ProgressTracker(db.Model):
    __tablename__ = 'progress_tracker'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    planned_hours = Column(Integer, nullable=False)
    completed_hours = Column(Integer, nullable=False)
    completion_percentage = Column(Integer, nullable=False)
