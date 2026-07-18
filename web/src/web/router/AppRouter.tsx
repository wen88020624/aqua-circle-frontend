import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { AquariumList } from '../pages/AquariumList'
import { ConsumableList } from '../pages/ConsumableList'
import { EquipmentList } from '../pages/EquipmentList'
import { FeedingList } from '../pages/FeedingList'
import { MedicationList } from '../pages/MedicationList'
import { OrganismList } from '../pages/OrganismList'
import { WaterChangeList } from '../pages/WaterChangeList'
import { WaterQualityList } from '../pages/WaterQualityList'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/aquariums" replace />} />
          <Route path="/aquariums" element={<AquariumList />} />
          <Route path="/organisms" element={<OrganismList />} />
          <Route path="/feedings" element={<FeedingList />} />
          <Route path="/water-changes" element={<WaterChangeList />} />
          <Route path="/medications" element={<MedicationList />} />
          <Route path="/water-quality" element={<WaterQualityList />} />
          <Route path="/consumables" element={<ConsumableList />} />
          <Route path="/equipment" element={<EquipmentList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
