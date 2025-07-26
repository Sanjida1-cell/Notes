document.addEventListener('DOMContentLoaded', function() {
    const notesTable = document.getElementById('notesTable').getElementsByTagName('tbody')[0];
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const noteForm = document.getElementById('noteForm');
    const modalTitle = document.getElementById('modalTitle');
    const noteIdInput = document.getElementById('noteId');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    let editing = false;

    function fetchNotes() {
        fetch('/notes')
            .then(res => res.json())
            .then(data => {
                notesTable.innerHTML = '';
                data.forEach(note => {
                    const row = notesTable.insertRow();
                    row.innerHTML = `
                        <td>${note.title}</td>
                        <td>${note.content}</td>
                        <td>
                            <button class="edit" data-id="${note.id}">Edit</button>
                            <button class="delete" data-id="${note.id}">Delete</button>
                        </td>
                    `;
                });
            });
    }

    function openModal(edit = false, note = null) {
        modal.style.display = 'block';
        editing = edit;
        if (edit && note) {
            modalTitle.textContent = 'Edit Note';
            noteIdInput.value = note.id;
            titleInput.value = note.title;
            contentInput.value = note.content;
        } else {
            modalTitle.textContent = 'Add Note';
            noteIdInput.value = '';
            titleInput.value = '';
            contentInput.value = '';
        }
    }

    function closeModalFunc() {
        modal.style.display = 'none';
    }

    addBtn.onclick = () => openModal(false);
    closeModal.onclick = closeModalFunc;
    window.onclick = function(event) {
        if (event.target == modal) closeModalFunc();
    };

    noteForm.onsubmit = function(e) {
        e.preventDefault();
        const note = {
            title: titleInput.value,
            content: contentInput.value
        };
        if (editing) {
            // Update
            fetch(`/notes/${noteIdInput.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            })
            .then(res => res.json())
            .then(() => {
                fetchNotes();
                closeModalFunc();
            });
        } else {
            // Add
            fetch('/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            })
            .then(res => res.json())
            .then(() => {
                fetchNotes();
                closeModalFunc();
            });
        }
    };

    notesTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit')) {
            const id = e.target.getAttribute('data-id');
            fetch(`/notes`)
                .then(res => res.json())
                .then(data => {
                    const note = data.find(n => n.id == id);
                    openModal(true, note);
                });
        } else if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this note?')) {
                fetch(`/notes/${id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(() => fetchNotes());
            }
        }
    });

    fetchNotes();
});
