import { useEffect, useState } from 'react'
import { aquariumApi, waterChangeApi } from '../../shared/api'
import type { Aquarium, WaterChangeRecord } from '../../shared/types'
import { getTodayDate } from '../../shared/utils/constants'
import './shared.css'

const RATIO_OPTIONS = [
  { value: '0.33', label: '1/3' },
  { value: '0.5', label: '1/2' },
  { value: '1.0', label: '全換' },
]

const getRatioLabel = (ratio: number) => {
  if (ratio >= 1.0) return '全換'
  if (ratio >= 0.49) return '1/2'
  return '1/3'
}

type FormData = {
  date: string
  waterChangeRatio: string
  notes: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  date: getTodayDate(),
  waterChangeRatio: '',
  notes: '',
  aquariumId: '',
})

type WaterChangeFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function WaterChangeForm({
  data,
  setData,
  onSubmit,
  aquariums,
  title,
  isEdit,
  onCancel,
}: WaterChangeFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>日期 *</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />
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
          <label>換水量 *</label>
          <select
            value={data.waterChangeRatio}
            onChange={(e) => setData({ ...data, waterChangeRatio: e.target.value })}
            required
          >
            <option value="">請選擇</option>
            {RATIO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
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

export function WaterChangeList() {
  const [records, setRecords] = useState<WaterChangeRecord[]>([])
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
      const [recs, aqs] = await Promise.all([waterChangeApi.findAll(), aquariumApi.findAll()])
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
      await waterChangeApi.create({
        date: formData.date,
        waterChangeRatio: Number(formData.waterChangeRatio),
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

  const handleEdit = (rec: WaterChangeRecord) => {
    setEditingId(rec.id)
    setShowForm(false)
    setEditData({
      date: rec.date,
      waterChangeRatio: String(rec.waterChangeRatio),
      notes: rec.notes ?? '',
      aquariumId: String(rec.aquariumId),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await waterChangeApi.update({
        id: editingId,
        date: editData.date,
        waterChangeRatio: Number(editData.waterChangeRatio),
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
      await waterChangeApi.remove(id)
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
        <h1>換水記錄管理</h1>
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
        <WaterChangeForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          title="新增換水記錄"
          isEdit={false}
        />
      )}
      {editingId && (
        <WaterChangeForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          title="編輯換水記錄"
          isEdit={true}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>魚缸</th>
              <th>換水量</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{aquariumMap.get(record.aquariumId) ?? '-'}</td>
                <td>{getRatioLabel(record.waterChangeRatio)}</td>
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
        {records.length === 0 && <div className="empty-state">尚無換水記錄</div>}
      </div>
    </div>
  )
}
