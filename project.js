// ================= Page Loading =================
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const loginPage = document.getElementById("loginPage");
    const app = document.getElementById("appContainer");

    loginPage.style.display = "none";
    app.classList.add("hidden");

    setTimeout(() => {
        preloader.classList.add("hide");
        loginPage.style.display = "flex";
    }, 1500);
});


// ================= Login =================
function handleLogin(type) {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    localStorage.setItem("lp_logged_in", "true");
    localStorage.setItem("lp_user_type", type);

    showApp(type);
}


// ================= Show App =================
function showApp(type) {
    const login = document.getElementById("loginPage");
    const app = document.getElementById("appContainer");
    const clientNav = document.getElementById("clientNav");
    const lawyerNav = document.getElementById("lawyerNav");
    const clientBtn = document.getElementById("btnClientNav");
    const lawyerBtn = document.getElementById("btnLawyerNav");

    login.style.display = "none";
    app.classList.remove("hidden");

    if (type === "client") {
        clientNav.classList.remove("hidden");
        lawyerNav.classList.add("hidden");
        clientBtn.classList.add("active");
        lawyerBtn.classList.remove("active");
        showPage("#home");
    } else {
        lawyerNav.classList.remove("hidden");
        clientNav.classList.add("hidden");
        lawyerBtn.classList.add("active");
        clientBtn.classList.remove("active");
        showPage("#lawyer-dashboard");
    }
}


// ================= Page Navigation =================
function showPage(id) {
    document.querySelectorAll(".page-view").forEach(page => {
        page.style.display = "none";
    });

    const page = document.querySelector(id);

    if (page) {
        page.style.display = "block";
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");

        if (btn.getAttribute("href") === id) {
            btn.classList.add("active");
        }
    });
}


// ================= Navigation Control =================
window.addEventListener("hashchange", () => {
    const type = localStorage.getItem("lp_user_type");
    const hash = location.hash;

    if (!type) return;

    if (type === "client" && hash.startsWith("#lawyer-")) {
        showPage("#home");
        return;
    }

    if (type === "lawyer" && !hash.startsWith("#lawyer-")) {
        showPage("#lawyer-dashboard");
        return;
    }

    showPage(hash || (type === "lawyer"
        ? "#lawyer-dashboard"
        : "#home"));
});


// ================= Logout =================
function logout() {
    localStorage.removeItem("lp_logged_in");
    localStorage.removeItem("lp_user_type");

    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    showPage("#home");
    history.replaceState(null, null, " ");
}