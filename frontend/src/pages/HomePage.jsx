import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NoteCard from '../components/NoteCard';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {//runs once when the page loads
    const fetchNotes = async () => {
      try {
        const res = await api.get("/");
        console.log("Response from server:", res);
        console.log("Response data:", res.data);
        setNotes(Array.isArray(res.data) ? res.data : []); //stores the fetched notes in the state
        setIsRateLimited(false);
      }
      catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        }
        else {
          toast.error("Failed to fetch notes.");
        }
      }
      finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
        {!loading && notes.length === 0 && !isRateLimited && (
          <div className='flex flex-col items-center justify-center text-center mt-20 space-y-4'>
            <div className="text-6xl">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700">
              No notes yet
            </h2>
            <p className="text-gray-500">
              Start capturing your ideas. Create your first note now!
            </p>
            <button type='submit'
              onClick={() => navigate("/create")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              + Create Note
            </button>
          </div>

        )}
        {notes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes.map(note => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default HomePage;