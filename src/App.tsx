// @ts-nocheck

import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ContactUsReqTables from "./pages/Tables/contactusTable";
import TakeTourTable from "./pages/Tables/tourTable";
import AdmissionEnqTables from "./pages/Tables/admissionEnqTable";
import { Navigate } from "react-router-dom";
import BannerTable from "./pages/Tables/bannerTable";
import WelcomeTable from "./pages/Tables/welcome";
import EveryChildTable from "./pages/Tables/EveryChildTable";
import CbseTable from "./pages/Tables/cbseTable";
import SchoolActivityTable from "./pages/Tables/schoolActivityTable";
import SteamTable from "./pages/Tables/steamTable";
import StudentExperienceTable from "./pages/Tables/studentExperienceTable";
import FaqTable from "./pages/Tables/faqTable";
import FacilityTable from "./pages/Tables/facilityTable";
import ContactUsBannerTables from "./pages/Tables/contactusBanner";
import GalleryBannerTables from "./pages/Tables/galleryBanner";
import GalleryTables from "./pages/Tables/galleryTable";
import Aboutus from "./pages/Tables/aboutus";
import LeadershipBanners from "./pages/Tables/leadershipBanner";
import LeadersTab from "./pages/Tables/leaders";
import Priciple from "./pages/Tables/Principle";
import Vision from "./pages/Tables/vision";
import Diffrent from "./pages/Tables/diffrent";
import BlogBanners from "./pages/Tables/blogBanner";
import BlogDataTable from "./pages/Tables/blogdata";
import Philosphy from "./pages/Tables/philosphy";
import Educator from "./pages/Tables/shrieducator";
import ApplicationnFormBanner from "./pages/Tables/applicationfromBanner";
import ScheduleVisitBanner from "./pages/Tables/shedulevisistBanner";
import FaqBanner from "./pages/Tables/faqBanner";
import Curriculum from "./pages/Tables/curriculum";
import Art from "./pages/Tables/art";
import Society from "./pages/Tables/society";
import Sports from "./pages/Tables/sport";
import Classroom from "./pages/Tables/classroom";
import ClassroomData from "./pages/Tables/classroomData";
import Environment from "./components/tables/environment";
import Differentiators from "./components/tables/diffrentiator";
import PursuitTable from "./pages/Tables/pursuittab";
import Core from "./pages/Tables/core";
import Program from "./pages/Tables/program";
import AdmissionProcess from "./pages/Tables/admissionprocss";

export default function App() {

  const PrivateRoute=({children})=>{
    const token=localStorage.getItem('shriRamSchoolToken')
    return (
        token ? children : <Navigate to="/" />
    )
  }

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route index path="/"   element={<SignIn />} />
          
          <Route element={<AppLayout />}>
            <Route  path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route  path="/banner" element={<PrivateRoute><BannerTable /></PrivateRoute>} />
            <Route  path="/welcome" element={<PrivateRoute><WelcomeTable /></PrivateRoute>} />
            <Route path="/every-child-section" element={<PrivateRoute><EveryChildTable /></PrivateRoute>}   />
            <Route path='/cbse-section' element={<PrivateRoute><CbseTable/></PrivateRoute>} />
            <Route path="/school-activity" element={<PrivateRoute><SchoolActivityTable/></PrivateRoute>}  />
            <Route path="/steam" element={<PrivateRoute><SteamTable/></PrivateRoute>}  />
            <Route path="/student-experience" element={<PrivateRoute><StudentExperienceTable/></PrivateRoute>}  />
            <Route path="/faq" element={<PrivateRoute><FaqTable/></PrivateRoute>}  />
            <Route path="/facility" element={<PrivateRoute><FacilityTable/></PrivateRoute>}  />
            <Route path="/contact-us-banner" element={<PrivateRoute><ContactUsBannerTables/></PrivateRoute>}  />
            <Route path="/gallery-banner" element={<PrivateRoute><GalleryBannerTables/></PrivateRoute>}  />
            <Route path="/gallery-list" element={<PrivateRoute><GalleryTables/></PrivateRoute>}  />
            <Route path="/about-us" element={<PrivateRoute><Aboutus/></PrivateRoute>}  />
            <Route path='/leadership-banner'element={<PrivateRoute><LeadershipBanners/></PrivateRoute>}/>
            <Route path='/leaders'element={<PrivateRoute><LeadersTab/></PrivateRoute>}/>
            <Route path="/principle-message" element={<PrivateRoute><Priciple/></PrivateRoute>} />
            <Route path="/vision" element={<PrivateRoute><Vision/></PrivateRoute>} />
            <Route path="/diffrent-from-other" element={<PrivateRoute><Diffrent/></PrivateRoute>}   />
            <Route path="/blog-banner" element={<PrivateRoute><BlogBanners/></PrivateRoute>} />
            <Route path="/blog-data" element={<PrivateRoute><BlogDataTable/></PrivateRoute>} />
            <Route path="/shri-philosophy" element={<PrivateRoute><Philosphy/></PrivateRoute> } />
            <Route path="/shri-educator" element={<PrivateRoute><Educator/></PrivateRoute>} />
            <Route path="/application-form-banner" element={<PrivateRoute><ApplicationnFormBanner/></PrivateRoute>} />
            <Route path="/shedule-visit-banner" element={<PrivateRoute><ScheduleVisitBanner/></PrivateRoute> } />
            <Route path="/faq-banner" element={<PrivateRoute><FaqBanner/></PrivateRoute>} />
            <Route path="/curriculum" element={<PrivateRoute><Curriculum/></PrivateRoute>}/>
            <Route path="/art" element={<PrivateRoute><Art/></PrivateRoute>}/>
            <Route path="/society" element={<PrivateRoute><Society/></PrivateRoute>}/>
            <Route path="/sports" element={<PrivateRoute><Sports/></PrivateRoute>}/>
            <Route path="/classroom"element={<PrivateRoute><Classroom/></PrivateRoute>} />
            <Route path="/classroom-data" element={<PrivateRoute><ClassroomData/></PrivateRoute>} />
            <Route path="/learning-environment" element={<PrivateRoute><Environment/></PrivateRoute>} />
            <Route path="/shri-differentiators" element={<PrivateRoute><Differentiators/></PrivateRoute>} />
            <Route path="/co-curriculum-pursuit" element={<PrivateRoute><PursuitTable/></PrivateRoute>} />
            <Route path="/core-values" element={<PrivateRoute><Core/></PrivateRoute>}  />
            <Route path="/program" element={<PrivateRoute><Program/></PrivateRoute>}  />
            <Route path="/admission-process" element={<PrivateRoute><AdmissionProcess/></PrivateRoute>} />
            <Route path="/mandatory" element={<PrivateRoute><AdmissionProcess/></PrivateRoute>} />

            <Route path="/contact-us-list" element={<PrivateRoute><ContactUsReqTables /></PrivateRoute>} />
            <Route path="/take-tour" element={<PrivateRoute><TakeTourTable /></PrivateRoute>} />
            <Route path='/admission-enq-list' element={<PrivateRoute><AdmissionEnqTables/></PrivateRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
