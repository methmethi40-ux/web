// basic admin deletion helper
const ADMIN_EMAILS = ["methmethi40@gmail.com"];

async function deleteUpload(docId) {
  const user = auth.currentUser;
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    alert("Only admins can delete.");
    return;
  }
  if (!confirm("Delete this upload?")) return;
  try {
    await db.collection("uploads").doc(docId).delete();
    alert("Deleted.");
  } catch (e) {
    console.error(e);
    alert("Delete failed: " + e.message);
  }
}

// export for console usage if you want:
// window.deleteUpload = deleteUpload;
