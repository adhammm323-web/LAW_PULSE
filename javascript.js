 v// ================= Page Loading =================
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const loginPage = document.getElementById("loginPage");
    const app = document.getElementById("appContainer");
    const lawyerSearch = document.getElementById("lawyerSearch");
    const lawyerNotFound = document.getElementById("lawyerNotFound");

    if (loginPage) loginPage.style.display = "none";
    if (app) app.classList.add("hidden");

    setTimeout(() => {
        if (preloader) preloader.classList.add("hide");
        if (loginPage) loginPage.style.display = "flex";
    }, 1500);

    if (lawyerSearch) {
        lawyerSearch.addEventListener("input", () => {
            const searchValue = lawyerSearch.value.trim().toLowerCase();
            const lawyerCards = document.querySelectorAll("#lawyers .lawyer-item");
            let matches = 0;

            lawyerCards.forEach(card => {
                const lawyerName = card.querySelector(".lawyer-card h5")?.textContent.trim().toLowerCase() || "";
                const isMatch = lawyerName.startsWith(searchValue);

                card.style.display = isMatch ? "block" : "none";

                if (isMatch) {
                    matches++;
                }
            });

            if (lawyerNotFound) {
                lawyerNotFound.classList.toggle("hidden", matches !== 0);
            }
        });
    }

    setupFormValidation();
    setupChatValidation();

    const savedProfile = localStorage.getItem("lp_selected_lawyer");
    if (savedProfile && LAWYER_PROFILES[savedProfile]) {
        renderLawyerProfile(savedProfile);
    }
});


// ================= Login =================
function handleLogin(type) {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        Swal.fire({
            icon: "error",
            title: "Login Error",
            text: "Please enter your email and password."
        });
        return;
    }

    localStorage.setItem("lp_logged_in", "true");
    localStorage.setItem("lp_user_type", type);

    Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!"
    }).then(() => {
        showApp(type);
    });
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

    window.scrollTo(0, 0);
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

    window.scrollTo(0, 0);
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

    showPage(hash || (type === "lawyer" ? "#lawyer-dashboard" : "#home"));
});


// ================= Logout =================
function logout() {
    localStorage.removeItem("lp_logged_in");
    localStorage.removeItem("lp_user_type");
    localStorage.removeItem("lp_selected_lawyer");

    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("loginPage").style.display = "flex";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    showPage("#home");
    history.replaceState(null, null, " ");
}


// ================= Lawyer Profiles =================
const LAWYER_PROFILES = {
    "ahmed-hafez": {
        name: "Ahmed Hafez",
        role: "Managing Partner",
        location: "Egypt",
        image: "https://www.legal500.com/wp-content/uploads/sites/13/2025/04/107A0848x-scaled-aspect-ratio-800-800-1.jpg",
        about: "Managing Partner focused on helping clients navigate corporate and commercial matters, business structuring and strategic legal decisions.",
        practiceAreas: ["Corporate & Commercial", "Business Advisory", "Transactions"],
        experience: "Senior leadership experience",
        languages: "Arabic, English",
        responseTime: "Within 24 hours",
        consultation: "Online / In person"
    },
    "amr-ehab": {
        name: "Amr Ehab",
        role: "Dispute Resolution",
        location: "Egypt",
        image: "https://matoukbassiouny.com/wp-content/uploads/2022/10/Matouk-Bassiouny-Partner-Amr-Ehab.jpg",
        about: "Dispute Resolution lawyer supporting clients with contentious matters, case strategy and representation through different stages of legal disputes.",
        practiceAreas: ["Dispute Resolution", "Litigation", "Arbitration"],
        experience: "Dispute-focused practice",
        languages: "Arabic, English",
        responseTime: "Within 24 hours",
        consultation: "Online / In person"
    },
    "amr-hafez": {
        name: "Amr Hafez",
        role: "Head of Procedures",
        location: "Egypt",
        image: "https://sharkawylaw.com/wp-content/uploads/2020/07/Amr-Hafez_940x730.jpg",
        about: "Head of Procedures focused on corporate procedures, regulatory filings and the practical steps required to support business and company matters.",
        practiceAreas: ["Corporate Procedures", "Regulatory Filings", "Company Formation"],
        experience: "Procedures and filings focus",
        languages: "Arabic, English",
        responseTime: "Within 24 hours",
        consultation: "Online / In person"
    }
};

function openLawyerProfile(profileKey) {
    if (!LAWYER_PROFILES[profileKey]) return;

    localStorage.setItem("lp_selected_lawyer", profileKey);
    renderLawyerProfile(profileKey);
    location.hash = "profile";
    showPage("#profile");
}

function renderLawyerProfile(profileKey) {
    const profile = LAWYER_PROFILES[profileKey];
    if (!profile) return;

    const image = document.getElementById("profileImage");
    const name = document.getElementById("profileName");
    const role = document.getElementById("profileRole");
    const about = document.getElementById("profileAbout");
    const practiceAreas = document.getElementById("profilePracticeAreas");
    const experience = document.getElementById("profileExperience");
    const languages = document.getElementById("profileLanguages");
    const responseTime = document.getElementById("profileResponseTime");
    const consultation = document.getElementById("profileConsultation");
    const location = document.getElementById("profileLocation");
    const consultationLawyerName = document.getElementById("consultationLawyerName");

    if (image) {
        image.src = profile.image;
        image.alt = profile.name;
    }
    if (name) name.textContent = profile.name;
    if (role) role.textContent = `${profile.role} • ${profile.location}`;
    if (about) about.textContent = profile.about;
    if (experience) experience.textContent = profile.experience;
    if (languages) languages.textContent = profile.languages;
    if (responseTime) responseTime.textContent = profile.responseTime;
    if (consultation) consultation.textContent = profile.consultation;
    if (location) location.textContent = profile.location;
    if (consultationLawyerName) consultationLawyerName.textContent = profile.name;

    if (practiceAreas) {
        practiceAreas.innerHTML = "";
        profile.practiceAreas.forEach(area => {
            const tag = document.createElement("span");
            tag.textContent = area;
            practiceAreas.appendChild(tag);
        });
    }
}

function bookSelectedLawyer() {
    const selected = localStorage.getItem("lp_selected_lawyer");
    if (selected && LAWYER_PROFILES[selected]) {
        renderLawyerProfile(selected);
    }

    location.hash = "consultation";
    showPage("#consultation");
}


// ================= Form Validation =================
function setupFormValidation() {
    const namePattern = /^[A-Za-z\u0600-\u06FF\s.'-]+$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    attachValidation("consultationForm", {
        consultationName: {
            required: true,
            minLength: 3,
            pattern: namePattern,
            messages: {
                required: "Full name is required.",
                minLength: "Please enter at least 3 characters.",
                pattern: "Please enter a valid name."
            }
        },
        consultationIssue: {
            required: true,
            messages: { required: "Please select an issue type." }
        },
        consultationDate: {
            required: true,
            futureDate: true,
            messages: {
                required: "Please select a consultation date.",
                futureDate: "The consultation date cannot be in the past."
            }
        },
        consultationTime: {
            required: true,
            messages: { required: "Please select a consultation time." }
        },
        consultationDescription: {
            required: true,
            minLength: 20,
            maxLength: 500,
            messages: {
                required: "Please describe your case.",
                minLength: "Please provide at least 20 characters.",
                maxLength: "Description must be 500 characters or fewer."
            }
        }
    }, "Request Sent", "Your consultation request has been validated and submitted successfully.");

    attachValidation("complaintForm", {
        complaintSubject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            messages: {
                required: "Subject is required.",
                minLength: "Subject must be at least 5 characters.",
                maxLength: "Subject must be 100 characters or fewer."
            }
        },
        complaintCategory: {
            required: true,
            messages: { required: "Please select a category." }
        },
        complaintDetails: {
            required: true,
            minLength: 15,
            maxLength: 600,
            messages: {
                required: "Please add complaint or suggestion details.",
                minLength: "Please provide at least 15 characters.",
                maxLength: "Details must be 600 characters or fewer."
            }
        }
    }, "Submitted", "Your complaint or suggestion has been validated and submitted.");

    attachValidation("contactForm", {
        contactName: {
            required: true,
            minLength: 3,
            pattern: namePattern,
            messages: {
                required: "Full name is required.",
                minLength: "Please enter at least 3 characters.",
                pattern: "Please enter a valid name."
            }
        },
        contactEmail: {
            required: true,
            pattern: emailPattern,
            messages: {
                required: "Email address is required.",
                pattern: "Please enter a valid email address."
            }
        },
        contactMessage: {
            required: true,
            minLength: 10,
            maxLength: 500,
            messages: {
                required: "Message is required.",
                minLength: "Message must be at least 10 characters.",
                maxLength: "Message must be 500 characters or fewer."
            }
        }
    }, "Message Sent", "Your message has been validated and sent successfully.");

    attachValidation("caseUpdateForm", {
        caseSelect: {
            required: true,
            messages: { required: "Please select a case." }
        },
        caseNotes: {
            required: true,
            minLength: 10,
            maxLength: 600,
            messages: {
                required: "Case notes are required.",
                minLength: "Please add at least 10 characters.",
                maxLength: "Case notes must be 600 characters or fewer."
            }
        },
        nextAppointment: {
            required: true,
            futureDateTime: true,
            messages: {
                required: "Please select the next appointment.",
                futureDateTime: "The next appointment must be in the future."
            }
        }
    }, "Saved", "The case update has been validated and saved successfully.");
}

function attachValidation(formId, rules, successTitle, successText) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    Object.keys(rules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const eventName = field.tagName === "SELECT" || field.type === "date" || field.type === "time" || field.type === "datetime-local"
            ? "change"
            : "input";

        field.addEventListener(eventName, () => validateField(field, rules[fieldId]));
        field.addEventListener("blur", () => validateField(field, rules[fieldId]));
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        let isValid = true;
        let firstInvalidField = null;

        Object.keys(rules).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const fieldIsValid = validateField(field, rules[fieldId]);
            if (!fieldIsValid) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (!isValid) {
            firstInvalidField?.focus();
            return;
        }

        Swal.fire({
            icon: "success",
            title: successTitle,
            text: successText
        });

        form.reset();
        clearFormValidation(form);
    });
}

function validateField(field, rule) {
    const value = field.value.trim();
    let message = "";

    if (rule.required && !value) {
        message = rule.messages?.required || "This field is required.";
    } else if (rule.minLength && value.length < rule.minLength) {
        message = rule.messages?.minLength || `Minimum ${rule.minLength} characters required.`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
        message = rule.messages?.maxLength || `Maximum ${rule.maxLength} characters allowed.`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
        message = rule.messages?.pattern || "Please enter a valid value.";
    } else if (rule.futureDate && value && isPastDate(value)) {
        message = rule.messages?.futureDate || "Please select today or a future date.";
    } else if (rule.futureDateTime && value && isPastDateTime(value)) {
        message = rule.messages?.futureDateTime || "Please select a future date and time.";
    }

    setFieldState(field, message);
    return !message;
}

function setFieldState(field, message) {
    let feedback = field.parentElement.querySelector(".invalid-feedback");

    if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        field.insertAdjacentElement("afterend", feedback);
    }

    if (message) {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        feedback.textContent = message;
    } else {
        field.classList.remove("is-invalid");
        if (field.value.trim()) field.classList.add("is-valid");
        feedback.textContent = "";
    }
}

function clearFormValidation(form) {
    form.querySelectorAll(".is-invalid, .is-valid").forEach(field => {
        field.classList.remove("is-invalid", "is-valid");
    });

    form.querySelectorAll(".invalid-feedback").forEach(feedback => {
        feedback.textContent = "";
    });
}

function isPastDate(value) {
    const selected = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
}

function isPastDateTime(value) {
    return new Date(value).getTime() <= Date.now();
}


// ================= Chat Message Validation =================
function setupChatValidation() {
    const input = document.getElementById("chatMessageInput");
    const button = document.getElementById("chatSendButton");

    if (!input || !button) return;

    const sendMessage = () => {
        const message = input.value.trim();

        if (!message) {
            setFieldState(input, "Please type a message before sending.");
            input.focus();
            return;
        }

        setFieldState(input, "");
        input.value = "";
        input.classList.remove("is-valid");
    };

    button.addEventListener("click", sendMessage);
    input.addEventListener("input", () => {
        if (input.value.trim()) setFieldState(input, "");
    });
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
}