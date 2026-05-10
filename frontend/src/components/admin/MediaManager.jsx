import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api.js';

const CATEGORIES = ['general', 'conference', 'clinic', 'tv', 'lecture', 'research'];

export default function MediaManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await api.listMedia('all');
      setItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadMsg(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}…`);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    fd.append('category', uploadCategory);
    fd.append('caption', uploadCaption);
    try {
      await api.uploadMedia(fd);
      setUploadMsg(`✓ Uploaded ${files.length} file${files.length > 1 ? 's' : ''} successfully.`);
      setUploadCaption('');
      load();
      setTimeout(() => setUploadMsg(''), 4000);
    } catch (e) {
      setUploadMsg(`✗ Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  const onUpdate = async (id, patch) => {
    try {
      await api.updateMedia(id, patch);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this item permanently?')) return;
    try {
      await api.deleteMedia(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <div className="admin-section-head">
        <div>
          <h2>Media <em>Gallery</em></h2>
          <p>Upload images and videos. Drag and drop multiple files at once. Supported: JPG, PNG, WebP, GIF, MP4, WebM, MOV.</p>
        </div>
      </div>

      <div
        className={`upload-zone ${drag ? 'drag' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <h3>Drag & drop files here</h3>
        <p>or click to browse — images and videos up to 200 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="upload-meta">
          <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} onClick={(e) => e.stopPropagation()}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            placeholder="Caption (optional)"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {uploadMsg && <div className="upload-progress">{uploadMsg}</div>}
      </div>

      <div className="media-grid">
        {loading && <div className="media-empty">Loading…</div>}
        {!loading && items.length === 0 && (
          <div className="media-empty">No media yet. Upload your first item above.</div>
        )}
        {items.map((item) => (
          <MediaCard key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}

function MediaCard({ item, onUpdate, onDelete }) {
  const [title, setTitle] = useState(item.title);
  const [caption, setCaption] = useState(item.caption || '');
  const [category, setCategory] = useState(item.category);
  const [featured, setFeatured] = useState(!!item.featured);

  const dirty = title !== item.title || caption !== (item.caption || '') ||
                category !== item.category || featured !== !!item.featured;

  const save = () => onUpdate(item.id, {
    title, caption, category, featured: featured ? 1 : 0,
  });

  const src = `/uploads/${item.filename}`;
  const thumbSrc = item.thumbnail ? `/uploads/${item.thumbnail}` : src;

  return (
    <div className="media-card">
      <div className="media-thumb">
        {item.type === 'video'
          ? <video src={src} muted preload="metadata" />
          : <img src={thumbSrc} alt={item.title} />}
        <div className="media-type-badge">{item.type}</div>
      </div>
      <div className="media-info">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'11px',color:'#7a8a82',marginBottom:'8px'}}>
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <div className="media-actions">
          <button className="admin-btn" onClick={save} disabled={!dirty}>Save</button>
          <button className="admin-btn danger" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
