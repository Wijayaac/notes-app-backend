const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    console.log('here');
    const response = h.response({
      status: 'success',
      message: 'Notes successfully added',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Notes failed added',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((item) => item.id === id)[0];

  if (note !== undefined) {
    const response = h.response({
      status: 'Success',
      data: {
        note,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'Failed',
    message: 'Note is not found',
  });
  response.code(404);
  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Notes successfully updated',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Failed to update the note. The note with that name cannot be found',
  });
  response.code(404);

  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Note successfully deleted',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Failed to delete the note. The note with that name cannot be found',
  });
  response.code(404);

  return response;
};

module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteHandler, deleteNoteByIdHandler,
};
