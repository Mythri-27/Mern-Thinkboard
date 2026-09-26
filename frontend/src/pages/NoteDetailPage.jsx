import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useNavigate,useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../lib/axios'
import { Trash2Icon, LoaderIcon } from 'lucide-react'


const NoteDetailPage = () => {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`)
        setNote(res.data) // u need to save the note after fetching to use it in the updation process
        // toast.success("Note fetched successfully");
      }
      catch (error) {
        console.error("Error fetching notes");
        toast.error("Error fetching notes")
      }
      finally {
        setLoading(false);
      }
    }; fetchNote();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("All fields are required")
      setSaving(false); // prevent early saving of note
      return
    }
    try {
      await api.put(`/notes/${id}`, note); // put is used for updating the note
      setNote(note)
      toast.success("Saved successfully")
      navigate("/")
    }
    catch (error) {
      console.log("Error saving notes", error);
      toast.error("Error saving notes");
    }
    finally {
      setSaving(false);
    }
  }
  const handleDelete = async () => {
    if (!window.confirm("Are you sure want to delete this note?")) {
      return;
    }
    try {
      await api.delete(`/notes/${id}`); //use proper backend call (notes, not note)
      setNote(null); // get rid of the deleted one
      toast.success("Deleted successfully");
      navigate("/")
    }
    catch (error) {
      console.log("error deleted note", error);
      toast.error("Error deleting note");
    }
    finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline" disabled={loading || saving}>
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;