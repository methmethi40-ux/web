document.addEventListener("DOMContentLoaded", () => {
  const cloudName = "ddryt9alc";
  const uploadPreset = "ml_default"; // your preset

  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const titleInput = document.getElementById("titleInput");
  const descInput = document.getElementById("descInput");
  const categorySelect = document.getElementById("categorySelect");
  const progressWrap = document.querySelector(".progress-wrap");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  uploadBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Sign in and create a channel first.");

    const file = fileInput.files[0];
    if (!file) return alert("Choose a file to upload.");

    const title = (titleInput.value || file.name).trim();
    const desc = descInput.value.trim();
    const category = categorySelect.value || "uncategorized";

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("context", `title=${title}|desc=${desc}|category=${category}`);

    progressWrap.style.display = "block";
    progressBar.style.width = "0%";
    progressText.textContent = "0%";

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/upload`, true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = `${pct}%`;
            progressText.textContent = `${pct}%`;
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            try {
              await db.collection("uploads").add({
                title,
                desc,
                category,
                url: res.secure_url,
                public_id: res.public_id,
                ownerUid: user.uid,
                ownerEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
              alert("Upload complete!");
              fileInput.value = "";
              titleInput.value = "";
              descInput.value = "";
              progressBar.style.width = "100%";
              progressText.textContent = "Done";
              resolve();
            } catch (err) {
              console.error("Save metadata fail:", err);
              reject(err);
            }
          } else {
            console.error("Upload failed", xhr.status, xhr.responseText);
            reject(new Error("Upload failed: " + xhr.status));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(form);
      });
    } catch (err) {
      alert("Upload failed: " + (err.message || err));
      console.error(err);
    } finally {
      setTimeout(() => progressWrap.style.display = "none", 1200);
    }
  });
});
