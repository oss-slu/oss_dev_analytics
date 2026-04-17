# System Overview

## Project Overview
OSS Dev Analytics is a dashboard that helps open-source teams understand how their projects are doing. It takes raw GitHub data and turns it into useful metrics and insights so teams can identify issues, track progress, and improve how they work. The goal isn’t just to show numbers, but to also help tech leads understand what is going wrong and what they should do next.

## High-Level Architecture
The system has three main parts:
1. Data Collection (Backend)
2. Data Processing and Storage
3. Frontend Visualization

This reflects how the project is currently structured and how data moves through the system.

## Data Collection (Backend)
The backend uses Python scripts and the GitHub API to collect data from repositories. This includes commits, pull requests, and issues, which are then organized so they can be used for processing and analysis.

## Data Processing
After collecting the data, it is processed using Pandas. During this step:
- Activity is grouped into sprint-based time periods
- Metrics like velocity, lead time, and time to merge are calculated
- Data is cleaned and stored in JSON format

The main files used are:
- `lifetime_data.json`
- `sprint_data.json`

These files act as the connection between the backend and frontend.

## Leaderboard Streak System
The leaderboard streak feature is handled completely in the backend.

When the data collection script runs:
- GitHub data is collected and processed
- The `calculate_current_streak` function calculates each user’s streak based on weekly activity
- The result is stored as `currentStreak` in `lifetime_data.json`

The frontend does not calculate streaks and only displays the values.

### Why we did it this way
Streaks are not calculated in real time because:
- it would be slow to recalculate for all users on every page load
- streaks only change weekly

Instead, they are updated on a schedule when the data collection script runs. This keeps the dashboard efficient.

## Frontend (Visualization Layer)
The frontend is built using React and Vite. It takes the processed JSON data and displays it through charts and dashboards.

This allows users to:
- see team performance over time
- compare metrics
- identify trends

## Actionable Insights System
One of the main features of the system is the actionable insights feature. Instead of only showing metrics, the dashboard connects low-performing metrics to actions and resources that tech leads can use.

For example:
- If velocity is low → reduce scope or break down tasks
- If blocked work is high → identify dependencies and communicate with the team
- If defect rate is high → improve testing and prioritize bug fixes

These insights are based on feedback collected from tech leads.

### Mapping Metrics to Actions

A mapping matrix is used to connect each metric to:
- actions tech leads typically take
- helpful resources like documentation or communication tools

This allows the dashboard to suggest next steps instead of just showing problems.

### Mapping Matrix Implementation
The mapping is stored in a JSON file (`mapping_matrix.json`).

Each metric condition (like `velocity_low` or `defect_rate_high`) includes:
- a list of actions
- a list of resources

For example:
- `velocity_low` → reduce scope, break down tasks, remove blockers
- `blocked_work_high` → identify dependencies, escalate blockers, communicate with the team

This structure makes it easy to update or extend the system without changing core logic.

### Actionable Recommendations Layer
The system also includes a set of general recommendations based on repository metrics, outlined in the `ActionableSteps.md` file.

For each metric, the system:
- explains what the metric may indicate
- provides suggested actions
- includes general best practices

This helps users understand not just the data, but what they can do with it.

## Key Design Focus
Based on tech lead feedback, the system focuses on:
- showing trends over time instead of single data points
- identifying risks early
- keeping everything centralized
- making it easy to take action

## Summary

OSS Dev Analytics turns GitHub data into clear and useful insights. By combining backend processing, a frontend dashboard, and actionable recommendations, the system helps teams better understand their performance and improve their workflow. This document reflects the current architecture of the project and how the main features are implemented.