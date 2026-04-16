"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { CustomButton } from "@/components/custom-elements/button";
import { X } from "lucide-react";
import { EditIcon, TrashIcon } from "@/assets/icon/icons";
import { StatusModal, DeleteDialog } from "@/components/shared/Dialog/lazyDialogs";
import { AddEditCrudDialog, CrudFormData } from "@/components/shared/Dialog/CreateEditDialogs/AddEditCrudDialog";
import { paginationDropdownOptions } from "@/utils/data/dropdowns";

const InputGroup = dynamic(
  () => import("@/components/custom-elements/InputGroup"),
  { ssr: false },
);
const TablePagination = dynamic(
  () => import("@/components/shared/pagination/TablePagination"),
  { ssr: false },
);
const CustomDropdown = dynamic(
  () => import("@/components/custom-elements/CustomDropdown"),
  { ssr: false },
);

export interface CrudItem {
  id: number;
  name: string;
  category: string;
  email: string;
  gender: string;
  skills: string[];
  dateRange: { from: string; to: string } | null;
  notes: string;
  avatar: string;
  documents: string[];
  status: 0 | 1;
}

const STATIC_DATA: CrudItem[] = [
  {
    id: 1, name: "Alice Johnson", category: "Admin", email: "alice@example.com",
    gender: "female", skills: ["React", "Node"],
    dateRange: { from: "2024-01-01", to: "2024-03-31" },
    notes: "Senior developer", avatar: "", documents: [], status: 1,
  },
  {
    id: 2, name: "Bob Smith", category: "Editor", email: "bob@example.com",
    gender: "male", skills: ["Vue"],
    dateRange: null, notes: "Content editor", avatar: "", documents: [], status: 1,
  },
  {
    id: 3, name: "Carol White", category: "Viewer", email: "carol@example.com",
    gender: "female", skills: ["Design"],
    dateRange: { from: "2024-03-01", to: "2024-06-30" },
    notes: "UI designer", avatar: "", documents: [], status: 0,
  },
];

const CATEGORY_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
];

export default function CrudTable() {
  const [items, setItems] = useState<CrudItem[]>(STATIC_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | number>("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<CrudItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const handleAddItem = () => {
    setIsEditing(false);
    setSelected(null);
    setCrudModalOpen(true);
  };

  const handleEditItem = (item: CrudItem) => {
    setIsEditing(true);
    setSelected(item);
    setCrudModalOpen(true);
  };

  const handleSubmit = (values: CrudFormData, id?: number) => {
    if (id) {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...values } : item)));
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...values, status: 1 }]);
    }
    setPage(1);
  };

  const handleStatusChange = (id: number, newStatus: 0 | 1) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  const handleConfirmDelete = () => {
    if (!selected) return;
    setItems((prev) => prev.filter((item) => item.id !== selected.id));
    setDeleteModalOpen(false);
    setSelected(null);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const hasActiveFilters = searchTerm || categoryFilter;

  const handleClearAll = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setPage(1);
  };

  return (
    <>
      <div className="rounded-lg bg-white p-8 pt-0 shadow-lg">
        {/* Add Button */}
        <div className="flex justify-end pt-4 pb-2 items-center gap-2">
          <CustomButton
            onClick={handleAddItem}
            type="button"
            label="Add Item +"
            variant="gradient"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-col md:flex-row gap-4 mb-1 w-[300px] md:w-full">
          <div className="relative flex items-center gap-2 pt-2">
            <InputGroup
              name="search"
              icon={
                <X
                  className="h-5 w-5 cursor-pointer rounded-full bg-gray-100 p-1 text-gray-500 shadow-sm transition-colors duration-200 hover:bg-gray-200 hover:text-gray-700"
                  onClick={handleClearSearch}
                />
              }
              label=""
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-auto py-2"
            />
            <CustomDropdown
              placeholder="Category"
              width="w-36"
              options={CATEGORY_OPTIONS}
              onChange={(value) => { setCategoryFilter(value); setPage(1); }}
              value={categoryFilter}
              showClearButton
              onClear={() => { setCategoryFilter(""); setPage(1); }}
            />
            {hasActiveFilters && (
              <CustomButton
                className="p-0 pl-2"
                onClick={handleClearAll}
                type="button"
                label="Clear Filters"
                variant="clear"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-gray-600">Per Page:</span>
            <CustomDropdown
              width="w-18"
              options={paginationDropdownOptions}
              onChange={(value: number | string) => {
                setLimit(typeof value === "number" ? value : parseInt(value, 10));
                setPage(1);
              }}
              value={limit}
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold whitespace-nowrap">Name</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Gender</TableHead>
              <TableHead className="font-bold">Skills</TableHead>
              <TableHead className="font-bold whitespace-nowrap">Date Range</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell className="capitalize">{item.gender}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.map((s) => (
                        <span key={s} className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">{s}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-gray-600">
                    {item.dateRange ? `${item.dateRange.from} – ${item.dateRange.to}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.status === 1}
                      onCheckedChange={() => { setSelected(item); setStatusModalOpen(true); }}
                      className="data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="cursor-pointer" onClick={() => handleEditItem(item)}>
                        <EditIcon className="h-5 w-5" />
                      </span>
                      <span className="cursor-pointer text-red-500" onClick={() => { setSelected(item); setDeleteModalOpen(true); }}>
                        <TrashIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">No Data Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 0 && paginated.length > 0 && (
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            itemsPerPage={limit}
            totalItems={totalItems}
            onPageChange={(p: number) => setPage(p)}
          />
        )}
      </div>

      {statusModalOpen && selected && (
        <StatusModal
          dialogTitle="Change Item Status"
          isOpen={statusModalOpen}
          onClose={() => { setStatusModalOpen(false); setSelected(null); }}
          onConfirm={() => {
            handleStatusChange(selected.id, selected.status === 1 ? 0 : 1);
            setStatusModalOpen(false);
            setSelected(null);
          }}
          currentStatus={selected.status}
          itemTitle={selected.name}
          disabled={false}
        />
      )}

      {deleteModalOpen && selected && (
        <DeleteDialog
          isOpen={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setSelected(null); }}
          onConfirm={handleConfirmDelete}
          title="Delete Item"
          message={`Are you sure you want to delete "${selected.name}"? This action cannot be undone.`}
        />
      )}

      <AddEditCrudDialog
        isOpen={crudModalOpen}
        onClose={() => { setCrudModalOpen(false); setSelected(null); setIsEditing(false); }}
        isEditing={isEditing}
        itemData={selected}
        onSubmit={handleSubmit}
      />
    </>
  );
}
