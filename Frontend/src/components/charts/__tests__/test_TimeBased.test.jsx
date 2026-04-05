import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest"; // to allow lint to run
import TimeBased from "../TimeBased";

describe("TimeBased chart", () => {
  test("renders chart title", () => {
    render(
      <TimeBased
        title="Organization Level Time-Based Data"
        data={[{ label: "Organization", value: 200 }]}
      />
    );

    expect(
      screen.getByText("Organization Level Time-Based Data")
    ).toBeInTheDocument();
  });
});