import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MedTreat India homepage content", () => {
  render(<App />);
  expect(screen.getAllByAltText(/MedTreat India/i)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/Free Consultation/i).length).toBeGreaterThan(0);
});
