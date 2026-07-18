import { useEffect, useState } from 'react'
import { aquariumApi, medicationApi } from '../../shared/api'
import type { Aquarium, MedicationRecord, MedicationTag } from '../../shared/types'
import { getTodayDate, MEDICATION_TAGS } from '../../shared/utils/constants'
import './shared.css'

type FormData = {
  medicationName: string
  tag: MedicationTag
  dosage: string
  date: string
  notes: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  medicationName: '',
  tag: '抗生素',
  dosage: '',
  date: getTodayDate(),
  notes: '',
  aquariumId: '',
})

type MedicationFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function MedicationForm({
  data,
  setData,
  onSubmit,
  aquariums,
  title,
  isEdit,
  onCancel,
}: MedicationFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>下藥名稱 *</label>
          <input
            type="text"
            value={data.medicationName}
            onChange={(e) => setData({ ...data, medicationName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Tag *</label>
          <select
            value={data.tag}
            onChange={(e) => setData({ ...data, tag: e.target.value as MedicationTag })}
            required
          >
            {MEDICATION_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>用量（mg/L）*</label>
          <input
            type="number"
            value={data.dosage}
            onChange={(e) => setData({ ...data, dosage: e.target.value })}
            required
            min="0"
            step="0.1"
          />
        </div>
      </div>
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

export function MedicationList() {
  const [records, setRecords] = useState<MedicationRecord[]>([])
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
      const [recs, aqs] = await Promise.all([medicationApi.findAll(), aquariumApi.findAll()])
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
      await medicationApi.create({
        medicationName: formData.medicationName,
        tag: formData.tag,
        dosage: Number(formData.dosage),
        date: formData.date,
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

  const handleEdit = (rec: MedicationRecord) => {
    setEditingId(rec.id)
    setShowForm(false)
    setEditData({
      medicationName: rec.medicationName,
      tag: rec.tag,
      dosage: String(rec.dosage),
      date: rec.date,
      notes: rec.notes ?? '',
      aquariumId: String(rec.aquariumId),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await medicationApi.update({
        id: editingId,
        medicationName: editData.medicationName,
        tag: editData.tag,
        dosage: Number(editData.dosage),
        date: editData.date,
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
      await medicationApi.remove(id)
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
        <h1>下藥記錄管理</h1>
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
        <MedicationForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          title="新增下藥記錄"
          isEdit={false}
        />
      )}
      {editingId && (
        <MedicationForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          title="編輯下藥記錄"
          isEdit={true}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>下藥名稱</th>
              <th>Tag</th>
              <th>用量（mg/L）</th>
              <th>魚缸</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.medicationName}</td>
                <td>{record.tag}</td>
                <td>{record.dosage}</td>
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
        {records.length === 0 && <div className="empty-state">尚無下藥記錄</div>}
      </div>
    </div>
  )
}
