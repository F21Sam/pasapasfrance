import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Clock, RefreshCw, Eye, X, Download, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { documentAPI, stepAPI } from '@/services/api'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

// ── Modale de prévisualisation ──────────────────────
function PreviewModal({ doc, onClose }) {
  if (!doc) return null
  const fileUrl = `${API_URL}/${doc.chemin?.replace(/\\/g, '/')}`
  const isPdf   = doc.mimeType === 'application/pdf'
  const isImage = doc.mimeType?.startsWith('image/')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-float w-full max-w-3xl max-h-[90vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-navy" />
            <div>
              <p className="font-semibold text-navy text-sm">{doc.nom}</p>
              <p className="text-xs text-muted">{doc.mimeType} · {doc.taille ? `${(doc.taille / 1024).toFixed(0)} Ko` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={fileUrl} download={doc.nom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold bg-pale text-navy hover:bg-border transition-colors">
              <Download size={12} /> Télécharger
            </a>
            <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-navy hover:bg-app-bg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-0">
          {isPdf && <iframe src={fileUrl} className="w-full h-full min-h-[500px] rounded-xl border border-border" title={doc.nom} />}
          {isImage && (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <img src={fileUrl} alt={doc.nom} className="max-w-full max-h-[600px] rounded-xl object-contain shadow-card" />
            </div>
          )}
          {!isPdf && !isImage && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <FileText size={48} className="text-border" />
              <p className="text-muted text-sm font-light">Prévisualisation non disponible.</p>
              <a href={fileUrl} download={doc.nom} className="btn-primary text-sm">Télécharger le fichier</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Documents requis par démarche (accordéon) ──────
const DOCS_PAR_DEMARCHE = {
  'Titre de séjour':         ['Passeport en cours de validité', 'Visa long séjour', 'Justificatif de domicile', 'Photos d\'identité', 'Formulaire CERFA'],
  'Sécurité sociale (CPAM)': ['Titre de séjour', 'RIB français', 'Justificatif d\'identité', 'Justificatif de domicile'],
  'Compte bancaire':         ['Titre de séjour', 'Justificatif de domicile', 'RIB étranger ou argent liquide'],
  'CAF – Aide au logement':  ['RIB français', 'Contrat de bail signé', 'Avis d\'imposition', 'Titre de séjour'],
  'Mutuelle santé':          ['Numéro de Sécurité sociale', 'RIB français'],
  'Inscription Pôle emploi': ['Titre de séjour', 'CV à jour', 'Attestation employeur'],
}

function DemarcheDocuments({ demarche, uploadedDocs, onUpload, uploading }) {
  const [open, setOpen] = useState(false)
  const requis = DOCS_PAR_DEMARCHE[demarche.titre] ?? []

  const priorityBadge = { URGENTE:'badge-warning', IMPORTANTE:'badge-navy', OPTIONNELLE:'badge-muted' }[demarche.priorite] ?? 'badge-muted'
  const statusBadge   = { TERMINE:'badge-success', EN_COURS:'badge-warning', BLOQUE:'badge-muted', A_FAIRE:'badge-navy' }[demarche.statut] ?? 'badge-muted'

  const isUploaded = (docNom) =>
    uploadedDocs.some(d =>
      d.nom.toLowerCase().includes(docNom.toLowerCase()) ||
      docNom.toLowerCase().includes(d.nom.toLowerCase())
    )

  const nbFournis   = requis.filter(d => isUploaded(d)).length
  const nbManquants = requis.length - nbFournis

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white hover:bg-pale transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <FileText size={15} className="text-navy flex-shrink-0" />
          <span className="font-semibold text-navy text-sm">{demarche.titre}</span>
          <span className={`${priorityBadge} text-[.65rem]`}>{demarche.priorite?.toLowerCase()}</span>
          <span className={`${statusBadge} text-[.65rem]`}>{demarche.statut?.toLowerCase().replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {nbFournis > 0 && <span className="badge-success text-[.65rem]">{nbFournis} fourni{nbFournis > 1 ? 's' : ''}</span>}
          {nbManquants > 0 && <span className="badge-warning text-[.65rem]">{nbManquants} manquant{nbManquants > 1 ? 's' : ''}</span>}
          {open ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 pt-2 bg-app-bg border-t border-border">
          {requis.length === 0 ? (
            <p className="text-xs text-muted font-light py-2">Aucun document spécifique requis.</p>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {requis.map((docNom, i) => {
                const uploaded = isUploaded(docNom)
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    uploaded ? 'bg-success-light border-success/20' : 'bg-white border-border'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      uploaded ? 'bg-success/10' : 'bg-pale'
                    }`}>
                      {uploaded
                        ? <CheckCircle size={15} className="text-success" />
                        : <FileText size={15} className="text-navy" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${uploaded ? 'text-success' : 'text-navy'}`}>{docNom}</p>
                      <p className="text-[.65rem] text-muted mt-0.5">
                        {uploaded ? '✓ Document fourni' : 'Document manquant'}
                      </p>
                    </div>
                    {!uploaded && (
                      <>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                          id={`req-${demarche.id}-${i}`}
                          onChange={e => onUpload(e.target.files[0], docNom, demarche.id)} />
                        <label htmlFor={`req-${demarche.id}-${i}`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold cursor-pointer transition-all flex-shrink-0 ${
                            uploading === docNom ? 'bg-border text-muted cursor-not-allowed' : 'bg-vivid text-white hover:bg-blue-500'
                          }`}>
                          {uploading === docNom
                            ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            : <Upload size={12} />}
                          {uploading === docNom ? 'Upload...' : 'Uploader'}
                        </label>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-xs text-muted font-light mt-3">
            Organisme : <span className="text-navy font-medium">{demarche.organisme}</span>
            {' · '}Délai estimé : <span className="text-navy font-medium">{demarche.delai}</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
const STATUS_MAP = {
  FOURNI:   { label: 'Fourni',   cls: 'badge-success' },
  MANQUANT: { label: 'Manquant', cls: 'badge-warning' },
  EXPIRE:   { label: 'Expiré',   cls: 'bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-pill' },
}

const FILTERS = ['Tous', 'Fournis', 'Manquants', 'Expirés']

export default function DocumentsPage() {
  const [docs, setDocs]           = useState([])
  const [demarches, setDemarches] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('Tous')
  const [uploading, setUploading] = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [error, setError]         = useState('')
  const [preview, setPreview]     = useState(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [docsRes, demarchesRes] = await Promise.all([
        documentAPI.getDocuments(),
        stepAPI.getSteps(),
      ])
      setDocs(docsRes.data ?? [])
      setDemarches(demarchesRes.data ?? [])
    } catch (err) {
      setError('Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file, docNom, stepId) => {
    if (!file) return
    setError('')
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) { setError('Format non supporté. PDF, JPG et PNG uniquement.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Fichier trop volumineux (max 5 Mo).'); return }
    setUploading(docNom)
    try {
      const formData = new FormData()
      formData.append('fichier', file)
      formData.append('nom', docNom || file.name)
      if (stepId) formData.append('stepId', String(stepId))
      await documentAPI.uploadDocument(formData)
      await fetchAll()
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'upload.")
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (docId) => {
    setDeleting(docId)
    try {
      await documentAPI.deleteDocument(docId)
      setDocs(prev => prev.filter(d => d.id !== docId))
      if (preview?.id === docId) setPreview(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = docs.filter(d => {
    if (filter === 'Fournis')   return d.statut === 'FOURNI'
    if (filter === 'Manquants') return d.statut === 'MANQUANT'
    if (filter === 'Expirés')   return d.statut === 'EXPIRE'
    return true
  })

  const fournis   = docs.filter(d => d.statut === 'FOURNI').length
  const tousLesRequis = demarches.flatMap(d => DOCS_PAR_DEMARCHE[d.titre] ?? [])
const manquants = tousLesRequis.filter(docNom =>
  !docs.some(d =>
    d.nom.toLowerCase().includes(docNom.toLowerCase()) ||
    docNom.toLowerCase().includes(d.nom.toLowerCase())
  )
).length
  const expires   = docs.filter(d => d.statut === 'EXPIRE').length

  return (
    <div className="p-8">
      <PreviewModal doc={preview} onClose={() => setPreview(null)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-navy text-3xl mb-1">Mes documents</h1>
          <p className="text-muted text-sm font-light">Gérez et uploadez tous vos justificatifs.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 text-xs text-slate hover:text-navy transition-colors">
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-warning-light border border-warning/30 text-warning text-sm rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-warning/60 hover:text-warning ml-4">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
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

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-vivid/30 border-t-vivid rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Documents requis par démarche ── */}
          {demarches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-semibold text-navy">Documents requis par démarche</h2>
                <span className="badge-navy">{demarches.length} démarches</span>
              </div>
              <div className="flex flex-col gap-2">
                {demarches.map(d => (
                  <DemarcheDocuments
                    key={d.id}
                    demarche={d}
                    uploadedDocs={docs}
                    onUpload={handleUpload}
                    uploading={uploading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Mes documents uploadés ── */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-semibold text-navy">Mes documents uploadés</h2>
              <span className="badge-navy">{docs.length}</span>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-pill text-xs font-semibold border transition-all ${
                    filter === f ? 'bg-navy text-white border-navy' : 'bg-white text-slate border-border hover:border-navy/40'
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filtered.length === 0 && (
                <div className="card p-10 text-center">
                  <FileText size={28} className="text-border mx-auto mb-2" />
                  <p className="text-muted font-light text-sm">Aucun document trouvé.</p>
                </div>
              )}
              {filtered.map(doc => {
                const s = STATUS_MAP[doc.statut] ?? STATUS_MAP.MANQUANT
                return (
                  <div key={doc.id} className="card p-4 flex items-center gap-4">
                    <div
                      onClick={() => doc.statut === 'FOURNI' && setPreview(doc)}
                      className={`w-10 h-10 rounded-xl bg-pale flex items-center justify-center flex-shrink-0 ${
                        doc.statut === 'FOURNI' ? 'cursor-pointer hover:bg-vivid/10 transition-colors' : ''
                      }`}
                    >
                      <FileText size={18} className={doc.statut === 'FOURNI' ? 'text-vivid' : 'text-navy'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-sm font-semibold text-navy">{doc.nom}</p>
                        <span className={s.cls}>{s.label}</span>
                      </div>
                      <p className="text-xs text-muted font-light">
                        {doc.step?.titre ?? 'Document général'}
                        {doc.taille ? ` · ${(doc.taille / 1024).toFixed(0)} Ko` : ''}
                        {doc.createdAt ? ` · ${new Date(doc.createdAt).toLocaleDateString('fr-FR')}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.statut === 'FOURNI' && (
                        <>
                          <button onClick={() => setPreview(doc)}
                            className="p-2 rounded-lg text-muted hover:text-vivid hover:bg-pale transition-all" title="Prévisualiser">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => handleDelete(doc.id)} disabled={deleting === doc.id}
                            className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                            {deleting === doc.id
                              ? <span className="w-4 h-4 border border-red-300 border-t-red-500 rounded-full animate-spin block" />
                              : <Trash2 size={15} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Upload libre (discret, en bas) ── */}
          <CompactUploadZone onUpload={handleUpload} uploading={uploading} />
        </>
      )}
    </div>
  )
}

// ── Zone upload compacte (discrète) ────────────────
function CompactUploadZone({ onUpload, uploading }) {
  const inputRef = useRef(null)
  return (
    <div className="border border-dashed border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-navy/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-app-bg flex items-center justify-center flex-shrink-0">
          <Plus size={15} className="text-muted" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate">Ajouter un document libre</p>
          <p className="text-[.65rem] text-muted">PDF, JPG, PNG · Max 5 Mo</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={e => { const file = e.target.files[0]; if (file) onUpload(file, file.name, null) }} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={!!uploading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-semibold border border-border bg-white text-slate hover:border-navy hover:text-navy transition-all disabled:opacity-50 flex-shrink-0"
      >
        {uploading
          ? <span className="w-3 h-3 border border-slate/20 border-t-slate rounded-full animate-spin" />
          : <Upload size={12} />
        }
        {uploading ? 'Upload...' : 'Parcourir'}
      </button>
    </div>
  )
}
