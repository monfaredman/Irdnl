"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ColDef,
  CellEditingStoppedEvent,
  GridReadyEvent,
} from "ag-grid-community";
import { useForm, Controller } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Button, IconButton, Chip } from "@mui/material";
import { Save, Add, Delete } from "@mui/icons-material";

interface SliderRow {
  id: string;
  title: string;
  titleFa?: string;
  section: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

interface FormData {
  rows: SliderRow[];
}

/**
 * Editable AG Grid with React Hook Form Integration
 * 
 * Use case: Manage sliders, categories, or any bulk editable data
 * Features:
 * - Inline cell editing
 * - Form state management with react-hook-form
 * - Bulk save to API
 * - Add/remove rows
 * - Real-time validation
 */
export function AGGridEditableTable() {
  const { control, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<FormData>({
    defaultValues: {
      rows: [
        {
          id: "1",
          title: "New Movies",
          titleFa: "فیلم‌های جدید",
          section: "hero",
          imageUrl: "/images/slider1.jpg",
          linkUrl: "/movies",
          sortOrder: 1,
          isActive: true,
        },
        {
          id: "2",
          title: "Popular Series",
          titleFa: "سریال‌های محبوب",
          section: "hero",
          imageUrl: "/images/slider2.jpg",
          linkUrl: "/series",
          sortOrder: 2,
          isActive: true,
        },
      ],
    },
  });

  const rows = watch("rows");
  const [loading, setLoading] = useState(false);

  // Section dropdown options
  const sectionOptions = [
    { value: "hero", label: "هیرو" },
    { value: "trending", label: "محبوب" },
    { value: "new-releases", label: "جدیدترین‌ها" },
    { value: "recommendations", label: "پیشنهادی" },
  ];

  // Active status renderer
  const ActiveRenderer = useCallback((params: any) => {
    return (
      <Chip
        label={params.value ? "فعال" : "غیرفعال"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    );
  }, []);

  // Delete button renderer
  const DeleteRenderer = useCallback(
    (params: any) => {
      const handleDelete = () => {
        const updatedRows = rows.filter((row) => row.id !== params.data.id);
        setValue("rows", updatedRows, { shouldDirty: true });
      };

      return (
        <IconButton size="small" onClick={handleDelete} color="error">
          <Delete fontSize="small" />
        </IconButton>
      );
    },
    [rows, setValue]
  );

  // Column definitions with editable cells
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "title",
        headerName: "Title (EN)",
        editable: true,
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "titleFa",
        headerName: "عنوان (FA)",
        editable: true,
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "section",
        headerName: "بخش",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: sectionOptions.map((opt) => opt.value),
        },
        valueFormatter: (params) => {
          const option = sectionOptions.find((opt) => opt.value === params.value);
          return option?.label || params.value;
        },
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        field: "imageUrl",
        headerName: "تصویر",
        editable: true,
        flex: 1,
        minWidth: 200,
      },
      {
        field: "linkUrl",
        headerName: "لینک",
        editable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "sortOrder",
        headerName: "ترتیب",
        editable: true,
        filter: "agNumberColumnFilter",
        sortable: true,
        width: 100,
        cellEditor: "agNumberCellEditor",
      },
      {
        field: "isActive",
        headerName: "وضعیت",
        editable: true,
        cellRenderer: ActiveRenderer,
        cellEditor: "agCheckboxCellEditor",
        width: 120,
      },
      {
        field: "actions",
        headerName: "حذف",
        cellRenderer: DeleteRenderer,
        width: 100,
        sortable: false,
        filter: false,
        pinned: "left",
      },
    ],
    [sectionOptions, ActiveRenderer, DeleteRenderer]
  );

  // Default column configuration
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
    }),
    []
  );

  // Handle cell editing
  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      const updatedRows = [...rows];
      const rowIndex = event.rowIndex;

      if (rowIndex !== null && rowIndex !== undefined) {
        const field = event.column.getColId();
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [field]: event.newValue,
        };
        setValue("rows", updatedRows, { shouldDirty: true });
      }
    },
    [rows, setValue]
  );

  // Add new row
  const handleAddRow = useCallback(() => {
    const newRow: SliderRow = {
      id: `new-${Date.now()}`,
      title: "",
      titleFa: "",
      section: "hero",
      imageUrl: "",
      linkUrl: "",
      sortOrder: rows.length + 1,
      isActive: true,
    };
    setValue("rows", [...rows, newRow], { shouldDirty: true });
  }, [rows, setValue]);

  // Submit form
  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true);
      try {
        // Example API call
        // const response = await fetch('/api/admin/sliders/bulk-update', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data.rows),
        // });
        
        console.log("Submitting data:", data);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        alert("تغییرات با موفقیت ذخیره شد");
      } catch (error) {
        console.error("Error saving:", error);
        alert("خطا در ذخیره تغییرات");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddRow}
          disabled={loading}
        >
          افزودن ردیف جدید
        </Button>
        <div className="flex gap-2">
          {isDirty && (
            <Chip label="تغییرات ذخیره نشده" color="warning" size="small" />
          )}
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>

      {/* AG Grid */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <Controller
            name="rows"
            control={control}
            render={({ field }) => (
              <AgGridReact
                rowData={field.value}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellEditingStopped={onCellEditingStopped}
                editType="fullRow"
                pagination={true}
                paginationPageSize={10}
                enableRtl={true}
                animateRows={true}
                singleClickEdit={false}
                stopEditingWhenCellsLoseFocus={true}
              />
            )}
          />
        </div>
      </form>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">راهنما:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>برای ویرایش، روی سلول مورد نظر دوبار کلیک کنید</li>
          <li>برای ذخیره ویرایش، Enter بزنید یا خارج از سلول کلیک کنید</li>
          <li>برای لغو ویرایش، Escape بزنید</li>
          <li>تغییرات تا زمان کلیک روی دکمه "ذخیره تغییرات" ذخیره نمی‌شوند</li>
        </ul>
      </div>
    </div>
  );
}
