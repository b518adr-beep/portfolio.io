# 🚀 موقع Portfolio الشخصي | أبو ساهر الشافعي

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

<p align="center">
  <b>موقع شخصي ومعرض أعمال رقمي فاخر للمطور أبو ساهر الشافعي، مزوّد بلوحة تحكم عربية آمنة ومحمية بكلمة مرور لإدارة المحتوى محلياً (CMS) بدون الحاجة إلى خوادم أو قواعد بيانات.</b>
</p>

[معاينة حية للموقع](#-نشر-الموقع-مباشرة-على-github-pages) • [المميزات](#-أبرز-المميزات) • [هيكل الملفات](#-هيكل-المشروع) • [طريقة الرفع على GitHub](#-طريقة-رفع-المشروع-على-github) • [لوحة التحكم والأمان](#-لوحة-التحكم-والأمان)

</div>

---

## 🌟 أبرز المميزات

- 💎 **تصميم عصري داكن (Minimal Modern Dark UI):** باللون الكحلي الفاخر (`#0F172A`) مع لمسات Glassmorphism وتدرجات الأزرق والسماوي التقني.
- 📱 **متجاوب بالكامل (Fully Responsive):** تجربة تصفح مثالية وسلسة على مختلف أحجام الشاشات (الهواتف، الأجهزة اللوحية، والشاشات الكبيرة).
- 🇸🇦 **عربي بالكامل وتوافق RTL:** اتجاه نصوص وتنسيقات دقيقة مدعومة بأحدث خطوط Google Fonts (Cairo & Tajawal).
- 🔐 **لوحة تحكم آمنة ومحمية بكلمة مرور (Secure CMS):**
  - بوابة تحقق أمني تمنع الزوار من التعديل.
  - تشفير محلي آمن لكلمات المرور عبر Web Crypto API (`SHA-256`).
  - إمكانية تغيير كلمة المرور وزر تسجيل خروج وقفل اللوحة.
- ⚡ **تحديث فوري وتخزين محلي (Real-time Live Sync):**
  - إضافة، تعديل، وحذف المشاريع مع ظهور التغييرات فوراً في المعرض.
  - حفظ دائم للبيانات في المتصفح عبر `localStorage`.
- 📁 **رفع الصور مباشرة:** دعم رفع صور المشاريع من الجهاز مباشرة (تحويل تلقائي إلى Data URL) مع معاينة حية.
- 🚀 **بدون أطر عمل ثقيلة (Zero Dependencies):** Vanilla HTML5/CSS3/JS نقي، سريع التحميل وصديق لمحركات البحث (SEO).

---

## 📁 هيكل المشروع

تم تنظيم المشروع ليكون جاهزاً للرفع المباشر والعمل الفوري على **GitHub Pages**:

```text
portfolio/
├── .gitignore            # الملفات المستبعدة من التتبع
├── LICENSE               # رخصة الاستخدام المفتوحة (MIT License)
├── README.md             # التوثيق الشامل ودليل التشغيل
├── index.html            # ملف الصفحة الرئيسي وبوابات التحكم
├── style.css             # نظام التصميم والمتغيرات والتجاوب
├── script.js             # محرك B والتشفير والتخزين
└── images/               # مجلد الأصول والصور
    ├── my-photo.png      # الصورة الشخصية الرسمية
    ├── avatar.svg        # الرمز البرمجي التوضيحي
    ├── project1.svg      # نموذج متجر التقنية والأناقة
    ├── project2.svg      # نموذج متجر مراعي تيماء
    ├── project3.svg      # نموذج نظام HRMS
    └── project4.svg      # نموذج صفحات الهبوط
```

---

## 🔐 لوحة التحكم والأمان

لوحة التحكم مخصصة لمالك الموقع فقط ومحمية ببوابة تحقق:
- **تسجيل الخروج:** عبر زر `🚪 تسجيل الخروج` في أعلى اللوحة لقفل النظام.

---

## 📤 طريقة رفع المشروع على GitHub

يمكنك رفع المشروع إلى حسابك في GitHub بإحدى الطريقتين التاليتين:

### الطريقة الأولى: عبر موجه الأوامر (Terminal / Git CLI) ⚡ (الموصى بها)

1. افتح موجه الأوامر (Git Bash أو PowerShell أو Terminal) داخل مجلد المشروع:
   ```bash
   cd C:\Users\HUAWWI\.gemini\antigravity\scratch\portfolio
   ```

2. قم بتهيئة مستودع Git محلي:
   ```bash
   git init
   ```

3. أضف جميع الملفات:
   ```bash
   git add .
   ```

4. سجّل التعديلات (Commit):
   ```bash
   git commit -m "Initial commit: Portfolio website with secure CMS"
   ```

5. غيّر اسم الفرع الأساسي إلى `main`:
   ```bash
   git branch -M main
   ```

6. أنشئ مستودعاً جديداً (New Repository) فارغاً على حسابك في GitHub باسم `portfolio`.

7. اربط المستودع المحلي بمستودع GitHub (استبدل `YOUR-USERNAME` باسم حسابك):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   ```

8. ارفع الملفات إلى GitHub:
   ```bash
   git push -u origin main
   ```

---

### الطريقة الثانية: عبر موقع GitHub مباشرة (السحب والإفلات بدون أوامر) 🖱️

1. ادخل إلى موقع [GitHub](https://github.com) وسجّل دخولك.
2. انقر على زر **New Repository** (أو علامة `+` ثم `New repository`).
3. أدخل اسم المستودع: `portfolio`، واجعله **Public**، **لا تحدد** خيار إضافة README لأن الملف موجود بالفعل.
4. اضغط على زر **Create repository**.
5. في الصفحة التي تظهر لك، اضغط على خيار: **uploading an existing file**.
6. اسحب جميع ملفات ومجلدات المشروع وأفلتها في المتصفح:
   - `index.html`
   - `style.css`
   - `script.js`
   - `.gitignore`
   - `LICENSE`
   - `README.md`
   - مجلد `images/` بكامل محتوياته.
7. اكتب في خانة الـ Commit: `Initial commit` ثم اضغط على **Commit changes**.

---

## 🌐 نشر الموقع مباشرة على GitHub Pages (مجاناً)

بعد رفع الملفات، يمكنك إتاحة الموقع أونلاين على الإنترنت مجاناً عبر **GitHub Pages** بالخطوات التالية:

1. افتح صفحة المستودع الخاص بك على GitHub.
2. اذهب إلى علامة التبويب **Settings** (الإعدادات) في أعلى الصفحة.
3. من القائمة الجانبية اليسرى، اضغط على **Pages**.
4. تحت قسم **Build and deployment**:
   - تأكد أن المصدر هو **Deploy from a branch**.
   - اختر الفرع: **`main`**.
   - اختر المجلد: **`/ (root)`**.
5. اضغط على زر **Save**.
6. انتظر دقيقة واحدة، ثم أعد تحديث الصفحة؛ سيظهر لك الرابط الحي لموقعك في مربع أخضر بالأعلى:
   ```text
   https://YOUR-USERNAME.github.io/portfolio/
   ```

---

## 📞 بيانات التواصل
- **الاسم:** أبو ساهر الشافعي
- **الموقع الجغرافي:** 📍 المملكة العربية السعودية
- **الهاتف / واتساب:** [+966 57 720 5172](https://wa.me/966577205172)
- **البريد الإلكتروني:** [badr.vip.517@gmail.com](mailto:badr.vip.517@gmail.com)

---

## 📄 الترخيص (License)
هذا المشروع مرخص تحت رخصة [MIT License](LICENSE).
