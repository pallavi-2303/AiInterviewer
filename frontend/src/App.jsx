import { useState } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layout/publicLayout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUp";
import AuthenticationLayout from "./layout/AuthenticationLayout";
import SignInPage from "./pages/SignIn";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "./layout/ProtectedLayout";
import GeneratePage from "./pages/GeneratePage";
import DashBoard from "./components/ui/DashBoard";
import CreateEditPage from "./pages/CreateEditPage";
import SaveUser from "./Hooks/AuthUser";
import MoackLoadPage from "./pages/MoackLoadPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import FeedBack from "./pages/FeedBack";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Resume from "./pages/Resume";
import CoverLetter from "./pages/CoverLetter";
import AiCoverLetterPage from "./pages/AiCoverLetterPage";
import NewCoverLetterPage from "./pages/NewCoverLetter";
import EditCoverLetterPage from "./components/ui/EditCoverLetterPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* public routes  */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/contact" element={<ContactUs />}></Route>
            <Route path="/services" element={<Services />}></Route>
            <Route path="/about" element={<AboutUs />}></Route>
           
          </Route>
          {/* Authentication Layout */}
          <Route element={<AuthenticationLayout />}>
            <Route path="/signin/*" element={<SignInPage />}></Route>
            <Route path="/signup/*" element={<SignUpPage />}></Route>
          </Route>
          {/* protected routes */}
          <Route
            element={
              <ProtectedRoute>
                
                <MainLayout />
              </ProtectedRoute>
            }
          >
          {/* add all the protected routes   */}
           <Route path="/resume" element={<Resume/>}></Route> 
           <Route path="/ai-cover-letter" element={<CoverLetter/>}></Route> 
           <Route path="/ai-cover-letter/new" element={<NewCoverLetterPage/>}></Route> 
           <Route path="/ai-cover-letter/:id" element={<EditCoverLetterPage/>}></Route>
           
          <Route path="/generate" element={<GeneratePage />}>
          
          <Route index element={<DashBoard/>}/>
          <Route path=":interviewId" element={<CreateEditPage/>}/>
          <Route path="interview/:interviewId" element={<MoackLoadPage/>}/>
        <Route path="interview/:interviewId/start" element={<MockInterviewPage/>}/>
        <Route path="feedback/:interviewId" element={<FeedBack/>}/>
          </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
