// run when DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const MASTER_ADMIN = "methmethi40@gmail.com";

  const authBtn = document.getElementById("authBtn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const learnBtn = document.getElementById("learnBtn");
  const uploadArea = document.getElementById("uploadArea");
  const uploadForm = document.getElementById("uploadForm");
  const noChannelNotice = document.getElementById("noChannelNotice");
  const createChannelBtn = document.getElementById("createChannelBtn");
  const userInfo = document.getElementById("userInfo");
  const userName = document.getElementById("userName");
  const feed = document.getElementById("feed");

  // helper to show upload area
  function showUploadArea() {
    uploadArea.setAttribute("aria-hidden", "false");
    uploadArea.scrollIntoView({ behavior: "smooth" });
  }

  // Get started: if signed in show upload, else prompt sign in
  getStartedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      showUploadArea();
    } else {
      alert("Please sign in first to create a channel and upload.");
      authBtn.focus();
    }
  });

  learnBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // simple informational behavior
    alert("T-M-B-S Producers: create channels, upload media, support accessibility. More features coming!");
  });

  // Auth button: sign in / sign out
  authBtn.addEventListener("click", async () => {
    if (auth.currentUser) {
      await auth.signOut();
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
    } catch (err) {
      console.warn("Popup sign-in failed, falling back to email/password.", err);
      // fallback: simple email/password prompt
      const email = prompt("Email:");
      const pw = prompt("Password:");
      if (!email || !pw) return;
      try {
        await auth.signInWithEmailAndPassword(email, pw);
      } catch (e) {
        // if account doesn't exist, offer to create it
        if (e.code === "auth/user-not-found") {
          const create = confirm("No account found. Create a new account with that email?");
          if (create) {
            try {
              await auth.createUserWithEmailAndPassword(email, pw);
              alert("Account created. You are signed in.");
            } catch (ce) {
              alert("Sign-up failed: " + ce.message);
            }
          }
        } else {
          alert("Sign-in failed: " + e.message);
        }
      }
    }
  });

  // cancel upload form
  document.getElementById("cancelUploadBtn")?.addEventListener("click", () => {
    uploadForm.style.display = "none";
  });

  // Create channel action
  createChannelBtn?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Sign in first.");
    const name = prompt("Channel name (public):", user.displayName || "My Channel");
    if (!name) return;
    try {
      await db.collection("channels").doc(user.uid).set({
        name,
        ownerUid: user.uid,
        ownerEmail: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Channel created.");
      noChannelNotice.style.display = "none";
      uploadForm.style.display = "block";
    } catch (e) {
      console.error(e);
      alert("Failed to create channel: " + e.message);
    }
  });

  // auth state changes
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      authBtn.textContent = "Sign Out";
      userInfo.style.display = "inline-block";
      userName.textContent = user.displayName || user.email;

      // show upload area
      uploadArea.setAttribute("aria-hidden", "false");

      // check channel
      try {
        const doc = await db.collection("channels").doc(user.uid).get();
        if (!doc.exists) {
          noChannelNotice.style.display = "block";
          uploadForm.style.display = "none";
        } else {
          noChannelNotice.style.display = "none";
          uploadForm.style.display = "block";
        }
      } catch (e) {
        console.error("Failed checking channel:", e);
        noChannelNotice.style.display = "block";
      }

      // admin
      if (user.email === MASTER_ADMIN) {
        document.body.classList.add("admin-mode");
        // admin UI could be shown here
      }
    } else {
      authBtn.textContent = "Sign In";
      userInfo.style.display = "none";
      userName.textContent = "";
      uploadArea.setAttribute("aria-hidden", "true");
      noChannelNotice.style.display = "none";
      uploadForm.style.display = "none";
    }
  });

}); // DOMContentLoaded
