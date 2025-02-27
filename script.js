// Handle user registration and redirect to journal page
function registerUser() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter your name!");
        return;
    }
    localStorage.setItem("username", username);
    window.location.href = "journal.html"; // Redirect to journal page
}

// Load user's name and show greeting
function loadUser() {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("greeting").innerText = `Hello, ${username} 🌿`;
    } else {
        window.location.href = "index.html"; // If no user found, go back to login
    }
}

// Load journal entries
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("entriesList")) {
        loadEntries();
    }
});

function addEntry() {
    let title = document.getElementById("journalTitle").value.trim();
    let text = document.getElementById("journalEntry").value.trim();
    let date = new Date().toLocaleDateString();

    if (title === "" || text === "") {
        alert("Both title and entry cannot be empty!");
        return;
    }

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push({ title, text, date });
    localStorage.setItem("entries", JSON.stringify(entries));

    document.getElementById("journalTitle").value = "";
    document.getElementById("journalEntry").value = "";
    loadEntries();
}

function loadEntries() {
    let entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = "";

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.forEach((entry, index) => {
        let row = `
            <tr>
                <td>${entry.title}</td>
                <td>${entry.date}</td>
                <td>
                    <button onclick="editEntry(${index})">✏️ Edit</button>
                    <button onclick="deleteEntry(${index})">🗑 Delete</button>
                </td>
            </tr>
        `;
        entriesList.innerHTML += row;
    });
}


function editEntry(index) {
    let entries = JSON.parse(localStorage.getItem("entries"));
    let updatedText = prompt("Edit your entry:", entries[index].text);
    if (updatedText) {
        entries[index].text = updatedText;
        localStorage.setItem("entries", JSON.stringify(entries));
        loadEntries();
    }
}
// Function to View Journal Entry
function viewEntry(index) {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    document.getElementById("modalTitle").innerText = entries[index].title;
    document.getElementById("modalText").innerText = entries[index].text;
    
    // Show the modal
    document.getElementById("viewModal").style.display = "block";
}

// Function to Close Modal
function closeModal() {
    document.getElementById("viewModal").style.display = "none";
}

// Modify loadEntries to include "View" button
function loadEntries() {
    let entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = "";

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.forEach((entry, index) => {
        let row = `
            <tr>
                <td>${entry.title}</td>
                <td>${entry.date}</td>
                <td>
                    <button onclick="viewEntry(${index})">👁 View</button>
                    <button onclick="editEntry(${index})">✏️ Edit</button>
                    <button onclick="deleteEntry(${index})">🗑 Delete</button>
                </td>
            </tr>
        `;
        entriesList.innerHTML += row;
    });
}

function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem("entries"));
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    loadEntries();
}
let visibleEntries = 3; // Initially show 3 entries

// Load & Display Journal Entries (Sorted by Latest First)
function loadEntries() {
    let entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = "";

    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    // Sort entries so that the latest entry appears first
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Show only limited entries first
    let displayedEntries = entries.slice(0, visibleEntries);

    displayedEntries.forEach((entry, index) => {
        let row = `
            <tr>
                <td>${entry.title}</td>
                <td>${entry.date}</td>
                <td>
                    <button onclick="viewEntry(${index})">👁 View</button>
                    <button onclick="editEntry(${index})">✏️ Edit</button>
                    <button onclick="deleteEntry(${index})">🗑 Delete</button>
                </td>
            </tr>
        `;
        entriesList.innerHTML += row;
    });

    // Manage visibility of "See More" & "See Less" buttons
    document.getElementById("seeMoreBtn").style.display = (visibleEntries < entries.length) ? "block" : "none";
    document.getElementById("seeLessBtn").style.display = (visibleEntries > 3) ? "block" : "none";
}

// Load More Entries on Clicking "See More"
function showMoreEntries() {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    visibleEntries = Math.min(visibleEntries + 3, entries.length); // Load next 3
    loadEntries();
}

// Collapse Extra Entries on Clicking "See Less"
function showLessEntries() {
    visibleEntries = 3; // Reset to 3 entries
    loadEntries();
}

// Search Entries by Title (Maintaining Sorted Order)
function searchEntries() {
    let query = document.getElementById("searchBar").value.toLowerCase();
    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    // Sort entries so latest appears first before filtering
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    let entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = ""; // Clear list before filtering

    let filteredEntries = entries.filter(entry => entry.title.toLowerCase().includes(query));

    filteredEntries.forEach((entry, index) => {
        let row = `
            <tr>
                <td>${entry.title}</td>
                <td>${entry.date}</td>
                <td>
                    <button onclick="viewEntry(${index})">👁 View</button>
                    <button onclick="editEntry(${index})">✏️ Edit</button>
                    <button onclick="deleteEntry(${index})">🗑 Delete</button>
                </td>
            </tr>
        `;
        entriesList.innerHTML += row;
    });

    // Hide "See More" and "See Less" when searching, restore them if search is cleared
    document.getElementById("seeMoreBtn").style.display = query.length === 0 ? "block" : "none";
    document.getElementById("seeLessBtn").style.display = query.length === 0 && visibleEntries > 3 ? "block" : "none";

    // Reset visible entries count when clearing search
    if (query.length === 0) {
        visibleEntries = 3;
        loadEntries();
    }
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadEntries);
