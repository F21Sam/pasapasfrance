import { useState, useRef } from 'react'
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { DEMARCHES } from '@/utils/mockData'

const INIT_DOCS = DEMARCHES.flatMap(d =>
  d.documents.map(doc => ({
    id: `${d.id}-${doc}`,
    nom: doc,
    demarche: d.titre,
    statut: Math.random() > 0.6 ? 'fourni' : Math.random() > 0.4 ? 'manquant' : 'expire',
    fichier: null,
    taille: null,
  }))
).filter((d, i, arr) => arr.findIndex(x => x.nom === d.nom) === i) // deduplicate

const STATUS_MAP = {
  fourni:   { label: 'Fourni',    cls: 'badge-success', icon: <CheckCircle size={14} className="text-success" /> },
  manquant: { label: 'Manquant',  cls: 'badge-warning', icon: <AlertCircle size={14} className="text-warning" /> },
  expire:   { label: 'Expiré',    cls: 'bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-pill',
              icon: <Clock size={14} className="text-red-400" /> },
}

export default function DocumentsPage() {
  const [docs, setDocs]   = useState(INIT_DOCS)
  const [filter, setFilter] = useState('Tous')
  const inputRef          = useRef(null)
  const [uploading, setUploading] = useState(null)

  const filters = ['Tous', 'Fournis', 'Manquants', 'Expirés']

  const filtered = docs.filter(d => {
    if (filter === 'Fournis')   return d.statut === 'fourni'
    if (filter === 'Manquants') return d.statut === 'manquant'
    if (filter === 'Expirés')   return d.statut === 'expire'
    return true
  })

  const handleUpload = async (docId, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Fichier trop volumineux (max 5 Mo)'); return }
    setUploading(docId)
    await new Promise(r => setTimeout(r, 900))
    setDocs(prev => prev.map(d =>
      d.id === docId
        ? { ...d, statut: 'fourni', fichier: file.name, taille: (file.size / 1024).toFixed(0) + ' Ko' }
        : d
    ))
    setUploading(null)
  }

  const handleDelete = (docId) => {
    setDocs(prev => prev.map(d =>
      d.id === docId ? { ...d, statut: 'manquant', fichier: null, taille: null } : d
    ))
  }

  const fournis   = docs.filter(d => d.statut === 'fourni').length
  const manquants = docs.filter(d => d.statut === 'manquant').length
  const expires   = docs.filter(d => d.statut === 'expire').length

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-navy text-3xl mb-1">Mes documents</h1>
        <p className="text-muted text-sm font-light">Gérez et uploadez tous vos justificatifs.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card px-5 py-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success flex-shrink-0" />
          <div><p className="text-2xl font-serif font-bold text-success">{fournis}</p><p className="text-xs text-muted">Fournis</p></div>
        </div>
        <div className="card px-5 py-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-warning flex-shrink-0" />
          <div><p className="text-2xl font-serif font-bold text-warning">{manquants}</p><p className="text-xs text-muted">Manquants</p></div>
        </div>
        <div className="card px-5 py-4 flex items-center gap-3">
          <Clock size={20} className="text-red-400 flex-shrink-0" />
          <div><p className="text-2xl font-serif font-bold text-red-400">{expires}</p><p className="text-xs text-muted">Expirés</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-pill text-xs font-semibold border transition-all ${
              filter === f ? 'bg-navy text-white border-navy' : 'bg-white text-slate border-border hover:border-navy/40'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Docs list */}
      <div className="flex flex-col gap-3">
        {filtered.map(doc => {
          const s = STATUS_MAP[doc.statut]
          return (
            <div key={doc.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pale flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-navy" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-semibold text-navy">{doc.nom}</p>
                  <span className={s.cls}>{s.label}</span>
                </div>
                <p className="text-xs text-muted font-light">{doc.demarche}{doc.taille ? ` · ${doc.taille}` : ''}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {doc.statut === 'fourni' ? (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => handleUpload(doc.id, e.target.files[0])}
                      id={`upload-${doc.id}`}
                    />
                    <label
                      htmlFor={`upload-${doc.id}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold cursor-pointer transition-all ${
                        uploading === doc.id
                          ? 'bg-border text-muted cursor-not-allowed'
                          : 'bg-vivid text-white hover:bg-blue-500'
                      }`}
                    >
                      {uploading === doc.id
                        ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        : <Upload size={12} />}
                      {uploading === doc.id ? 'Upload...' : 'Uploader'}
                    </label>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted mt-4 font-light">Formats acceptés : PDF, JPG, PNG · Taille max : 5 Mo</p>
    </div>
  )
}
