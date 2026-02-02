import { render, screen } from "@testing-library/react";
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