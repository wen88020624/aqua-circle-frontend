import { useEffect, useState } from 'react'
import { aquariumApi } from '../../shared/api'
import type { Aquarium, AquariumStatus } from '../../shared/types'
import { AQUARIUM_STATUSES, getTodayDate } from '../../shared/utils/constants'
import './AquariumList.css'

const emptyForm = () => ({
  name: '',
  length: '',
  width: '',
  height: '',
  status: '開缸' as AquariumStatus,
  setupDate: getTodayDate(),
  notes: '',
})

function estimatedLiters(l: number, w: number, h: number) {
  return ((l * w * h) / 1000).toFixed(1)
}

export function AquariumList() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState(emptyForm())

  useEffect(() => {
    loadAquariums()
  }, [])

  const loadAquariums = async () => {
    try {
      setLoading(true)
      const data = await aquariumApi.findAll()
      setAquariums(data)
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
      await aquariumApi.create({
        name: formData.name,
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        status: formData.status,
        setupDate: formData.setupDate,
        notes: formData.notes || undefined,
      })
      setShowForm(false)
      setFormData(emptyForm())
      loadAquariums()
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    }
  }

  const handleEdit = (aq: Aquarium) => {
    setEditingId(aq.id)
    setEditData({
      name: aq.name,
      length: String(aq.length),
      width: String(aq.width),
      height: String(aq.height),
      status: aq.status,
      setupDate: aq.setupDate,
      notes: aq.notes ?? '',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await aquariumApi.update({
        id: editingId,
        name: editData.name,
        length: Number(editData.length),
        width: Number(editData.width),
        height: Number(editData.height),
        status: editData.status,
        setupDate: editData.setupDate,
        notes: editData.notes || undefined,
      })
      setEditingId(null)
      loadAquariums()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個魚缸嗎？\n（相關生物與記錄將一併刪除，設備與耗材會變為未歸屬）'))
      return
    try {
      await aquariumApi.remove(id)
      loadAquariums()
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  if (loading) return <div className="loading">載入中...</div>
  if (error)
    return (
      <div className="error">
        錯誤：{error} <button onClick={loadAquariums}>重試</button>
      </div>
    )

  return (
    <div className="aquarium-list">
      <div className="page-header">
        <h1>魚缸管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增魚缸'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="aquarium-form">
          <h2>新增魚缸</h2>
          <div className="form-group">
            <label>名稱 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>長度（公分）*</label>
              <input
                type="number"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>寬度（公分）*</label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>高度（公分）*</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>狀態 *</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as AquariumStatus })
              }
              required
            >
              {AQUARIUM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>開缸日期 *</label>
            <input
              type="date"
              value={formData.setupDate}
              onChange={(e) => setFormData({ ...formData, setupDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>備註</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary">
            建立
          </button>
        </form>
      )}

      <div className="aquarium-grid">
        {aquariums.map((aquarium) => (
          <div key={aquarium.id} className="aquarium-card">
            {editingId === aquarium.id ? (
              <form onSubmit={handleUpdate} className="edit-form">
                <h3>編輯魚缸</h3>
                <div className="form-group">
                  <label>名稱 *</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>長（cm）</label>
                    <input
                      type="number"
                      value={editData.length}
                      onChange={(e) => setEditData({ ...editData, length: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>寬（cm）</label>
                    <input
                      type="number"
                      value={editData.width}
                      onChange={(e) => setEditData({ ...editData, width: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>高（cm）</label>
                    <input
                      type="number"
                      value={editData.height}
                      onChange={(e) => setEditData({ ...editData, height: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>狀態</label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value as AquariumStatus })
                    }
                  >
                    {AQUARIUM_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>開缸日期</label>
                  <input
                    type="date"
                    value={editData.setupDate}
                    onChange={(e) => setEditData({ ...editData, setupDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>備註</label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="card-actions">
                  <button type="submit" className="btn-primary">
                    儲存
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    取消
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3>{aquarium.name}</h3>
                <div className="aquarium-info">
                  <p>
                    尺寸：{aquarium.length} × {aquarium.width} × {aquarium.height} 公分
                  </p>
                  <p>
                    估算容量：{estimatedLiters(aquarium.length, aquarium.width, aquarium.height)} L
                  </p>
                  <p>狀態：{aquarium.status}</p>
                  <p>開缸日期：{aquarium.setupDate}</p>
                  {aquarium.notes && <p>備註：{aquarium.notes}</p>}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(aquarium)} className="btn-primary">
                    編輯
                  </button>
                  <button onClick={() => handleDelete(aquarium.id)} className="btn-danger">
                    刪除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {aquariums.length === 0 && <p className="empty-state">尚無魚缸資料</p>}
      </div>
    </div>
  )
}
