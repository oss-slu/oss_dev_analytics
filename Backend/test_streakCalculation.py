from datetime import datetime

from Backend.streakCalculation import (
    calculate_current_streak,
    group_issues_by_week,
    count_total_closed_issues
)

def test_calculate_current_streak_consecutive_weeks():
    closed_issue_dates = [
        "2026-04-01T10:00:00",
        "2026-04-02T11:00:00",
        "2026-04-03T12:00:00",
        "2026-03-24T10:00:00",
        "2026-03-25T11:00:00",
        "2026-03-26T12:00:00",
    ]

    reference_date = datetime(2026, 4, 3)
    streak = calculate_current_streak(closed_issue_dates, threshold=3, reference_date=reference_date)

    assert streak == 2

def test_calculate_current_streak_resets_when_week_missed():
    closed_issue_dates = [
        "2026-04-01T10:00:00",
        "2026-04-02T11:00:00",
        "2026-04-03T12:00:00",
        "2026-03-10T10:00:00",
        "2026-03-11T11:00:00",
        "2026-03-12T12:00:00",
    ]

    reference_date = datetime(2026, 4, 3)
    streak = calculate_current_streak(closed_issue_dates, threshold=3, reference_date=reference_date)

    assert streak == 1

def test_calculate_current_streak_returns_zero_for_no_data():
    closed_issue_dates = []

    reference_date = datetime(2026, 4, 3)
    streak = calculate_current_streak(closed_issue_dates, threshold=3, reference_date=reference_date)

    assert streak == 0


def test_group_issues_by_week_counts_correctly():
    closed_issue_dates = [
        "2026-04-01T10:00:00",
        "2026-04-02T11:00:00",
        "2026-04-08T12:00:00",
    ]

    weekly_counts = group_issues_by_week(closed_issue_dates)

    assert len(weekly_counts) == 2
    assert sum(weekly_counts.values()) == 3


def test_count_total_closed_issues_counts_valid_dates():
    closed_issue_dates = [
        "2026-04-01T10:00:00",
        "2026-04-02T11:00:00",
        None,
        "",
        "invalid-date"
    ]

    total_closed = count_total_closed_issues(closed_issue_dates)

    assert total_closed == 2