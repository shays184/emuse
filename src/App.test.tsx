import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the landing page with eMuse heading", () => {
    render(<App />);
    expect(screen.getByText("eMuse")).toBeInTheDocument();
  });

  it("renders all six mood tiles", () => {
    render(<App />);
    const moods = [
      "Happy",
      "Sad",
      "Calm",
      "Energetic",
      "Melancholy",
      "Romantic",
    ];
    moods.forEach((mood) => {
      expect(screen.getByText(mood)).toBeInTheDocument();
    });
  });

  it("renders the Surprise me button", () => {
    render(<App />);
    expect(screen.getByText(/surprise me/i)).toBeInTheDocument();
  });
});
