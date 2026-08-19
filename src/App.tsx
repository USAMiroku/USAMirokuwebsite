import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'

const About = lazy(() => import('./pages/About'))
const Books = lazy(() => import('./pages/Books'))
const Contact = lazy(() => import('./pages/Contact'))
const CommunityPrograms = lazy(() => import('./pages/CommunityPrograms'))
const Donate = lazy(() => import('./pages/Donate'))
const FAQ = lazy(() => import('./pages/FAQ'))
const FirstVisit = lazy(() => import('./pages/FirstVisit'))
const Guidelines2026 = lazy(() => import('./pages/Guidelines2026'))
const Home = lazy(() => import('./pages/Home'))
const Johrei = lazy(() => import('./pages/Johrei'))
const LocationDetail = lazy(() => import('./pages/LocationDetail'))
const Locations = lazy(() => import('./pages/Locations'))
const MeishuSama = lazy(() => import('./pages/MeishuSama'))
const MeishuSamaLegacy = lazy(() => import('./pages/MeishuSamaLegacy'))
const ParadiseOnEarth = lazy(() => import('./pages/ParadiseOnEarth'))
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'))
const Resources = lazy(() => import('./pages/Resources'))
const SpecialServiceForm = lazy(() => import('./pages/SpecialServiceForm'))
const SpecialServices = lazy(() => import('./pages/SpecialServices'))
const SpecialServicesThankYou = lazy(() => import('./pages/SpecialServices').then((module) => ({ default: module.SpecialServicesThankYou })))
const TestimonialDetail = lazy(() => import('./pages/TestimonialDetail'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const LearningActivities = lazy(() => import('./learning/pages/LearningActivities'))
const LearningActivityDetail = lazy(() => import('./learning/pages/LearningActivityDetail'))
const LearningAdminDonations = lazy(() => import('./learning/pages/LearningAdminDonations'))
const LearningAdminCenterActivities = lazy(() => import('./learning/pages/LearningAdminCenterActivities'))
const LearningAdminOrganization = lazy(() => import('./learning/pages/LearningAdminOrganization'))
const LearningAdminMaterialsUpload = lazy(() => import('./learning/pages/LearningAdminMaterialsUpload'))
const LearningAdminCommunityProgramPhotos = lazy(() => import('./learning/pages/LearningAdminCommunityProgramPhotos'))
const LearningAdminUsers = lazy(() => import('./learning/pages/LearningAdminUsers'))
const LearningCenterActivities = lazy(() => import('./learning/pages/LearningCenterActivities'))
const LearningResetPassword = lazy(() => import('./learning/pages/LearningResetPassword'))
const LearningSignIn = lazy(() => import('./learning/pages/LearningSignIn'))

function RouteLoader() {
  return (
    <div className="min-h-[40vh] bg-sanctuary-100 px-6 py-24 text-center text-deep-slate">
      <div className="mx-auto max-w-xl rounded-[28px] paper-panel px-8 py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600">Loading</p>
        <p className="mt-4 text-3xl font-serif">Preparing the page</p>
      </div>
    </div>
  )
}

function LegacyActivityRedirect() {
  const { activityId } = useParams<{ activityId: string }>()
  return <Navigate to={activityId ? `/activities/${activityId}` : '/activities'} replace />
}

function LegacyCenterActivitiesRedirect() {
  const { centerId } = useParams<{ centerId: string }>()
  return <Navigate to={centerId ? `/activities/centers/${centerId}` : '/activities'} replace />
}

function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="books" element={<Books />} />
          <Route path="johrei" element={<Johrei />} />
          <Route path="meishu-sama" element={<MeishuSama />} />
          <Route path="meishu-sama/legacy" element={<MeishuSamaLegacy />} />
          <Route path="paradise-on-earth" element={<ParadiseOnEarth />} />
          <Route path="first-visit" element={<FirstVisit />} />
          <Route path="locations" element={<Locations />} />
          <Route path="locations/:id" element={<LocationDetail />} />
          <Route path="activities" element={<LearningActivities />} />
          <Route path="activities/centers/:centerId" element={<LearningCenterActivities />} />
          <Route path="activities/:activityId" element={<LearningActivityDetail />} />
          <Route path="events" element={<Navigate to="/activities" replace />} />
          <Route path="events/centers/:centerId" element={<LegacyCenterActivitiesRedirect />} />
          <Route path="events/:activityId" element={<LegacyActivityRedirect />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
          <Route path="special-services" element={<SpecialServices />} />
          <Route path="special-services/thank-you" element={<SpecialServicesThankYou />} />
          <Route path="special-services/:serviceSlug" element={<SpecialServiceForm />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="testimonials/:id" element={<TestimonialDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="community-programs" element={<CommunityPrograms />} />
          <Route path="donate" element={<Donate />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="guidelines-2026" element={<Guidelines2026 />} />
          <Route path="learn" element={<Navigate to="/activities" replace />} />
          <Route path="learn/activities" element={<Navigate to="/activities" replace />} />
          <Route path="learn/activities/:activityId" element={<LegacyActivityRedirect />} />
          <Route path="learn/centers/:centerId" element={<LegacyCenterActivitiesRedirect />} />
          <Route path="learn/sessions/:sessionId/register" element={<Navigate to="/activities" replace />} />
          <Route path="learn/account" element={<Navigate to="/admin/sign-in" replace />} />
          <Route path="reset-password" element={<LearningResetPassword />} />
          <Route path="learn/sign-in" element={<Navigate to="/admin/sign-in" replace />} />
          <Route path="learn/sign-up" element={<Navigate to="/admin/sign-in" replace />} />
          <Route path="admin" element={<LearningSignIn />} />
          <Route path="admin/sign-in" element={<LearningSignIn />} />
          <Route path="admin/reset-password" element={<Navigate to="/reset-password" replace />} />
          <Route path="admin/dashboard" element={<Navigate to="/admin/activities" replace />} />
          <Route path="admin/registrations" element={<Navigate to="/admin/activities" replace />} />
          <Route path="admin/donations" element={<LearningAdminDonations />} />
          <Route path="admin/activities" element={<LearningAdminCenterActivities />} />
          <Route path="admin/centers" element={<LearningAdminCenterActivities />} />
          <Route path="admin/organization" element={<LearningAdminOrganization />} />
          <Route path="admin/materials" element={<LearningAdminMaterialsUpload />} />
          <Route path="admin/program-photos" element={<LearningAdminCommunityProgramPhotos />} />
          <Route path="admin/users" element={<LearningAdminUsers />} />
          <Route path="learn/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="learn/admin/registrations" element={<Navigate to="/admin/activities" replace />} />
          <Route path="learn/admin/donations" element={<Navigate to="/admin/donations" replace />} />
          <Route path="learn/admin/centers" element={<Navigate to="/admin/activities" replace />} />
          <Route path="learn/admin/organization" element={<Navigate to="/admin/organization" replace />} />
          <Route path="learn/admin/materials" element={<Navigate to="/admin/materials" replace />} />
          <Route path="learn/admin/program-photos" element={<Navigate to="/admin/program-photos" replace />} />
          <Route path="learn/admin/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
