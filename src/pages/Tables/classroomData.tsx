// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ClassroomBannerEditor from "../../components/tables/classroomtab";
import ClassroomDataTab from "../../components/tables/classroomdatatab";

export default function ClassroomData() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Classroom Data " />
      <div className="space-y-6">
        <ComponentCard title="Classroom Data ">
          <ClassroomDataTab />
        </ComponentCard>
      </div>
    </>
  );
}
