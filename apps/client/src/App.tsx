import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkflowList } from "./components/WorkflowList/WorkflowList";
import { EditorPage } from "./pages/EditorPage";
import { ToastContainer } from "./components/Toast/Toast";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkflowList />} />
        <Route path="/workflow/:id" element={<EditorPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
