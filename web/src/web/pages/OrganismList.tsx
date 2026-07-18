import { useEffect, useState } from 'react'
import { aquariumApi, organismApi } from '../../shared/api'
import type { Aquarium, Gender, HealthStatus, Organism, OrganismTag } from '../../shared/types'
import { GENDERS, getTodayDate, HEALTH_STATUSES, ORGANISM_TAGS } from '../../shared/utils/constants'
import './shared.css'

type FormData = {
  name: string
  tag: OrganismTag
  purchaseDate: string
  price: string
  healthStatus: string
  gender: string
  length: string
  notes: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  name: '',
  tag: '上層魚',
  purchaseDate: getTodayDate(),
  price: '',
  healthStatus: '',
  gender: '',
  length: '',
  notes: '',
  aquariumId: '',
})

type OrganismFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function OrganismForm({
  data,
  setData,
  onSubmit,
  aquariums,
  title,
  isEdit,
  onCancel,
}: OrganismFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-group">
        <label>名稱 *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tag *</label>
          <select
            value={data.tag}
            onChange={(e) => setData({ ...data, tag: e.target.value as OrganismTag })}
            required
          >
            {ORGANISM_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
          <label>金額</label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            min="0"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>健康狀態</label>
          <select
            value={data.healthStatus}
            onChange={(e) => setData({ ...data, healthStatus: e.target.value })}
          >
            <option value="">請選擇</option>
            {HEALTH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>性別</label>
          <select
            value={data.gender}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
          >
            <option value="">請選擇</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>長度（公分）</label>
          <input
            type="number"
            value={data.length}
            onChange={(e) => setData({ ...data, length: e.target.value })}
            min="0"
          />
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

export function OrganismList() {
  const [organisms, setOrganisms] = useState<Organism[]>([])
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
      const [orgs, aqs] = await Promise.all([organismApi.findAll(), aquariumApi.findAll()])
      setOrganisms(orgs)
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
      await organismApi.create({
        name: formData.name,
        tag: formData.tag,
        purchaseDate: formData.purchaseDate || undefined,
        price: Number(formData.price) || 0,
        healthStatus: (formData.healthStatus as HealthStatus) || undefined,
        gender: (formData.gender as Gender) || undefined,
        length: formData.length ? Number(formData.length) : undefined,
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

  const handleEdit = (org: Organism) => {
    setEditingId(org.id)
    setShowForm(false)
    setEditData({
      name: org.name,
      tag: org.tag,
      purchaseDate: org.purchaseDate ?? '',
      price: String(org.price),
      healthStatus: org.healthStatus ?? '',
      gender: org.gender ?? '',
      length: org.length != null ? String(org.length) : '',
      notes: org.notes ?? '',
      aquariumId: String(org.aquariumId),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await organismApi.update({
        id: editingId,
        name: editData.name,
        tag: editData.tag,
        purchaseDate: editData.purchaseDate || undefined,
        price: Number(editData.price) || 0,
        healthStatus: (editData.healthStatus as HealthStatus) || undefined,
        gender: (editData.gender as Gender) || undefined,
        length: editData.length ? Number(editData.length) : undefined,
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
    if (!confirm('確定要刪除這個生物嗎？')) return
    try {
      await organismApi.remove(id)
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
        <h1>生物管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增生物'}
        </button>
      </div>

      {showForm && !editingId && (
        <OrganismForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          title="新增生物"
          isEdit={false}
        />
      )}
      {editingId && (
        <OrganismForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          title="編輯生物"
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
              <th>魚缸</th>
              <th>金額</th>
              <th>健康狀態</th>
              <th>性別</th>
              <th>長度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {organisms.map((org) => (
              <tr key={org.id}>
                <td>{org.name}</td>
                <td>{org.tag}</td>
                <td>{aquariumMap.get(org.aquariumId) ?? '-'}</td>
                <td>${org.price}</td>
                <td>{org.healthStatus || '-'}</td>
                <td>{org.gender || '-'}</td>
                <td>{org.length != null ? `${org.length} 公分` : '-'}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleEdit(org)} className="btn-primary">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(org.id)} className="btn-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {organisms.length === 0 && <div className="empty-state">尚無生物資料</div>}
      </div>
    </div>
  )
}
