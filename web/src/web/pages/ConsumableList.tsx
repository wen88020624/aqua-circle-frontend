import { useEffect, useState } from 'react'
import { aquariumApi, consumableApi } from '../../shared/api'
import type { Aquarium, Consumable, ConsumableStatus, ConsumableTag } from '../../shared/types'
import { CONSUMABLE_STATUSES, CONSUMABLE_TAGS, getTodayDate } from '../../shared/utils/constants'
import './shared.css'

const emptyForm = () => ({
  name: '',
  tag: '飼料' as ConsumableTag,
  quantity: '',
  price: '',
  notes: '',
  purchaseDate: getTodayDate(),
  expiryDate: '',
  aquariumId: '',
})

export function ConsumableList() {
  const [consumables, setConsumables] = useState<Consumable[]>([])
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<
    ReturnType<typeof emptyForm> & { status: ConsumableStatus | '' }
  >({
    ...emptyForm(),
    status: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cons, aqs] = await Promise.all([consumableApi.findAll(), aquariumApi.findAll()])
      setConsumables(cons)
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
      await consumableApi.create({
        name: formData.name,
        tag: formData.tag,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        notes: formData.notes || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        aquariumId: formData.aquariumId ? Number(formData.aquariumId) : undefined,
      })
      setShowForm(false)
      setFormData(emptyForm())
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    }
  }

  const handleEdit = (c: Consumable) => {
    setEditingId(c.id)
    setShowForm(false)
    setEditData({
      name: c.name,
      tag: c.tag,
      quantity: String(c.quantity),
      price: String(c.price),
      notes: c.notes ?? '',
      purchaseDate: c.purchaseDate ?? '',
      expiryDate: c.expiryDate ?? '',
      aquariumId: c.aquariumId !== null && c.aquariumId !== undefined ? String(c.aquariumId) : '',
      status: c.status,
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await consumableApi.update({
        id: editingId,
        name: editData.name,
        tag: editData.tag,
        quantity: Number(editData.quantity),
        price: Number(editData.price),
        notes: editData.notes || undefined,
        purchaseDate: editData.purchaseDate || undefined,
        expiryDate: editData.expiryDate || undefined,
        aquariumId: editData.aquariumId ? Number(editData.aquariumId) : undefined,
        ...(editData.status ? { status: editData.status as ConsumableStatus } : {}),
      })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個耗材嗎？')) return
    try {
      await consumableApi.remove(id)
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
        <h1>耗材管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增耗材'}
        </button>
      </div>

      {showForm && !editingId && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增耗材</h2>
          <div className="form-row">
            <div className="form-group">
              <label>名稱 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Tag *</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as ConsumableTag })}
                required
              >
                {CONSUMABLE_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>數量 *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>金額 *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>到期日期</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>所屬魚缸</label>
              <select
                value={formData.aquariumId}
                onChange={(e) => setFormData({ ...formData, aquariumId: e.target.value })}
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
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>
          <button type="submit" className="btn-primary">
            建立
          </button>
        </form>
      )}

      {editingId && (
        <form onSubmit={handleUpdate} className="form-container">
          <h2>編輯耗材</h2>
          <div className="form-row">
            <div className="form-group">
              <label>名稱 *</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Tag</label>
              <select
                value={editData.tag}
                onChange={(e) => setEditData({ ...editData, tag: e.target.value as ConsumableTag })}
              >
                {CONSUMABLE_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>數量 *</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>狀態</label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value as ConsumableStatus })
                }
              >
                {CONSUMABLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
                value={editData.purchaseDate}
                onChange={(e) => setEditData({ ...editData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>到期日期</label>
              <input
                type="date"
                value={editData.expiryDate}
                onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>所屬魚缸</label>
              <select
                value={editData.aquariumId}
                onChange={(e) => setEditData({ ...editData, aquariumId: e.target.value })}
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
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              rows={2}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              儲存
            </button>
            <button type="button" className="btn-secondary" onClick={() => setEditingId(null)}>
              取消
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>Tag</th>
              <th>數量</th>
              <th>狀態</th>
              <th>金額</th>
              <th>到期日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {consumables.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.tag}</td>
                <td>{c.quantity}</td>
                <td>{c.status}</td>
                <td>${c.price}</td>
                <td>{c.expiryDate || '-'}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleEdit(c)} className="btn-primary">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consumables.length === 0 && <div className="empty-state">尚無耗材資料</div>}
      </div>
    </div>
  )
}
