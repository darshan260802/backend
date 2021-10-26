const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: creating a note on POST api/notes/createNote
router.post(
  "/createNote",
  fetchUser,
  [
    body("title", "Please Enter Valid Title").isLength({ min: 3 }),
    body("description", "Please Enter Valid Description").isLength({ min: 5 }),
  ],
  async (request, response) => {
    // validating input feilds and return 400 Bad request if errors
    const error = validationResult(request);
    if (!error.isEmpty()) {
      return response.status(400).json({ errors: error.array() });
    }
    
    try {
      // Creating note
      await Notes.create({
        user: request.user.id,
        title: request.body.title,
        description: request.body.description,
        tag: request.body.tag,
      }).catch((err) => response.json(err));
      
      response.json({ message: "Note Created Successfully!" });
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
  );
  
  // ROUTE 2: fetch All notes on GET api/notes/getNotes
  router.get("/getNotes", fetchUser, async (request, response) => {
    try {
      const userId = request.user.id;
      console.log(userId);
      
      // finding all notes by user id
      const notes = await Notes.find({ user: userId }).catch((err) =>
      response.json({ err })
      );
      response.json(notes);
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
});

// ROUTE 3: updating a note on PUT api/notes/updateNote
router.put(
  "/updateNote/:id",
  fetchUser,
  [
    body("title", "Please Enter Valid Title").isLength({ min: 3 }),
    body("description", "Please Enter Valid Description").isLength({ min: 5 }),
  ],
  async (request, response) => {
    try {
      const userId = request.user.id;
      console.log(userId);
      const errors = validationResult(request);
      if(!errors.isEmpty())
      {
        return response.status(400).json({ errors: errors.array() });
      }
      // finding note by note id and if note doesn't exist return error
      const note = await Notes.findById(request.params.id).catch(err => response.json(err));
      if(!note)
      {
        return response.status(404).send('Note Doesn\'t Exist')
      }

      console.log(note.user.toString());
      console.log(userId);
      // checking if sender is real user
      if(note.user.toString() !== userId)
      {
        return response.status(400).send('Authentication Error! Invalid User')
      }
      
      const newNote = {
        title: request.body.title,
        description: request.body.description,
        tag: request.body.tag
      }

      await Notes.findByIdAndUpdate(request.params.id, newNote).catch(err => response.json(err))
      
      response.json({message:"Note Updated Successfully"});
      
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
  );
  
  
//  ROUTE 4 : delete note on DELETE api/notes/deleteNote
router.delete('/deleteNote/:id', fetchUser, async(request, response) => {
  try {
    
    const userId = request.user.id;
    
    // finding note 
    const note = await Notes.findById(request.params.id).catch(err => response.json(err));
  if(!note)
  {
    return response.status(404).json({error: 'Note doesn\'t Exist!'})
  }
  
  // check is sender is geniuen user
  if(note.user.toString() !== userId)
  {
    return response.status(400).send('Authentication Error! Invalid User')
  }

  await Notes.findByIdAndDelete(request.params.id).catch(err => response.json(err))
  response.json({message:"Note Deleted Successfully"})
} catch (error) {
  response.status(500).json({ error: "Internal Server Error" });
}
})

module.exports = router;
