# Leaderboard Streak Update Plan

## Overview
Right now the streak is calculated in the backend when we run the data collection script. The frontend just reads the `currentStreak` from the JSON file.

We are not calculating streaks dynamically on the frontend because that would be slow and unnecessary.

---

## How Streak Data is Generated
- The script `collectData.py` runs and collects data from GitHub
- It calls `format_json_data`
- Inside that, we calculate streak using `calculate_current_streak`
- The result is stored in:
  ```json
  currentStreak
  ```
- This gets saved in `lifetime_data.json`

---

## How Streak Data is Updated
We will update streak data using a scheduled workflow.

### Plan
- Run the data collection workflow once a week
- This will:
  - pull latest GitHub data
  - recalculate streaks
  - update the JSON file

This matches the streak logic since it is based on weekly activity.

## Why Not Real-Time Calculation
We are not doing this dynamically because:
- it would require recalculating streaks for all users every time the dashboard loads
- this would be slow for large organizations
- unnecessary since streaks only change weekly

## Future Improvements
- Move threshold (currently 1 issue/week) into config
- Allow different streak types (PR-based, commit-based, etc.)
- Add API instead of static JSON for more flexibility

## Summary
Streaks are calculated in the backend and updated on a schedule.
The frontend only displays the values and does not perform any heavy computation.