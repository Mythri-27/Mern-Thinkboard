import Note from "../model/Note.js";

export async function getAllNotes(_, res) {
    try {
        const notes = (await Note.find());//.toSorted({createdAt:-1}); //latest note first
        res.status(200).json(notes);
        console.log("Fetched successfully");
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Failed to fetch notes", error);
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if(!note){
            res.status(404).json({message:"Note not found"});
        }   
        res.status(200).json(note);
        console.log("Fetched successfully");
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
        console.error("Failed to fetch note", error);
    }
}

export async function createNote(req, res) {
    try {
        const {title, content } = req.body;
        const note = new Note({ title, content });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
        console.log("Note created successfully");
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" });
        console.error("Failed to create note", error);
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const updateNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updateNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updateNote);
        console.log("Note updated successfully");
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Failed to update note", error);
    }
}

export async function deleteNote(req, res) {
    try {
        const deleteNote = await Note.findByIdAndDelete(req.params.id);
        if (!deleteNote) {
            return res.status(404).json({ msg: "Note not found" });
        }
        console.log("Note deleted successfully");
        res.status(200).json(deleteNote);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error("Failed to delete note", error);
    }
}



// // export const getNoteById= async function(req,res){
// //     try{
// //         const note=await Note.findById(req.params.id);
// //         if(!note) return res.status(404).send("Note not Found!");
// //         res.status(200).json(note);
// //     }
// //     catch(error){
// //         console.error("Failed to fetech", error);
// //         res.status(500).json({message: "Internal server error"});
// //     }
// // }

