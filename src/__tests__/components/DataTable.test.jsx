/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock columns provider so DataTable can render predictable headers
jest.mock("@/components/Table/columns", () => {
  return function ColumnSelected() {
    return [
      {
        header: () => "Col",
        accessorKey: "id",
        cell: () => "-",
      },
    ];
  };
});

import DataTable from "@/components/Table/DataTable";

describe("DataTable (sin datos)", () => {
  test("muestra mensaje cuando no hay datos", () => {
    const list = { rows: [] };
    render(<DataTable type="students" list={list} />);

    expect(screen.getByText(/No hay datos disponibles/i)).toBeInTheDocument();
  });
});
