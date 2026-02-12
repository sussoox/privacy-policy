const body = document.body;
const page = body?.dataset?.page;

const setStatus = (element, text, type) => {
  if (!element) return;
  element.textContent = text;
  element.classList.remove("success", "warning");
  if (type) {
    element.classList.add(type);
  }
};

const createCard = ({ name, location, pricing, details, contact, title }) => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-header">
      <h3>${name}</h3>
      <span class="tag">${location}</span>
    </div>
    <p class="card-title">${title}</p>
    <ul class="card-list">
      <li>Hinnasto: ${pricing}</li>
      <li>Lisätiedot: ${details}</li>
      <li>Yhteystiedot: ${contact}</li>
    </ul>
    <button class="btn btn-outline">Ota yhteyttä</button>
  `;
  return card;
};

const storage = {
  getProfile: () => JSON.parse(localStorage.getItem("taskuduuniProfile") || "null"),
  setProfile: (profile) => localStorage.setItem("taskuduuniProfile", JSON.stringify(profile)),
  getPosts: () => JSON.parse(localStorage.getItem("taskuduuniPosts") || "[]"),
  setPosts: (posts) => localStorage.setItem("taskuduuniPosts", JSON.stringify(posts)),
  getPayment: () => localStorage.getItem("taskuduuniPaid") === "true",
  setPayment: (value) => localStorage.setItem("taskuduuniPaid", value ? "true" : "false")
};

const samplePosts = [
  {
    name: "Emma K.",
    location: "Helsinki",
    title: "Lastenhoito ja kevyet kotityöt",
    pricing: "15 €/h",
    details: "Saatavilla iltaisin",
    contact: "emma@email.fi"
  },
  {
    name: "Jesse M.",
    location: "Tampere",
    title: "Puutarhatyöt ja pihatalkoot",
    pricing: "20 €/h",
    details: "Oma kalusto",
    contact: "040 123 4567"
  },
  {
    name: "Alisa R.",
    location: "Turku",
    title: "Koirien ulkoilutus",
    pricing: "12 €/30 min",
    details: "Myös viikonloppuisin",
    contact: "alisa@email.fi"
  }
];

const initHome = () => {
  const profiles = document.getElementById("profiles");
  if (!profiles) return;
  profiles.innerHTML = "";
  samplePosts.forEach((post) => profiles.append(createCard(post)));
};

const initCreate = () => {
  const form = document.getElementById("profileForm");
  if (!form) return;
  const authButton = document.getElementById("authButton");
  const sendCodeButton = document.getElementById("sendCodeButton");
  const authStatus = document.getElementById("authStatus");
  const guardianButton = document.getElementById("guardianButton");
  const guardianStatus = document.getElementById("guardianStatus");
  const guardianSection = document.getElementById("guardianSection");
  const guardianName = document.getElementById("guardianName");
  const guardianEmail = document.getElementById("guardianEmail");
  const guardianAge = document.getElementById("guardianAge");
  const guardianContact = document.getElementById("guardianContact");
  const guardianConsent = document.getElementById("guardianConsent");
  const authPhone = document.getElementById("authPhone");
  const authEmail = document.getElementById("authEmail");
  const authCodeInput = document.getElementById("authCode");

  const state = {
    authVerified: false,
    guardianVerified: false,
    lastAuthCode: null
  };

  const updateGuardianVisibility = (ageValue) => {
    if (ageValue < 18) {
      guardianSection.classList.remove("hidden");
      state.guardianVerified = false;
      setStatus(guardianStatus, "Ei luotu", "warning");
    } else {
      guardianSection.classList.add("hidden");
      state.guardianVerified = true;
      setStatus(guardianStatus, "Ei tarvita", "success");
      guardianName.value = "";
      guardianEmail.value = "";
      guardianAge.value = "";
      guardianContact.value = "";
      guardianConsent.checked = false;
    }
  };

  setStatus(authStatus, "Ei tunnistettu", "warning");
  updateGuardianVisibility(18);

  form.querySelector("input[name='age']").addEventListener("input", (event) => {
    const ageValue = Number(event.target.value || 0);
    updateGuardianVisibility(ageValue);
  });

  sendCodeButton.addEventListener("click", () => {
    const method = form.querySelector("select[name='authMethod']").value;
    if (!method) {
      alert("Valitse ensin tunnistautumistapa.");
      return;
    }
    if (method === "sms" && !authPhone.value.trim()) {
      alert("Syötä puhelinnumero.");
      return;
    }
    if (method === "email" && !authEmail.value.trim()) {
      alert("Syötä sähköposti.");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    state.lastAuthCode = code;
    state.authVerified = false;
    setStatus(authStatus, "Koodi lähetetty", "warning");
    alert(`Demo-koodi: ${code}`);
  });

  authButton.addEventListener("click", () => {
    const method = form.querySelector("select[name='authMethod']").value;
    if (!method) {
      alert("Valitse ensin tunnistautumistapa.");
      return;
    }
    if (!state.lastAuthCode) {
      alert("Lähetä ensin vahvistuskoodi.");
      return;
    }
    if (!authCodeInput.value.trim()) {
      alert("Syötä vahvistuskoodi.");
      return;
    }
    if (authCodeInput.value.trim() !== state.lastAuthCode) {
      alert("Väärä koodi.");
      return;
    }
    state.authVerified = true;
    setStatus(authStatus, "Tunnistettu", "success");
  });

  guardianButton.addEventListener("click", () => {
    if (!guardianName.value.trim() || !guardianEmail.value.trim() || !guardianContact.value.trim() || !guardianConsent.checked) {
      alert("Täytä huoltajan tiedot ja vahvista suostumus.");
      return;
    }
    const guardianAgeValue = Number(guardianAge.value);
    if (!guardianAgeValue || guardianAgeValue < 18) {
      alert("Huoltajan täytyy olla vähintään 18-vuotias.");
      return;
    }
    state.guardianVerified = true;
    setStatus(guardianStatus, "Luotu", "success");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const ageValue = Number(data.age);

    if (ageValue < 18) {
      alert("Alle 18-vuotias ei voi luoda profiilia ilman huoltajan tiliä.");
      if (!state.guardianVerified) return;
    }

    if (!state.authVerified) {
      alert("Tunnistautuminen puuttuu.");
      return;
    }

    storage.setProfile({
      name: data.name,
      location: data.location,
      age: data.age,
      email: data.email,
      contact: data.contact
    });
    storage.setPayment(false);

    window.location.href = "dashboard.html";
  });
};

const initDashboard = () => {
  const postForm = document.getElementById("postForm");
  const myPosts = document.getElementById("myPosts");
  const otherPosts = document.getElementById("otherPosts");
  const payButton = document.getElementById("payButton");
  const payStatus = document.getElementById("payStatus");
  const postLimitNote = document.getElementById("postLimitNote");
  const accountForm = document.getElementById("accountForm");

  const profile = storage.getProfile();
  const refreshPosts = () => {
    const posts = storage.getPosts();
    myPosts.innerHTML = "";
    posts.forEach((post) => myPosts.append(createCard(post)));
    postLimitNote.textContent = `Julkaisuja ${posts.length}/5.`;
  };

  const refreshOtherPosts = () => {
    otherPosts.innerHTML = "";
    samplePosts.forEach((post) => otherPosts.append(createCard(post)));
  };

  const refreshPayment = () => {
    const paid = storage.getPayment();
    setStatus(payStatus, paid ? "Maksettu" : "Maksu kesken", paid ? "success" : "warning");
    postForm.querySelectorAll("input, textarea, button").forEach((el) => {
      if (el.type === "submit") {
        el.disabled = !paid;
      }
    });
  };

  refreshPosts();
  refreshOtherPosts();
  refreshPayment();

  payButton.addEventListener("click", () => {
    fetch("/create-checkout-session", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        alert("Maksun aloitus epäonnistui.");
      })
      .catch(() => alert("Maksun aloitus epäonnistui."));
  });

  postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!storage.getPayment()) {
      alert("Maksu tarvitaan ennen julkaisua.");
      return;
    }
    const posts = storage.getPosts();
    if (posts.length >= 5) {
      alert("Julkaisujen enimmäismäärä (5) täynnä.");
      return;
    }
    const formData = new FormData(postForm);
    const data = Object.fromEntries(formData.entries());
    posts.unshift({
      name: profile?.name || "Oma profiili",
      location: data.location,
      title: data.title,
      pricing: data.pricing,
      details: data.details,
      contact: data.contact
    });
    storage.setPosts(posts);
    postForm.reset();
    refreshPosts();
  });

  accountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Käyttäjätiedot tallennettu (demo). ");
  });

  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    });
  });
};

if (page === "home") initHome();
if (page === "create") initCreate();
if (page === "dashboard") initDashboard();
if (page === "success") {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const message = document.getElementById("paymentMessage");
  if (!sessionId) {
    if (message) message.textContent = "Maksun vahvistus puuttuu.";
  } else {
    fetch(`/payment-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          storage.setPayment(true);
          if (message) message.textContent = "Maksu vahvistettu.";
        } else {
          if (message) message.textContent = "Maksu kesken.";
        }
      })
      .catch(() => {
        if (message) message.textContent = "Maksun vahvistus epäonnistui.";
      });
  }
}
