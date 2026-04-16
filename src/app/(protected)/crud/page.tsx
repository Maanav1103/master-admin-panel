import Breadcrumb from "@/components/custom-elements/Breadcrumb";
import CrudTable from "@/components/shared/Tables/CrudTable";

export default function CrudPage() {
  return (
    <>
      <Breadcrumb pageName="CRUD" />
      <CrudTable />
    </>
  );
}
