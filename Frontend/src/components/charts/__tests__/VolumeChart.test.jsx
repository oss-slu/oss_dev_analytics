import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import VolumeCharts from "../VolumeBased";
import '@testing-library/jest-dom';
import { transformVolumeData } from "../../../utils/TransformVolumeData";
import test_data from "../../../../../Backend/test_data.json";

//JSDOM does not support canvas so we mock the bar component
vi.mock('react-chartjs-2', () => ({
    Bar: ({ data, options }) => (
        <div data-testid="mock-bar-chart">
            <span>{options.plugins.title.text}</span>
            <div>{JSON.stringify(data.labels)}</div>
        </div>
    ),
}));

describe("VolumeCharts Component", () => { //prints out if the test was successful in terminal
    test("displays correct data for Organization level", () => {
        const orgData = transformVolumeData(test_data, 'org', null, "All"); 
        render(<VolumeCharts data={orgData} repos="All" />);
        
        expect(screen.getByText("Organization Level Volume Data")).toBeInTheDocument();
        //Check if the labels are being passed to our mocked chart
        expect(screen.getByText(/Avg Issues Opened/)).toBeInTheDocument();
    });

    test("displays correct data for User level", () => {
        const userData = transformVolumeData(test_data, 'user', 'hcaballero2', 'oss_dev_analytics');
        render(<VolumeCharts data={userData} repos="oss_dev_analytics" />);
        
        expect(screen.getByText(/Repository Level Volume Data/)).toBeInTheDocument();
        expect(screen.getByText(/Issues Opened/)).toBeInTheDocument();
        expect(screen.getByText(/Commits/)).toBeInTheDocument();
    });
});