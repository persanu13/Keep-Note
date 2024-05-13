//fetch function
export async function getNotesData(url) {
  let notesData;
  try {
    const res = await fetch(url);
    notesData = await res.json();
  } catch (error) {
    console.error("Error:", error);
    return;
  }
  return notesData;
}

export async function postNote(noteData, url) {
  let result;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });
    result = await response.json();
  } catch (error) {
    console.error("Error:", error);
    return;
  }
  return result;
}

export async function updateNote(updatedNoteData, url) {
  let result;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNoteData),
    });
    result = await response.json();
  } catch (error) {
    console.error("Error:", error);
    return;
  }
  return result;
}

export async function deleteNote(url) {
  let result;
  try {
    const response = await fetch(url, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await response.json();
  } catch (error) {
    console.error("Error:", error);
    return;
  }
  return result;
}
