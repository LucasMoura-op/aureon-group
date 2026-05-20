"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/lib/utils";

type Transaction = {
  description: string;
  type: "Receita" | "Despesa" | "Dívida" | "Investimento";
  amount: number;
  dueDate: string;
  project: string;
};

const data: Transaction[] = [
  { description: "Aluguel studios", type: "Receita", amount: 15200, dueDate: "2026-06-05", project: "Studios Jardim Norte" },
  { description: "Medição estrutura", type: "Despesa", amount: -64000, dueDate: "2026-06-10", project: "Studios Jardim Norte" },
  { description: "Parcela financiamento", type: "Dívida", amount: -7200, dueDate: "2026-06-15", project: "Casa de Leilão Centro" },
  { description: "Aporte em terreno", type: "Investimento", amount: -85000, dueDate: "2026-06-20", project: "Containers BR-376" }
];

const columns: ColumnDef<Transaction>[] = [
  { accessorKey: "description", header: "Descrição" },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => <Badge tone={row.original.amount > 0 ? "success" : row.original.type === "Dívida" ? "warning" : "muted"}>{row.original.type}</Badge>
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Valor <ArrowUpDown className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className={row.original.amount < 0 ? "text-destructive" : "text-success"}>{currency(row.original.amount)}</span>
  },
  { accessorKey: "dueDate", header: "Vencimento" },
  { accessorKey: "project", header: "Projeto" }
];

export function TransactionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), onSortingChange: setSorting, state: { sorting } });

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
