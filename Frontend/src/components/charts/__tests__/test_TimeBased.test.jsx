import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest"; // to allow lint to run
import TimeBased from "../TimeBased";

describe("TimeBased chart", () => {
  test("renders chart title", () => {
    render(
      <TimeBased
        title="Org Average Time to Close"
        data={[{ label: "Organization", value: 200 }]}
      />
    );

    expect(
      screen.getByText("Org Average Time to Close")
    ).toBeInTheDocument();
  });
});