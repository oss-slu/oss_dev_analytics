
#Sprint 1: Jan 12 - Jan 26 2025
#Sprint 2: Jan 27 - Feb 9 2025
#Sprint 3: Feb 10 - Feb 23 2025
#Sprint 4: Feb 24 - Mar 9 2025
#Sprint 5: Mar 10 - Mar 23 2025
#Sprint 6: Mar 24 - Apr 6 2025
import pandas as pd


sprint_dates = {
    1: ("2025-01-12", "2025-01-26"),
    2: ("2025-01-27", "2025-02-09"),
    3: ("2025-02-10", "2025-02-23"),
    4: ("2025-02-24", "2025-03-09"),
    5: ("2025-03-10", "2025-03-23"),
    6: ("2025-03-24", "2025-04-06"),
}
def filter_data_by_sprint(data, sprint = -1): #default is -1 which means lifetime data
    """
    Returns filtered data based on sprint number
    Args:
        data(pd.DataFrame): DataFrame containing data (pull requests, issues, commits) to be filtered
        sprint(int): Sprint number to filter data. Default is -1 (lifetime data)
    Returns:
        pd.DataFrame: Filtered DataFrame based on sprint dates
    """
    if sprint == -1:
        return data #returns lifetime data
    if sprint not in sprint_dates:
        raise ValueError(f"Sprint {sprint} not found in sprint_dates")
    
    start_date, end_date = sprint_dates[sprint]
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)
    filtered_data = data[(data['created_at'] >= start_date) & (data['created_at'] <= end_date)]
    return filtered_data
