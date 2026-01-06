
#Sprint 1: Jan 12 - Jan 26 2025
#Sprint 2: Jan 27 - Feb 9 2025
#Sprint 3: Feb 10 - Feb 23 2025
#Sprint 4: Feb 24 - Mar 9 2025
#Sprint 5: Mar 10 - Mar 23 2025
#Sprint 6: Mar 24 - Apr 6 2025
import pandas as pd
from github.Commit import Commit

sprint_dates = {
    1: ("2026-01-12", "2026-01-26"),
    2: ("2026-01-27", "2026-02-09"),
    3: ("2026-02-10", "2026-02-23"),
    4: ("2026-02-24", "2026-03-09"),
    5: ("2026-03-10", "2026-03-23"),
    6: ("2026-03-24", "2026-04-06"),
    7: ("2025-10-14", "2025-10-27")
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
    start_date = pd.to_datetime(start_date).tz_localize('UTC')
    end_date = pd.to_datetime(end_date).tz_localize('UTC')
    filtered_list = []
    for item in data:
        item_date = item.commit.author.date if isinstance(item, Commit) else item.created_at #since Commits don't have a .created_at must check
        if item_date < start_date:
            break 
        if start_date <= item_date <= end_date:
            filtered_list.append(item)
            
    return filtered_list
