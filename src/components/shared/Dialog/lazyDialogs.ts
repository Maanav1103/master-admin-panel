import dynamic from "next/dynamic";

export const DeleteDialog = dynamic(
  () =>
    import("@/components/shared/Dialog/DeleteDialog/DeleteDialog").then(
      (mod) => mod.DeleteDialog
    ),
  { ssr: false }
);

export const ViewDialog = dynamic(
  () =>
    import("@/components/shared/Dialog/ViewDialog").then(
      (mod) => mod.ViewDialog
    ),
  { ssr: false }
);

export const StatusModal = dynamic(
  () => import("@/components/shared/Dialog/StatusChangeDialog"),
  { ssr: false }
);
