import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import SavedDocumentsPage from './features/documents/pages/SavedDocumentsPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<SavedDocumentsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
