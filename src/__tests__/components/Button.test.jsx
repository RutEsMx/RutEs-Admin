/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonStep from "@/components/Button";
import "@testing-library/jest-dom";

// Mock de heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  PlusIcon: () => <svg data-testid="plus-icon" />,
  MinusIcon: () => <svg data-testid="minus-icon" />,
}));

describe("ButtonStep", () => {
  describe("Renderizado básico", () => {
    test("debe renderizar el botón con children", () => {
      render(<ButtonStep>Click me</ButtonStep>);
      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    test("debe renderizar sin children", () => {
      render(<ButtonStep />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Variantes de color", () => {
    test("debe aplicar clase bg-primary por defecto", () => {
      render(<ButtonStep>Primary</ButtonStep>);
      expect(screen.getByRole("button").className).toContain("bg-primary");
    });

    test("debe aplicar clase bg-muted cuando se especifica bg-light-gray", () => {
      render(<ButtonStep color="bg-light-gray">Gray</ButtonStep>);
      expect(screen.getByRole("button").className).toContain("bg-muted");
    });
  });

  describe("Iconos", () => {
    test("debe renderizar icono plus", () => {
      render(<ButtonStep icon="plus">Add</ButtonStep>);
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    test("debe renderizar icono minus", () => {
      render(<ButtonStep icon="minus">Remove</ButtonStep>);
      expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    });

    test("no debe renderizar icono si no se especifica", () => {
      render(<ButtonStep>No Icon</ButtonStep>);
      expect(screen.queryByTestId("plus-icon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("minus-icon")).not.toBeInTheDocument();
    });
  });

  describe("Eventos", () => {
    test("debe llamar onClick al hacer click", () => {
      const handleClick = jest.fn();
      render(<ButtonStep onClick={handleClick}>Click me</ButtonStep>);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("debe estar deshabilitado cuando disabled es true", () => {
      render(<ButtonStep disabled>Disabled</ButtonStep>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Atributos adicionales", () => {
    test('debe aceptar type="submit"', () => {
      render(<ButtonStep type="submit">Submit</ButtonStep>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    test('debe aceptar type="button"', () => {
      render(<ButtonStep type="button">Button</ButtonStep>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });
});
