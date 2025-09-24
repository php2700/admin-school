// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ContactReqTable from "../../components/tables/contactusTab";
import ContactusBanner from "../../components/tables/contactusBanner";
import GalleryBanner from "../../components/tables/galleryBanners";
import GalleryListTables from "../../components/tables/galleryTables";
import AboutusEditor from "../../components/tables/aboutusTab";
import LeaderShipBanner from "../../components/tables/leaderBanner";
import ScheduleVisitBannerEditor from "../../components/tables/schedulevisitBanner";

export default function ScheduleVisitBanner() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Schedule Visit Banner " />
      <div className="space-y-6">
        <ComponentCard title="Schedule Visit Banner ">
          <ScheduleVisitBannerEditor />
        </ComponentCard>
      </div>
    </>
  );
}
