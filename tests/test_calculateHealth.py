# test_calculateHealth.py

import pytest
from Backend.calculateHealth import calculate_health_scores

# Mock Data Functions
# These simulate different repository scenarios

def sample_data_single_metric():
    """
    Simulates a repo with basic data
    Used to test when only ONE metric is selected
    """
    return {
        "lrda_mobile": {
            "issues": {
                "user1": {
                    "total_issues_opened": 10,
                    "total_issues_closed": "10",
                    "average_time_to_close": 10
                }
            },
            "pull_requests": {},
            "commits": {
                "user1": {"total_commits": 100}
            }
        }
    }

def sample_data_multiple_metrics():
    """
    Simulates a repo with multiple contributors and metrics
    Used to test weighted calculation across multiple metrics
    """
    return {
        "oss_dev_analytics": {
            "issues": {
                "user1": {
                    "total_issues_opened": 20,
                    "total_issues_closed": "15",
                    "average_time_to_close": 20
                }
            },
            "pull_requests": {
                "user1": {"average_time_to_merge": 30}
            },
            "commits": {
                "user1": {"total_commits": 200},
                "user2": {"total_commits": 50}
            }
        }
    }

def sample_data_missing_values():
    """
    Simulates a repo with missing data
    Used to test how system handles empty inputs
    """
    return {
        "lrda_mobile": {
            "issues": {},
            "pull_requests": {},
            "commits": {}
        }
    }

# Test Cases
def test_single_metric():
    """
    Test Case 1:
    If repi has only one selected metric,
    system should still return a valid score
    """
    data = sample_data_single_metric()
    result = calculate_health_scores(data)

    # Checking repo exists in result
    assert "lrda_mobile" in result

    # Score should be valide (non-negative)
    assert result["lrda_mobile"]["final_score"] >= 0

def test_multiple_metrics():
    """
    Test Case 2:
    Repo with multiple metrics should compute correctly
    """
    data = sample_data_multiple_metrics()
    result = calculate_health_scores(data)

    # Checking repo exists
    assert "oss_dev_analytics" in result

    # Score should be valid
    assert result["oss_dev_analytics"]["final_score"] >= 0

def test_all_metrics():
    """
    Test Case 3:
    Ensure score stays withing valid range (0-100)
    """
    data = sample_data_multiple_metrics()
    result = calculate_health_scores(data)

    score = result["oss_dev_analytics"]["final_score"]

    # Score should not exceed 100
    assert score <= 100

def test_no_metrics_selected():
    """
    Test Case 4:
    If no metrics are selected for a repo,
    system should raise an error
    """
    data = {
        "unknown_repo": {
            "issues": {},
            "pull_requests": {},
            "commits": {}
        }
    }

    # Expect ValueError
    with pytest.raises(ValueError):
        calculate_health_scores(data)

def test_missing_values_handled():
    """
    Test Case 5:
    If data is missing, system should not crash
    """
    data = sample_data_missing_values()

    try:
        result = calculate_health_scores(data)

        # Should return a dictionary if handled correctly
        assert isinstance(result, dict)

    except ValueError:
        # Acceptable behavior if no valid data exists
        assert True