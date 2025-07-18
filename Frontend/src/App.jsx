import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import RootLayout2 from "./components/RootLayout2";
import FirstPage from "./pages/FirstPage";
import SingleEntryAuth from "./pages/SingleEntryAuth";
import RoleSelection from "./pages/RoleSelection";
import CompanyReview from "./pages/CompanyReview";
import EmployerHome from "./pages/EmployerHome";
import JobPostSuccessPage from "./pages/JobPostSuccessPage";
import CombinedEmployerPage from "./components/employer/CombinedEmployerPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedPublic from "./components/ProtectedPublic";
import EmployerPost from "./pages/EmployerPost";
import EmployerPostEdit from "./pages/EmployerPostEdit";
import JSProfile from "./pages/JSProfile";
import ChatPage from "./pages/ChatPage";
import ChatPageEmployer from "./pages/ChatPageEmployer";
import EmployerPostViewApplicants from "./pages/EmployerPostViewApplicants";
import SavePagejobpost from "./pages/SavePagejobpost";
import CompanyProfileForm from "./pages/CompanyProfileForm";
import JobDetailsPage from "./pages/JobDetailsPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import FallbackPage from "./pages/FallbackPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <FirstPage />,
      },
      {
        path: "/role",
        element: (
          <ProtectedPublic>
            {" "}
            <RoleSelection />{" "}
          </ProtectedPublic>
        ),
      },
      {
        path: "/companyReview",
        element: <CompanyReview />,
      },
      {
        path: "/profile",
        element: <JSProfile />,
      },
      {
        path: "/job-details/:jobId",
        element: <JobDetailsPage />,
      },
      {
        path: "/company/user/:userId",
        element: <CompanyProfilePage />,
      },
    ],
  },

  //employer
  {
    path: "/",
    element: <RootLayout2 />,
    children: [
      {
        path: "/EmployerHome",
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-posts",
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-job/:jobId",
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerPostEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job-applicants/:jobId",
        element: (
          <ProtectedRoute requiredRole="employer">
            <EmployerPostViewApplicants />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <ProtectedPublic>
        <SingleEntryAuth />
      </ProtectedPublic>
    ),
  },
  {
    path: "/success",
    element: <JobPostSuccessPage />,
  },
  {
    path: "/create-job-post",
    element: (
      <ProtectedRoute requiredRole="employer">
        <CombinedEmployerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:employerId",
    element: <ChatPage />,
  },
  {
    path: "/employer-chat",
    element: <ChatPageEmployer />,
  },
  {
    path: "/saved-jobs",
    element: <SavePagejobpost />,
  },
  {
    path: "/update-company-profile",
    element: (
      <ProtectedRoute requiredRole="employer">
        <CompanyProfileForm />
      </ProtectedRoute>
    ),
  },
  {
    path:"*",
    element:<FallbackPage/>
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
};

export default App;
