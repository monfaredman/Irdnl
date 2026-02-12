"use client";

import { useState } from "react";
import { AGGridContentTable } from "@/components/admin/AGGridContentTable";
import { AGGridEditableTable } from "@/components/admin/AGGridEditableTable";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * AG Grid Demo Page
 * 
 * Showcases two types of AG Grid implementations:
 * 1. Read-only table with action buttons
 * 2. Editable table with React Hook Form integration
 */
export default function AGGridDemoPage() {
  const [tabValue, setTabValue] = useState(0);

  // Sample data for read-only table
  const sampleContent = [
    {
      id: "1",
      title: "The Shawshank Redemption",
      originalTitle: "The Shawshank Redemption",
      type: "movie" as const,
      year: 1994,
      status: "published" as const,
      rating: 9.3,
      isKids: false,
      isComingSoon: false,
      isDubbed: true,
    },
    {
      id: "2",
      title: "Breaking Bad",
      originalTitle: "Breaking Bad",
      type: "series" as const,
      year: 2008,
      status: "published" as const,
      rating: 9.5,
      isKids: false,
      isComingSoon: false,
      isDubbed: true,
    },
    {
      id: "3",
      title: "Frozen",
      originalTitle: "Frozen",
      type: "movie" as const,
      year: 2013,
      status: "published" as const,
      rating: 7.4,
      isKids: true,
      isComingSoon: false,
      isDubbed: true,
    },
    {
      id: "4",
      title: "Avatar 3",
      originalTitle: "Avatar: The Way of Water",
      type: "movie" as const,
      year: 2026,
      status: "draft" as const,
      rating: undefined,
      isKids: false,
      isComingSoon: true,
      isDubbed: false,
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (row: any) => {
    console.log("Edit:", row);
    alert(`ویرایش: ${row.title}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete:", id);
    if (confirm("آیا مطمئن هستید؟")) {
      alert(`حذف شد: ${id}`);
    }
  };

  const handleSelectionChange = (selectedRows: any[]) => {
    console.log("Selected rows:", selectedRows);
  };

  return (
    <div className="container mx-auto p-6">
      <Paper elevation={2}>
        <div className="p-6">
          <Typography variant="h4" component="h1" className="mb-4">
            AG Grid + React Hook Form Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" className="mb-6">
            این صفحه دو نوع جدول AG Grid را نمایش می‌دهد: جدول فقط خواندنی با دکمه‌های عملیات و جدول قابل ویرایش با React Hook Form
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="جدول محتوا (Read-Only)" />
              <Tab label="جدول قابل ویرایش (Editable)" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <div className="space-y-4">
              <Typography variant="h6" className="mb-4">
                جدول محتوا با قابلیت‌های پیشرفته
              </Typography>
              <div className="bg-gray-50 p-4 rounded mb-4">
                <Typography variant="body2" className="mb-2">
                  <strong>قابلیت‌ها:</strong>
                </Typography>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>مرتب‌سازی چند ستونی (با Shift+Click)</li>
                  <li>فیلتر کردن داده‌ها (کلیک روی آیکون فیلتر)</li>
                  <li>صفحه‌بندی با امکان تغییر تعداد آیتم</li>
                  <li>انتخاب چندگانه ردیف‌ها</li>
                  <li>دکمه‌های عملیات (ویرایش، حذف)</li>
                  <li>نمایش بج‌های وضعیت و ویژگی‌ها</li>
                  <li>پشتیبانی RTL برای فارسی</li>
                </ul>
              </div>
              <AGGridContentTable
                initialData={sampleContent}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectionChange={handleSelectionChange}
              />
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <div className="space-y-4">
              <Typography variant="h6" className="mb-4">
                جدول قابل ویرایش با React Hook Form
              </Typography>
              <div className="bg-gray-50 p-4 rounded mb-4">
                <Typography variant="body2" className="mb-2">
                  <strong>قابلیت‌ها:</strong>
                </Typography>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>ویرایش inline سلول‌ها (دوبار کلیک)</li>
                  <li>مدیریت state با React Hook Form</li>
                  <li>ذخیره دسته‌جمعی به API</li>
                  <li>افزودن/حذف ردیف</li>
                  <li>نمایش تغییرات ذخیره نشده</li>
                  <li>انتخاب از dropdown در سلول</li>
                  <li>ویرایش boolean با checkbox</li>
                </ul>
              </div>
              <AGGridEditableTable />
            </div>
          </TabPanel>
        </div>
      </Paper>
    </div>
  );
}
