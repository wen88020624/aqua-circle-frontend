import { useEffect, useState } from 'react'
import { aquariumApi, equipmentApi } from '../../shared/api'
import type { Aquarium, Equipment, EquipmentStatus, EquipmentTag } from '../../shared/types'
import { EQUIPMENT_STATUSES, EQUIPMENT_TAGS, getTodayDate } from '../../shared/utils/constants'
import './shared.css'

type FormData = {
  name: string
  tag: EquipmentTag
  status: EquipmentStatus
  price: string
  notes: string
  purchaseDate: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  name: '',
  tag: '燈具',
  status: '使用中',
  price: '',
  notes: '',
  purchaseDate: getTodayDate(),
  aquariumId: '',
})

type EquipmentFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function EquipmentForm({
  data,
  setData,
  onSubmit,
  aquariums,
  title,
  isEdit,
  onCancel,
}: EquipmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>名稱 *</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Tag *</label>
          <select
            value={data.tag}
            onChange={(e) => setData({ ...data, tag: e.target.value as EquipmentTag })}
            required
          >
            {EQUIPMENT_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>狀態 *</label>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value as EquipmentStatus })}
            required
          >
            {EQUIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>金額 *</label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            required
            min="0"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>購買日期</label>
          <input
            type="date"
            value={data.purchaseDate}
            onChange={(e) => setData({ ...data, purchaseDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>所屬魚缸</label>
          <select
            value={data.aquariumId}
            onChange={(e) => setData({ ...data, aquariumId: e.target.value })}
          >
            <option value="">無</option>
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

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
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
      const [eqs, aqs] = await Promise.all([equipmentApi.findAll(), aquariumApi.findAll()])
      setEquipment(eqs)
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
      await equipmentApi.create({
        name: formData.name,
        tag: formData.tag,
        status: formData.status,
        price: Number(formData.price),
        notes: formData.notes || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        aquariumId: formData.aquariumId ? Number(formData.aquariumId) : undefined,
      })
      setShowForm(false)
      setFormData(emptyForm())
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    }
  }

  const handleEdit = (eq: Equipment) => {
    setEditingId(eq.id)
    setShowForm(false)
    setEditData({
      name: eq.name,
      tag: eq.tag,
      status: eq.status,
      price: String(eq.price),
      notes: eq.notes ?? '',
      purchaseDate: eq.purchaseDate ?? '',
      aquariumId: eq.aquariumId != null ? String(eq.aquariumId) : '',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await equipmentApi.update({
        id: editingId,
        name: editData.name,
        tag: editData.tag,
        status: editData.status,
        price: Number(editData.price),
        notes: editData.notes || undefined,
        purchaseDate: editData.purchaseDate || undefined,
        aquariumId: editData.aquariumId ? Number(editData.aquariumId) : undefined,
      })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個設備嗎？')) return
    try {
      await equipmentApi.remove(id)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  if (loading) return <div className="loading">載入中...</div>
  if (error) return <div className="error">錯誤：{error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>設備管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增設備'}
        </button>
      </div>

      {showForm && !editingId && (
        <EquipmentForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          title="新增設備"
          isEdit={false}
        />
      )}
      {editingId && (
        <EquipmentForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          title="編輯設備"
          isEdit={true}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>Tag</th>
              <th>狀態</th>
              <th>金額</th>
              <th>購買日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq) => (
              <tr key={eq.id}>
                <td>{eq.name}</td>
                <td>{eq.tag}</td>
                <td>{eq.status}</td>
                <td>${eq.price}</td>
                <td>{eq.purchaseDate || '-'}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleEdit(eq)} className="btn-primary">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(eq.id)} className="btn-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {equipment.length === 0 && <div className="empty-state">尚無設備資料</div>}
      </div>
    </div>
  )
}
