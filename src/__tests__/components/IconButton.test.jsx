/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IconButton from "@/components/ui/IconButton";
import "@testing-library/jest-dom";

describe("IconButton", () => {
  test("renderiza y muestra aria-label/title", () => {
    render(
      <IconButton ariaLabel="test-button" title="Test" variant="ghost">
        <svg data-testid="child-icon" />
      </IconButton>,
    );

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "test-button");
    expect(btn).toHaveAttribute("title", "Test");
    expect(screen.getByTestId("child-icon")).toBeInTheDocument();
  });

  test("onclick se ejecuta y disabled evita ejecución", () => {
    const handleClick = jest.fn();
    const { rerender } = render(
      <IconButton ariaLabel="do" onClick={handleClick}>
        <svg />
      </IconButton>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Disabled
    rerender(
      <IconButton ariaLabel="do" onClick={handleClick} disabled>
        <svg />
      </IconButton>,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
