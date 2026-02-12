"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridReadyEvent, CellClickedEvent } from "ag-grid-community";
import { useState, useCallback, useMemo } from "react";
import { Button, IconButton, Chip } from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";

interface ContentRow {
  id: string;
  title: string;
  originalTitle?: string;
  type: "movie" | "series";
  year?: number;
  status: "draft" | "published";
  rating?: number;
  isKids?: boolean;
  isComingSoon?: boolean;
  isDubbed?: boolean;
}

interface AGGridContentTableProps {
  initialData?: ContentRow[];
  onEdit?: (row: ContentRow) => void;
  onDelete?: (id: string) => void;
  onSelectionChange?: (selectedRows: ContentRow[]) => void;
}

/**
 * AG Grid Content Table Component
 * 
 * Features:
 * - Sortable columns
 * - Filterable data
 * - Server-side pagination ready
 * - Row selection
 * - Custom cell renderers
 * - RTL support for Persian
 * - Action buttons per row
 */
export function AGGridContentTable({
  initialData = [],
  onEdit,
  onDelete,
  onSelectionChange,
}: AGGridContentTableProps) {
  const [rowData, setRowData] = useState<ContentRow[]>(initialData);
  const [loading, setLoading] = useState(false);

  // Status badge renderer
  const StatusRenderer = useCallback((params: any) => {
    const status = params.value;
    return (
      <Chip
        label={status === "published" ? "منتشر شده" : "پیش‌نویس"}
        color={status === "published" ? "success" : "default"}
        size="small"
      />
    );
  }, []);

  // Type badge renderer
  const TypeRenderer = useCallback((params: any) => {
    const type = params.value;
    return (
      <Chip
        label={type === "movie" ? "فیلم" : "سریال"}
        color={type === "movie" ? "primary" : "secondary"}
        size="small"
        variant="outlined"
      />
    );
  }, []);

  // Boolean flags renderer
  const FlagsRenderer = useCallback((params: any) => {
    const { isKids, isComingSoon, isDubbed } = params.data;
    return (
      <div className="flex gap-1">
        {isKids && <Chip label="کودکان" size="small" color="info" />}
        {isComingSoon && <Chip label="به زودی" size="small" color="warning" />}
        {isDubbed && <Chip label="دوبله" size="small" color="success" />}
      </div>
    );
  }, []);

  // Actions cell renderer
  const ActionsRenderer = useCallback(
    (params: any) => {
      return (
        <div className="flex gap-1 items-center">
          <IconButton
            size="small"
            onClick={() => onEdit?.(params.data)}
            title="ویرایش"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete?.(params.data.id)}
            title="حذف"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
          <IconButton size="small" title="عملیات بیشتر">
            <MoreVert fontSize="small" />
          </IconButton>
        </div>
      );
    },
    [onEdit, onDelete]
  );

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "id",
        headerName: "شناسه",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 80,
        pinned: "right",
      },
      {
        field: "title",
        headerName: "عنوان",
        filter: "agTextColumnFilter",
        sortable: true,
        flex: 2,
        minWidth: 200,
      },
      {
        field: "originalTitle",
        headerName: "عنوان اصلی",
        filter: "agTextColumnFilter",
        sortable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "type",
        headerName: "نوع",
        cellRenderer: TypeRenderer,
        filter: "agSetColumnFilter",
        sortable: true,
        width: 120,
      },
      {
        field: "year",
        headerName: "سال",
        filter: "agNumberColumnFilter",
        sortable: true,
        width: 100,
      },
      {
        field: "rating",
        headerName: "امتیاز",
        filter: "agNumberColumnFilter",
        sortable: true,
        width: 100,
        valueFormatter: (params) =>
          params.value ? params.value.toFixed(1) : "-",
      },
      {
        field: "status",
        headerName: "وضعیت",
        cellRenderer: StatusRenderer,
        filter: "agSetColumnFilter",
        sortable: true,
        width: 130,
      },
      {
        field: "flags",
        headerName: "ویژگی‌ها",
        cellRenderer: FlagsRenderer,
        width: 200,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "عملیات",
        cellRenderer: ActionsRenderer,
        width: 150,
        pinned: "left",
        sortable: false,
        filter: false,
      },
    ],
    [TypeRenderer, StatusRenderer, FlagsRenderer, ActionsRenderer]
  );

  // Default column configuration
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  // Grid ready event - can fetch data from API here
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Example: Fetch from API
    // setLoading(true);
    // fetch('/api/admin/content?page=1&limit=20')
    //   .then(res => res.json())
    //   .then(data => {
    //     setRowData(data.content);
    //     setLoading(false);
    //   });
  }, []);

  // Selection changed event
  const onSelectionChanged = useCallback(
    (event: any) => {
      const selectedRows = event.api.getSelectedRows();
      onSelectionChange?.(selectedRows);
    },
    [onSelectionChange]
  );

  return (
    <div className="w-full">
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          enableRtl={true}
          loading={loading}
          animateRows={true}
          domLayout="normal"
        />
      </div>
    </div>
  );
}
