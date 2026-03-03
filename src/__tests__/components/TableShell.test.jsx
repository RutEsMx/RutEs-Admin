/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import TableShell from "@/components/Table/TableShell";
import "@testing-library/jest-dom";

describe("TableShell", () => {
  test("renderiza logo, acciones a la derecha y children", () => {
    render(
      <TableShell rightActions={<div>Action</div>}>
        <div>Child content</div>
      </TableShell>,
    );

    // LogoLayout renders an img with alt 'Rutes'
    expect(screen.getByAltText("Rutes")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
