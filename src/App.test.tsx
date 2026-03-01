import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";

function TestWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe("App", () => {
  it("renders the landing page with eMuse heading", () => {
    render(<TestWrapper />);
    expect(screen.getByText("eMuse")).toBeInTheDocument();
  });

  it("renders all six mood tiles", () => {
    render(<TestWrapper />);
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
    render(<TestWrapper />);
    expect(screen.getByText(/surprise me/i)).toBeInTheDocument();
  });
});
