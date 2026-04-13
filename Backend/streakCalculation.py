from datetime import datetime, timedelta

ISSUE_THRESHOLD = 1

def get_week_start(date_obj):
    """
    Returns the Monday of the week for a given date
    """
    return (date_obj - timedelta(days=date_obj.weekday())).date()

def parse_closed_dates(closed_issue_dates):
    """
    Converts a list of date strings or datetime objects into datetime objects
    Skips invalid or empty values
    """
    parsed_dates = []

    for value in closed_issue_dates:
        if not value:
            continue

        if isinstance(value, datetime):
            parsed_dates.append(value)
            continue

        try:
            parsed_dates.append(datetime.fromisoformat(value.replace("Z", "+00:00")))
        except (ValueError, AttributeError):
            continue

    return parsed_dates

def group_issues_by_week(closed_issue_dates):
    """
    Counts how many issues were closed in each week
    Returns a dictionary like:
    {
        week_start_date: count
    }
    """
    weekly_counts = {}

    parsed_dates = parse_closed_dates(closed_issue_dates)

    for closed_date in parsed_dates:
        week_start = get_week_start(closed_date)
        weekly_counts[week_start] = weekly_counts.get(week_start, 0) + 1

    return weekly_counts

def calculate_current_streak(closed_issue_dates, threshold=ISSUE_THRESHOLD, reference_date=None):
    """
    Calculates the active streak based on weekly issue closure threshold

    A streak increases by 1 for every consecutive week where
    the number of closed issues meets or exceeds the threshold

    Args:
        closed_issue_dates: list of datetime objects or ISO date strings
        threshold: minimum number of issues closed in a week
        reference_date: optional datetime to use instead of current time

    Returns:
        int: current streak count
    """
    weekly_counts = group_issues_by_week(closed_issue_dates)

    if not weekly_counts:
        return 0
    
    if reference_date is None:
        current_week_start = max(weekly_counts.keys())
    else:
        current_week_start = get_week_start(reference_date)

    streak = 0
    
    while weekly_counts.get(current_week_start, 0) >= threshold:
        streak += 1
        current_week_start -= timedelta(days=7)

    return streak

def count_total_closed_issues(closed_issue_dates):
    """
    Returns the total number of valid closed issue dates
    """
    return len(parse_closed_dates(closed_issue_dates))