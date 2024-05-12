// This is a module, no need for 'use strict'
// You can npm install packages which help you and import them here
// Vite allows you to import images and css files if necessary

(async function () {
  //variable
  const COLORS = [
    "goldenrod",
    "darkslategrey",
    "crimson",
    "#153448",
    "#FDA403",
    "coral",
    "midnightblue",
  ];
  const apiUrl = "http://localhost:3000/notes";
  const notesData = (await getNotesData(apiUrl)).reverse();
  let paletOpenCard = null;

  //functions on init
  displayNoteCards(notesData);

  //fetch function
  async function getNotesData(url) {
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

  async function postNote(noteData, url) {
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

  async function updateNote(updatedNoteData, url) {
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

  async function deleteNote(url) {
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

  //handleClickBody
  document.querySelector("body").addEventListener("click", handleClickBody);

  function handleClickBody(e) {
    if (paletOpenCard != null) {
      if (e.target.closest("[data-color-picker]")) {
        return;
      }
      paletOpenCard.remove();
      paletOpenCard = null;
    }
  }

  //Search Bar
  document
    .querySelector("[data-search-bar]")
    .addEventListener("input", searchTextChange);

  function searchTextChange(e) {
    const value = e.target.value;
    const filtredDataNotes = notesData.filter((note) =>
      note.title.toLowerCase().includes(value.toLowerCase())
    );
    displayNoteCards(filtredDataNotes);
  }

  document
    .querySelector("[data-search-bar]")
    .addEventListener("click", handleClearClick);

  function handleClearClick(e) {
    const button = e.target.closest("[data-clear]");
    if (!button) return;
    const input = document.querySelector("[data-search-bar] input");
    input.value = "";
    input.focus();
    displayNoteCards(notesData);
  }

  //handle Add Note
  document
    .querySelector("[data-add-note]")
    .addEventListener("click", handleAddNote);

  async function handleAddNote(e) {
    let note_object = {
      title: "New Note",
      note: "",
      color: getRandomColor(),
      fixed: "false",
    };
    const new_note = await postNote(note_object, apiUrl);
    notesData.unshift(new_note);
    displayNoteCards(notesData);
    const title = document.querySelector(
      `[data-note-id="${new_note.id}"] input`
    );
    title.focus();
    title.select();
  }

  function getRandomColor() {
    return COLORS[Math.ceil(Math.random() * COLORS.length) - 1];
  }

  //handleInputChange
  document
    .querySelector("[data-notes-container]")
    .addEventListener("input", handleInputChange);

  function handleInputChange(e) {
    const noteCard = e.target.closest("[data-note-id]");
    if (e.target.closest("textarea")) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
    if (e.target.closest("[data-color-picker]")) {
      noteCard.style.backgroundColor = e.target.closest(
        "[data-color-picker]"
      ).value;
    }
    updateNoteCard(noteCard);
  }

  async function updateNoteCard(noteCard, title, note, color, fixed) {
    const id = noteCard.dataset.noteId;
    if (!title) title = noteCard.querySelector("input").value;
    if (!note) note = noteCard.querySelector("textarea").value;
    if (!color) color = noteCard.style.backgroundColor;
    if (!fixed) fixed = noteCard.dataset.fixed;
    const data = { title: title, note: note, color: color, fixed: fixed };
    const new_note = await updateNote(data, apiUrl + "/" + id);
    const index = notesData.findIndex((note) => note.id === id);
    notesData.splice(index, 1, new_note);
  }

  //handleClickNote
  document
    .querySelector("[data-notes-container]")
    .addEventListener("click", handleClickNote);

  function handleClickNote(e) {
    const button = e.target.closest("[data-note-button]");
    if (!button) {
      return;
    }
    const action = button.dataset.noteButton;
    switch (action) {
      case "delete":
        deleteNoteCard(button.closest("[data-note-id]").dataset.noteId);
        break;
      case "palete":
        paleteAction(button.closest("[data-note-id]"));
        break;
      case "fixed":
        fixedNoteCard(button.closest("[data-note-id]"));
        break;
      case "color":
        switchColor(button.closest("[data-note-id]"), button);
        break;
      default:
        console.log(`The "${action}" action is not implemented!`);
    }
  }

  async function deleteNoteCard(id) {
    await deleteNote(apiUrl + "/" + id);
    const index = notesData.findIndex((note) => note.id === id);
    notesData.splice(index, 1);
    displayNoteCards(notesData);
  }

  function paleteAction(palete) {
    if (paletOpenCard === null) {
      setTimeout(() => {
        paletOpenCard = createColorPalet();
        palete.append(paletOpenCard);
      }, 0);
    }
  }

  async function fixedNoteCard(noteCard) {
    let fixed = "false";
    if (noteCard.dataset.fixed != "true") fixed = "true";
    await updateNoteCard(noteCard, null, null, null, fixed);
    displayNoteCards(notesData);
  }

  function createColorPalet() {
    const container = document.createElement("div");
    container.classList.add("colors-container");
    for (let color of COLORS) {
      let colorButton = document.createElement("button");
      colorButton.type = "button";
      colorButton.style.backgroundColor = color;
      colorButton.dataset.noteButton = "color";
      container.append(colorButton);
    }
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.dataset.colorPicker = "";
    container.append(colorPicker);
    return container;
  }

  function switchColor(noteCard, button) {
    noteCard.style.backgroundColor = button.style.backgroundColor;
    updateNoteCard(noteCard, null, null, button.style.backgroundColor);
  }

  //Build and Display functions
  function buildNoteCards(notesData) {
    const fragment = document.createDocumentFragment();
    const fixedCardContainer = document.createElement("div");
    fixedCardContainer.classList.add("grid-container");
    const normalCardContainer = document.createElement("div");
    normalCardContainer.classList.add("grid-container");
    for (const noteData of notesData) {
      const noteCard = createNoteCard(noteData);
      if (noteCard.dataset.fixed == "false") {
        normalCardContainer.append(noteCard);
      } else {
        fixedCardContainer.append(noteCard);
      }
    }
    if (fixedCardContainer.children.length > 0) {
      const containerTitle = document.createElement("p");
      containerTitle.textContent = "Fixed notes";
      fragment.append(containerTitle);
    }
    fragment.append(fixedCardContainer);
    if (normalCardContainer.children.length > 0) {
      const containerTitle = document.createElement("p");
      containerTitle.textContent = "Other notes";
      fragment.append(containerTitle);
    }
    fragment.append(normalCardContainer);
    return fragment;
  }

  function createNoteCard(noteData) {
    const noteCard = document.createElement("div");
    noteCard.dataset.noteId = noteData.id;
    noteCard.dataset.fixed = noteData.fixed;
    noteCard.classList.add("note-card");
    noteCard.style.backgroundColor = noteData.color;
    const title = document.createElement("input");
    title.type = "text";
    title.value = noteData.title;
    title.placeholder = "Title";
    title.maxLength = 30;
    const note = document.createElement("textarea");
    note.value = noteData.note;
    note.placeholder = "Note";
    setTimeout(function () {
      note.style.height = note.scrollHeight + "px";
    }, 0);
    const buttons_container = document.createElement("div");
    const delete_button = createIconButton("fa-solid fa-trash-can");
    delete_button.dataset.noteButton = "delete";
    const palete_button = createIconButton("fa-solid fa-palette");
    palete_button.dataset.noteButton = "palete";
    const fixed_button = createIconButton("fa-solid fa-thumbtack");
    fixed_button.dataset.noteButton = "fixed";
    buttons_container.append(delete_button, palete_button, fixed_button);
    noteCard.append(title, note, buttons_container);
    return noteCard;
  }

  function createIconButton(icon_class) {
    const button = document.createElement("button");
    button.type = "button";
    const icon = document.createElement("i");
    for (let clas of icon_class.split(" ")) {
      icon.classList.add(clas);
    }
    button.append(icon);
    return button;
  }

  function displayNoteCards(notesData) {
    const noteCards = buildNoteCards(notesData);
    const noteCardsContainer = document.querySelector("[data-notes-container]");
    noteCardsContainer.innerHTML = "";
    noteCardsContainer.append(noteCards);
  }
})();
