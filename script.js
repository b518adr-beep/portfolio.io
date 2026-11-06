/**
 * سكربت لوحة تحكم إدارة المحتوى والمشاريع (Content Management Dashboard)
 * نظام أمني متكامل: تسجيل دخول محمي بكلمة مرور + تشفير محلي + إدارة كاملة للأعمال
 * تخزين محلي كامل عبر localStorage و sessionStorage - Vanilla JavaScript نقي 100%
 */

// 1. المشاريع الافتراضية
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "متجر التقنية والأناقة",
    desc: "متجر إلكتروني متكامل لبيع الإلكترونيات والمنتجات الذكية، يتميز بواجهة تفاعلية أنيقة وتجربة تسوق سلسة مع سلة مشتريات وتصميم متجاوب بالكامل.",
    tags: ["HTML5", "CSS3", "متجر إلكتروني", "UI/UX"],
    link: "#contact",
    image: "images/project1.svg"
  },
  {
    id: "proj-2",
    title: "متجر مراعي تيماء",
    desc: "منصة إلكترونية متخصصة في بيع وطلب الذبائح البلدية الطازجة، تتيح للعميل اختيار نوع الذبيحة، طريقة التقطيع، التغليف، وتتبع التوصيل المبرد المباشر.",
    tags: ["HTML5", "CSS3", "منصة تجارية", "RTL Web"],
    link: "#contact",
    image: "images/project2.svg"
  },
  {
    id: "proj-3",
    title: "نظام إدارة الموظفين HRMS",
    desc: "واجهة لوحة تحكم إدارية متطورة لتنظيم بيانات الموظفين، متابعة الحضور والانصراف، مسيرات الرواتب وطلبات الإجازات، مع رسوم بيانية ومؤشرات أداء واضحة.",
    tags: ["HTML5", "CSS Grid", "Dashboard", "HRMS"],
    link: "#contact",
    image: "images/project3.svg"
  },
  {
    id: "proj-4",
    title: "صفحات هبوط احترافية",
    desc: "حزمة واجهات تسويقية مصممة خصيصاً لمضاعفة معدلات التحويل للمنتجات والخدمات، متوافقة مع محركات البحث SEO وسريعة التحميل لجميع منصات الإعلانات.",
    tags: ["HTML5", "CSS3", "Landing Page", "High Conversion"],
    link: "#contact",
    image: "images/project4.svg"
  }
];

const STORAGE_KEY = "saher_portfolio_projects_data";
const AUTH_SESSION_KEY = "saher_admin_auth_session";
const PASSWORD_HASH_KEY = "saher_admin_pwd_hash";

// كلمات المرور الافتراضية المقبولة في حال لم يغير المستخدم باسوورده
// badr517 & admin123
const DEFAULT_PASSWORDS = ["badr517", "admin123"];

// متغير لحفظ المشروع المراد تعديله بعد تسجيل الدخول مباشرة
let pendingEditProjectId = null;

// ==========================================================================
// 2. نظام الحماية وتسجيل الدخول الأمني (Authentication & Password Security)
// ==========================================================================

// دالة تشفير SHA-256 آمنة عبر Web Crypto API
async function hashString(str) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const buffer = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      console.warn("Crypto API fallback activated", e);
    }
  }
  // دالة بديلة في حال عدم توفر Web Crypto
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

// التحقق من حالة الجلسة الحالية
function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
}

// التحقق من صحة كلمة المرور
async function verifyPassword(inputPassword) {
  const storedHash = localStorage.getItem(PASSWORD_HASH_KEY);

  if (storedHash) {
    const inputHash = await hashString(inputPassword);
    return inputHash === storedHash;
  } else {
    // لم يتم تعيين كلمة مرور مخصصة بعد: التحقق من الكلمات الافتراضية
    return DEFAULT_PASSWORDS.includes(inputPassword);
  }
}

// محاولة تسجيل الدخول
async function handleAdminLogin(e) {
  if (e) e.preventDefault();

  const passwordInput = document.getElementById("admin-login-password");
  const errorMsg = document.getElementById("admin-login-error");
  const inputVal = passwordInput ? passwordInput.value.trim() : "";

  if (!inputVal) {
    if (errorMsg) {
      errorMsg.textContent = "يرجى كتابة كلمة المرور للمتابعة";
      errorMsg.style.display = "block";
    }
    return;
  }

  const isValid = await verifyPassword(inputVal);

  if (isValid) {
    // تسجيل الجلسة بنجاح
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    if (errorMsg) errorMsg.style.display = "none";
    if (passwordInput) passwordInput.value = "";

    closeLoginModal();
    showToast("تم تسجيل الدخول بنجاح! مرحباً بك 👑", "success");

    // فتح لوحة التحكم بعد التحقق
    openAdminModalDirect();

    // إذا كان هناك مشروع بانتظار التعديل
    if (pendingEditProjectId) {
      startEditProject(pendingEditProjectId);
      pendingEditProjectId = null;
    }
  } else {
    if (errorMsg) {
      errorMsg.textContent = "كلمة المرور غير صحيحة! يرجى المحاولة مجدداً.";
      errorMsg.style.display = "block";
      // تأثير الاهتزاز عند الخطأ
      const box = document.querySelector(".login-card");
      if (box) {
        box.classList.remove("shake-anim");
        void box.offsetWidth; // trigger reflow
        box.classList.add("shake-anim");
      }
    }
  }
}

// تسجيل الخروج
function logoutAdmin() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  closeAdminModal();
  showToast("تم تسجيل الخروج وقفل لوحة التحكم بنجاح 🔒", "success");
}

// تغيير كلمة المرور
async function handleChangePassword(e) {
  if (e) e.preventDefault();

  if (!isAdminAuthenticated()) {
    showToast("يجب تسجيل الدخول أولاً لتغيير كلمة المرور", "error");
    return;
  }

  const oldPass = document.getElementById("pwd-current").value.trim();
  const newPass = document.getElementById("pwd-new").value.trim();
  const confirmPass = document.getElementById("pwd-confirm").value.trim();

  if (!oldPass || !newPass || !confirmPass) {
    showToast("يرجى ملء جميع حقول تغيير كلمة المرور", "error");
    return;
  }

  const isOldValid = await verifyPassword(oldPass);
  if (!isOldValid) {
    showToast("كلمة المرور الحالية غير صحيحة!", "error");
    return;
  }

  if (newPass.length < 4) {
    showToast("كلمة المرور الجديدة قصيرة جداً (4 أحرف على الأقل)", "error");
    return;
  }

  if (newPass !== confirmPass) {
    showToast("كلمة المرور الجديدة وتأكيدها غير متطابقين!", "error");
    return;
  }

  // حفظ التشفير الجديد
  const newHash = await hashString(newPass);
  localStorage.setItem(PASSWORD_HASH_KEY, newHash);

  document.getElementById("admin-password-form").reset();
  showToast("تم تحديث وحفظ كلمة المرور الجديدة بنجاح! 🔑", "success");
}

// إظهار / إخفاء كلمة المرور في خانة الإدخال
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (btn) btn.textContent = "🙈";
  } else {
    input.type = "password";
    if (btn) btn.textContent = "👁️";
  }
}

// التحكم بنافذة تسجيل الدخول (Login Modal)
function openLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  const errorMsg = document.getElementById("admin-login-error");
  const pwdInput = document.getElementById("admin-login-password");

  if (modal) {
    if (errorMsg) errorMsg.style.display = "none";
    if (pwdInput) {
      pwdInput.value = "";
      setTimeout(() => pwdInput.focus(), 150);
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.classList.remove("active");
    if (!document.getElementById("admin-modal")?.classList.contains("active")) {
      document.body.style.overflow = "";
    }
  }
}

// ==========================================================================
// 3. دوال التخزين المحلي للمشاريع (LocalStorage Management)
// ==========================================================================

function getStoredProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return [...DEFAULT_PROJECTS];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_PROJECTS];
  } catch (err) {
    console.error("خطأ في قراءة بيانات المشاريع:", err);
    return [...DEFAULT_PROJECTS];
  }
}

function saveStoredProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  renderWebsiteProjects();
  renderAdminProjectsList();
}

// ==========================================================================
// 4. عرض المشاريع في صفحة الموقع الرئيسية (Live Site Rendering)
// ==========================================================================

function renderWebsiteProjects() {
  const gridContainer = document.getElementById("portfolio-grid");
  if (!gridContainer) return;

  const projects = getStoredProjects();

  if (projects.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-projects-state">
        <div class="empty-icon">📁</div>
        <h3>لا توجد مشاريع مضافة حالياً</h3>
        <p>يمكنك البدء بإضافة أعمالك ومشاريعك الرائعة عبر لوحة التحكم الآمنة.</p>
        <button type="button" class="btn btn-primary btn-sm" onclick="openAdminModal()">
          ➕ إضافة أول عمل الآن
        </button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = projects.map(proj => {
    const tagsHtml = (proj.tags || []).map(tag => `<span class="project-tag">${escapeHtml(tag.trim())}</span>`).join("");
    const linkUrl = proj.link && proj.link.trim() ? proj.link.trim() : "#contact";
    const isExternal = linkUrl.startsWith("http");

    return `
      <article class="project-card" data-project-id="${proj.id}">
        <div class="project-thumb">
          <img src="${escapeHtml(proj.image || 'images/project1.svg')}" alt="${escapeHtml(proj.title)}" loading="lazy" onerror="this.src='images/project1.svg'">
          <div class="project-overlay"></div>
        </div>
        <div class="project-body">
          <div class="project-tags">
            ${tagsHtml}
          </div>
          <h3 class="project-title">${escapeHtml(proj.title)}</h3>
          <p class="project-desc">${escapeHtml(proj.desc)}</p>
          <div class="project-footer">
            <a href="${escapeHtml(linkUrl)}" class="project-link" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              <span>معاينة المشروع</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </a>
            <button type="button" class="btn-quick-edit" onclick="editProjectFromCard('${proj.id}')" title="تعديل هذا المشروع">
              ✏️ تعديل
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================================================
// 5. عرض قائمة المشاريع داخل لوحة التحكم (Admin Panel List)
// ==========================================================================

function renderAdminProjectsList() {
  const listContainer = document.getElementById("admin-projects-list");
  const countBadge = document.getElementById("admin-projects-count");
  if (!listContainer) return;

  const projects = getStoredProjects();
  if (countBadge) countBadge.textContent = `${projects.length} عمل`;

  if (projects.length === 0) {
    listContainer.innerHTML = `
      <div class="admin-empty-state">
        <p>لم يتم العثور على أي أعمال. استخدم النموذج لإضافة عملك الأول!</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = projects.map(proj => {
    return `
      <div class="admin-item-card" data-id="${proj.id}">
        <div class="admin-item-preview">
          <img src="${escapeHtml(proj.image || 'images/project1.svg')}" alt="${escapeHtml(proj.title)}" onerror="this.src='images/project1.svg'">
        </div>
        <div class="admin-item-details">
          <h4>${escapeHtml(proj.title)}</h4>
          <p>${escapeHtml(proj.tags.join(" • "))}</p>
        </div>
        <div class="admin-item-btns">
          <button type="button" class="btn-action-edit" onclick="startEditProject('${proj.id}')" title="تعديل">
            ✏️
          </button>
          <button type="button" class="btn-action-delete" onclick="deleteProject('${proj.id}')" title="حذف">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================================================
// 6. إدارة نموذج الإضافة والتعديل
// ==========================================================================

let currentEditingId = null;
let currentUploadedImageData = "";

function setupAdminForm() {
  const form = document.getElementById("admin-project-form");
  const loginForm = document.getElementById("admin-login-form");
  const passwordForm = document.getElementById("admin-password-form");
  const fileInput = document.getElementById("project-image-file");
  const imagePreview = document.getElementById("image-live-preview");
  const imageUrlInput = document.getElementById("project-image-url");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const resetDefaultsBtn = document.getElementById("btn-reset-defaults");

  // تفعيل نموذج تسجيل الدخول
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }

  // تفعيل نموذج تغيير كلمة المرور
  if (passwordForm) {
    passwordForm.addEventListener("submit", handleChangePassword);
  }

  // معاينة الصورة عند رفع ملف
  if (fileInput) {
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2.5 * 1024 * 1024) {
          showToast("حجم الصورة كبير، يفضل اختيار صورة أقل من 2.5 ميجابايت", "error");
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentUploadedImageData = evt.target.result;
          if (imagePreview) {
            imagePreview.src = currentUploadedImageData;
            imagePreview.style.display = "block";
          }
          if (imageUrlInput) imageUrlInput.value = "";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // معاينة الصورة عند كتابة رابط خارجي
  if (imageUrlInput) {
    imageUrlInput.addEventListener("input", function() {
      if (imageUrlInput.value.trim()) {
        currentUploadedImageData = "";
        if (fileInput) fileInput.value = "";
        if (imagePreview) {
          imagePreview.src = imageUrlInput.value.trim();
          imagePreview.style.display = "block";
        }
      }
    });
  }

  // حفظ المشروع (إضافة أو تحديث) مع التحقق الأمني
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      if (!isAdminAuthenticated()) {
        showToast("جلسة العمل غير موثقة! يرجى تسجيل الدخول أولاً 🔒", "error");
        closeAdminModal();
        openLoginModal();
        return;
      }

      const title = document.getElementById("project-title").value.trim();
      const desc = document.getElementById("project-desc").value.trim();
      const tagsRaw = document.getElementById("project-tags").value.trim();
      const link = document.getElementById("project-link").value.trim();
      const urlVal = imageUrlInput ? imageUrlInput.value.trim() : "";

      if (!title || !desc) {
        showToast("يرجى ملء اسم المشروع والوصف المختصر", "error");
        return;
      }

      const tagsArray = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : ["مشروع ويب"];
      let finalImage = currentUploadedImageData || urlVal;

      if (!finalImage) {
        finalImage = "images/project1.svg";
      }

      const projects = getStoredProjects();

      if (currentEditingId) {
        // وضع التعديل (Update)
        const index = projects.findIndex(p => p.id === currentEditingId);
        if (index !== -1) {
          projects[index] = {
            ...projects[index],
            title: title,
            desc: desc,
            tags: tagsArray,
            link: link,
            image: finalImage || projects[index].image
          };
          saveStoredProjects(projects);
          showToast("تم تحديث بيانات المشروع بنجاح! 🚀", "success");
        }
      } else {
        // وضع الإضافة الجديدة (Create)
        const newProject = {
          id: "proj-" + Date.now(),
          title: title,
          desc: desc,
          tags: tagsArray,
          link: link || "#contact",
          image: finalImage
        };
        projects.unshift(newProject);
        saveStoredProjects(projects);
        showToast("تمت إضافة المشروع الجديد بنجاح! ✨", "success");
      }

      resetAdminForm();
    });
  }

  // زر إلغاء التعديل
  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetAdminForm);
  }

  // زر استعادة المشاريع الافتراضية مع التحقق الأمني
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener("click", function() {
      if (!isAdminAuthenticated()) {
        showToast("يجب تسجيل الدخول كمسؤول أولاً", "error");
        return;
      }

      if (confirm("هل أنت متأكد من رغبتك في استعادة المشاريع الافتراضية الأصلية؟")) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
        renderWebsiteProjects();
        renderAdminProjectsList();
        resetAdminForm();
        showToast("تم استعادة المشاريع الافتراضية بنجاح 🔄", "success");
      }
    });
  }
}

// بدء التعديل على مشروع محدد
function startEditProject(id) {
  if (!isAdminAuthenticated()) {
    pendingEditProjectId = id;
    openLoginModal();
    return;
  }

  const projects = getStoredProjects();
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  currentEditingId = id;

  document.getElementById("project-title").value = proj.title;
  document.getElementById("project-desc").value = proj.desc;
  document.getElementById("project-tags").value = proj.tags.join(", ");
  document.getElementById("project-link").value = proj.link || "";

  const imageUrlInput = document.getElementById("project-image-url");
  const imagePreview = document.getElementById("image-live-preview");
  const submitBtn = document.getElementById("form-submit-btn");
  const formTitle = document.getElementById("admin-form-title");
  const cancelBtn = document.getElementById("cancel-edit-btn");

  if (proj.image && !proj.image.startsWith("data:")) {
    if (imageUrlInput) imageUrlInput.value = proj.image;
  }
  currentUploadedImageData = proj.image && proj.image.startsWith("data:") ? proj.image : "";

  if (imagePreview) {
    imagePreview.src = proj.image || "images/project1.svg";
    imagePreview.style.display = "block";
  }

  if (submitBtn) {
    submitBtn.innerHTML = `<span>تحديث المشروع</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }
  if (formTitle) {
    formTitle.innerHTML = `تعديل المشروع: <span class="highlight-title">${escapeHtml(proj.title)}</span>`;
  }
  if (cancelBtn) {
    cancelBtn.style.display = "inline-flex";
  }

  // التمرير إلى النموذج
  const formCol = document.querySelector(".admin-form-column");
  if (formCol) formCol.scrollIntoView({ behavior: "smooth", block: "start" });
}

// تعديل مباشر من بطاقة المشروع في الصفحة الرئيسية
function editProjectFromCard(id) {
  if (!isAdminAuthenticated()) {
    pendingEditProjectId = id;
    openLoginModal();
  } else {
    openAdminModalDirect();
    startEditProject(id);
  }
}

// حذف مشروع مع التحقق الأمني
function deleteProject(id) {
  if (!isAdminAuthenticated()) {
    showToast("يرجى تسجيل الدخول أولاً لتنفيذ عملية الحذف", "error");
    openLoginModal();
    return;
  }

  const projects = getStoredProjects();
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  if (confirm(`هل أنت متأكد من حذف مشروع "${proj.title}"؟`)) {
    const updated = projects.filter(p => p.id !== id);
    saveStoredProjects(updated);
    if (currentEditingId === id) resetAdminForm();
    showToast("تم حذف المشروع بنجاح 🗑️", "success");
  }
}

// تصفير النموذج
function resetAdminForm() {
  currentEditingId = null;
  currentUploadedImageData = "";

  const form = document.getElementById("admin-project-form");
  if (form) form.reset();

  const imagePreview = document.getElementById("image-live-preview");
  if (imagePreview) {
    imagePreview.src = "images/project1.svg";
  }

  const submitBtn = document.getElementById("form-submit-btn");
  if (submitBtn) {
    submitBtn.innerHTML = `<span>حفظ المشروع في المعرض</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }

  const formTitle = document.getElementById("admin-form-title");
  if (formTitle) {
    formTitle.textContent = "إضافة عمل جديد إلى المعرض";
  }

  const cancelBtn = document.getElementById("cancel-edit-btn");
  if (cancelBtn) {
    cancelBtn.style.display = "none";
  }
}

// ==========================================================================
// 7. التحكم في فتح وإغلاق النوافذ (Modal Open/Close)
// ==========================================================================

// الدخول إلى لوحة التحكم - يطلب كلمة المرور إذا لم يكن مسجلاً
function openAdminModal() {
  if (isAdminAuthenticated()) {
    openAdminModalDirect();
  } else {
    openLoginModal();
  }
}

// فتح لوحة التحكم بعد التحقق الأمني
function openAdminModalDirect() {
  const modal = document.getElementById("admin-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    renderAdminProjectsList();
  }
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// إغلاق النوافذ عند الضغط على زر Esc
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeAdminModal();
    closeLoginModal();
  }
});

// ==========================================================================
// 8. نظام الإشعارات المنبثقة (Toast Notifications) والدوال المساعدة
// ==========================================================================

function showToast(message, type = "success") {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast-notification show ${type}`;

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// 9. تشغيل النظام عند اكتمال تحميل الصفحة (Init)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
  renderWebsiteProjects();
  setupAdminForm();
});
