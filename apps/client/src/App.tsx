import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkflowList } from "./components/WorkflowList/WorkflowList";
import { EditorPage } from "./pages/EditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkflowList />} />
        <Route path="/workflow/:id" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
