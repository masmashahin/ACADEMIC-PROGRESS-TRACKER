def detect_at_risk_students(students, academic_threshold, attendance_threshold):
    """
    Detects at-risk students based on academic and attendance percentages.

    Args:
        students (list): List of Student objects.
        academic_threshold (float): Academic percentage threshold.
        attendance_threshold (float): Attendance percentage threshold.

    Returns:
        list: List of tuples containing student roll number and risk level category.
    """
    risk_levels = []
    for student in students:
        academic_percentage = student.academic_percentage
        attendance_percentage = student.attendance_percentage
        if academic_percentage < academic_threshold or attendance_percentage < attendance_threshold:
            risk_level = 'High Risk' if academic_percentage < academic_threshold and attendance_percentage < attendance_threshold else 'Moderate Risk'
        else:
            risk_level = 'Safe'
        risk_levels.append((student.roll_number, risk_level))
    return risk_levels
