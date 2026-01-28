import { render, screen } from "@testing-library/react";
import TimeBased from "../TimeBased";
import testData from "../../../../../Frontend/test_data.json";

describe("TimeBased Chart", () => {
    test("renders organization-wide chart", () => {
        render(
            <TimeBased
              rawData={testData}
              metric="avg_time_to_close"
              scope="org"
              title="Org Average Time to Close"
            />
        );

        expect(
            screen.getByText("Org Average Time to Close")
        ).toBeTruthy();
    });

    test("renders repo sprint-based chart", () => {
        render(
            <TimeBased
              rawData={testData}
              metric="avg_time_to_merge"
              scope="repo"
              sprintId="Sprint-1"
              title="Repo Sprint Metrics"
            />
        );

        expect(
            screen.getByText("Repo Sprint Metrics")
        ).toBeTruthy();
    });
});