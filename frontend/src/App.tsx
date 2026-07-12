import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage/HomePage'
import { PeoplePage } from './pages/PeoplePage/PeoplePage'
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage'
import { TotalsPage } from './pages/TotalsPage/TotalsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pessoas" element={<PeoplePage />} />
        <Route path="/transacoes" element={<TransactionsPage />} />
        <Route path="/totais" element={<TotalsPage />} />
      </Route>
    </Routes>
  )
}

export default App