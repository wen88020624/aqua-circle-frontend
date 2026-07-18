import { useEffect, useState } from 'react'
import { aquariumApi, waterQualityApi } from '../../shared/api'
import type { Aquarium, WaterQualityRecord, WaterQualityTestType } from '../../shared/types'
import { getTodayDate, WATER_QUALITY_TEST_TYPES } from '../../shared/utils/constants'
import './shared.css'

type FormData = {
  testType: WaterQualityTestType
  testDate: string
  value: string
  notes: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  testType: 'NH3+NH4',
  testDate: getTodayDate(),
  value: '',
  notes: '',
  aquariumId: '',
})

type WaterQualityFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function WaterQualityForm({
  data,
  setData,
  onSubmit,
  aquariums,
  title,
  isEdit,
  onCancel,
}: WaterQualityFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>檢測種類 *</label>
          <select
            value={data.testType}
            onChange={(e) => setData({ ...data, testType: e.target.value as WaterQualityTestType })}
            required
          >
            {WATER_QUALITY_TEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>檢測日期 *</label>
          <input
            type="date"
            value={data.testDate}
            onChange={(e) => setData({ ...data, testDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>數值 *</label>
          <input
            type="number"
            value={data.value}
            onChange={(e) => setData({ ...data, value: e.target.value })}
            required
            step="0.01"
          />
        </div>
      </div>
      <div className="form-group">
        <label>所屬魚缸 *</label>
        <select
          value={data.aquariumId}
          onChange={(e) => setData({ ...data, aquariumId: e.target.value })}
          required
        >
          <option value="">請選擇</option>
          {aquariums.map((aq) => (
            <option key={aq.id} value={aq.id}>
              {aq.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>備註</label>
        <textarea
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          rows={2}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEdit ? '儲存' : '建立'}
        </button>
        {isEdit && onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

export function WaterQualityList() {
  const [records, setRecords] = useState<WaterQualityRecord[]>([])
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<FormData>(emptyForm())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [recs, aqs] = await Promise.all([waterQualityApi.findAll(), aquariumApi.findAll()])
      setRecords(recs)
      setAquariums(aqs)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await waterQualityApi.create({
        testType: formData.testType,
        testDate: formData.testDate,
        value: Number(formData.value),
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      })
      setShowForm(false)
      setFormData(emptyForm())
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    }
  }

  const handleEdit = (rec: WaterQualityRecord) => {
    setEditingId(rec.id)
    setShowForm(false)
    setEditData({
      testType: rec.testType,
      testDate: rec.testDate,
      value: String(rec.value),
      notes: rec.notes ?? '',
      aquariumId: String(rec.aquariumId),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await waterQualityApi.update({
        id: editingId,
        testType: editData.testType,
        testDate: editData.testDate,
        value: Number(editData.value),
        notes: editData.notes || undefined,
        aquariumId: Number(editData.aquariumId),
      })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個記錄嗎？')) return
    try {
      await waterQualityApi.remove(id)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  if (loading) return <div className="loading">載入中...</div>
  if (error) return <div className="error">錯誤：{error}</div>

  const aquariumMap = new Map(aquariums.map((aq) => [aq.id, aq.name]))

  return (
    <div>
      <div className="page-header">
        <h1>水質檢測記錄管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && !editingId && (
        <WaterQualityForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          title="新增水質檢測記錄"
          isEdit={false}
        />
      )}
      {editingId && (
        <WaterQualityForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          title="編輯水質檢測記錄"
          isEdit={true}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>檢測日期</th>
              <th>檢測種類</th>
              <th>數值</th>
              <th>魚缸</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.testDate}</td>
                <td>{record.testType}</td>
                <td>{record.value}</td>
                <td>{aquariumMap.get(record.aquariumId) ?? '-'}</td>
                <td>{record.notes || '-'}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleEdit(record)} className="btn-primary">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="btn-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <div className="empty-state">尚無水質檢測記錄</div>}
      </div>
    </div>
  )
}
