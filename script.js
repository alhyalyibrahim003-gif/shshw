// ================== رابط Google Apps Script ==================
const scriptURL = 'https://script.google.com/macros/s/AKfycbx8aD02LxWq1U9iD17VlqgcRhZ2PP5G7jlkjtdTsWxgG3EgHOUclkJw1M19FpFwTQntgQ/exec'; // استبدل برابطك

// ================== إدارة اللغة ==================
const translations = {
    ar: {
        pageTitle: "تسجيل الدخول - منصتي",
        brandTitle: "مرحباً بك",
        brandSubtitle: "بوابتك الأنيقة للعالم الرقمي",
        loginTitle: "تسجيل الدخول",
        registerTitle: "إنشاء حساب جديد",
        verifyTitle: "تفعيل الحساب",
        verifyInstruction: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني",
        loginBtn: "دخول",
        registerBtn: "متابعة التسجيل",
        verifyBtn: "تحقق",
        showRegisterLink: "إنشاء حساب جديد",
        showLoginLink: "تسجيل الدخول هنا",
        backToRegisterLink: "تعديل البيانات",
        logoutConfirmMsg: "هل أنت متأكد من تسجيل الخروج؟",
        suspendedMsg: "تم تعليق حسابك. يرجى التواصل مع الدعم.",
        activationSuccessMsg: "تم تفعيل حسابك بنجاح! 🎉",
        confirmYes: "نعم",
        confirmNo: "لا",
        ok: "حسناً",
        loginErrorInvalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        loginErrorBanned: "الحساب محظور.",
        loginErrorSuspended: "الحساب معلق مؤقتاً.",
        registerErrorEmailExists: "البريد الإلكتروني مسجل مسبقاً.",
        registerErrorGeneral: "حدث خطأ أثناء التسجيل. حاول مرة أخرى.",
        verifyErrorInvalid: "رمز التحقق غير صحيح.",
        networkError: "خطأ في الاتصال بالخادم. تحقق من الإنترنت.",
        unknownError: "حدث خطأ غير معروف.",
        emailPlaceholder: "البريد الإلكتروني",
        passwordPlaceholder: "كلمة المرور",
        namePlaceholder: "الاسم الكامل",
        agePlaceholder: "العمر (أقصى 60)",
        countryPlaceholder: "الدولة",
        confirmPasswordPlaceholder: "تأكيد كلمة المرور",
        codePlaceholder: "6 أرقام",
        sendingCode: "جاري إرسال الرمز...",
        verifying: "جاري التحقق...",
        
        // --- الترجمات الجديدة المضافة ---
        errAllFieldsRequired: "جميع الحقول مطلوبة.",
        errPasswordMismatch: "كلمتا المرور غير متطابقتين.",
        errAgeLimit: "العمر يجب ألا يتجاوز 60 عاماً.",
        errPasswordLength: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
        errPageError: "خطأ في الصفحة، يرجى تحديث المتصفح",
        verifySentTo: "تم إرسال رمز التحقق إلى:",
        countries: [
            "مصر", "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عمان", "اليمن", 
            "العراق", "الأردن", "لبنان", "سوريا", "فلسطين", "ليبيا", "تونس", "الجزائر", 
            "المغرب", "موريتانيا", "السودان", "تركيا", "إيران", "باكستان", "أفغانستان", "الهند", 
            "أمريكا", "كندا", "بريطانيا", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "روسيا", 
            "الصين", "اليابان", "أستراليا"
        ]
    },
    en: {
        pageTitle: "Login - My Platform",
        brandTitle: "Welcome",
        brandSubtitle: "Your elegant gateway to the digital world",
        loginTitle: "Login",
        registerTitle: "Create New Account",
        verifyTitle: "Verify Account",
        verifyInstruction: "Enter the verification code sent to your email",
        loginBtn: "Login",
        registerBtn: "Register",
        verifyBtn: "Verify",
        showRegisterLink: "Create new account",
        showLoginLink: "Login here",
        backToRegisterLink: "Edit data",
        logoutConfirmMsg: "Are you sure you want to logout?",
        suspendedMsg: "Your account is suspended. Please contact support.",
        activationSuccessMsg: "Your account has been activated successfully! 🎉",
        confirmYes: "Yes",
        confirmNo: "No",
        ok: "OK",
        loginErrorInvalid: "Invalid email or password.",
        loginErrorBanned: "Account banned.",
        loginErrorSuspended: "Account temporarily suspended.",
        registerErrorEmailExists: "Email already registered.",
        registerErrorGeneral: "An error occurred during registration. Please try again.",
        verifyErrorInvalid: "Invalid verification code.",
        networkError: "Connection error. Please check your internet.",
        unknownError: "An unknown error occurred.",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        namePlaceholder: "Full Name",
        agePlaceholder: "Age (max 60)",
        countryPlaceholder: "Country",
        confirmPasswordPlaceholder: "Confirm Password",
        codePlaceholder: "6 digits",
        sendingCode: "Sending code...",
        verifying: "Verifying...",
        
        // --- New Translations Added ---
        errAllFieldsRequired: "All fields are required.",
        errPasswordMismatch: "Passwords do not match.",
        errAgeLimit: "Age must not exceed 60 years.",
        errPasswordLength: "Password must be at least 8 characters.",
        errPageError: "Page error, please refresh the browser",
        verifySentTo: "Verification code sent to:",
        countries: [
            "Egypt", "Saudi Arabia", "UAE", "Kuwait", "Qatar", "Bahrain", "Oman", "Yemen", 
            "Iraq", "Jordan", "Lebanon", "Syria", "Palestine", "Libya", "Tunisia", "Algeria", 
            "Morocco", "Mauritania", "Sudan", "Turkey", "Iran", "Pakistan", "Afghanistan", "India", 
            "USA", "Canada", "UK", "France", "Germany", "Italy", "Spain", "Russia", 
            "China", "Japan", "Australia"
        ]
    }
};

let currentLang = localStorage.getItem('language') || 'ar';

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
function safeSetPlaceholder(id, text) {
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
}

// دالة لتحديث قائمة الدول بناءً على اللغة
function updateCountriesList() {
    const datalist = document.getElementById('countries-list');
    if (!datalist) return;
    datalist.innerHTML = ''; // تفريغ القائمة القديمة
    const countries = translations[currentLang].countries;
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        datalist.appendChild(option);
    });
}

function applyLanguage() {
    const t = translations[currentLang];
    document.title = t.pageTitle;
    safeSetText('brandTitle', t.brandTitle);
    safeSetText('brandSubtitle', t.brandSubtitle);
    safeSetText('loginTitle', t.loginTitle);
    safeSetText('registerTitle', t.registerTitle);
    safeSetText('verifyTitle', t.verifyTitle);
    safeSetText('verifyInstruction', t.verifyInstruction);
    safeSetText('loginBtn', t.loginBtn);
    safeSetText('registerBtn', t.registerBtn);
    safeSetText('verifyBtn', t.verifyBtn);
    safeSetText('show-register', t.showRegisterLink);
    safeSetText('show-login', t.showLoginLink);
    safeSetText('back-to-register', t.backToRegisterLink);
    safeSetText('logoutConfirmMsg', t.logoutConfirmMsg);
    safeSetText('suspendedMsg', t.suspendedMsg);
    safeSetText('activationSuccessMsg', t.activationSuccessMsg);
    safeSetText('confirmLogout', t.confirmYes);
    safeSetText('cancelLogout', t.confirmNo);
    safeSetText('suspendedOkBtn', t.ok);
    safeSetText('activationSuccessOkBtn', t.ok);

    safeSetPlaceholder('login-email', t.emailPlaceholder);
    safeSetPlaceholder('login-password', t.passwordPlaceholder);
    safeSetPlaceholder('reg-name', t.namePlaceholder);
    safeSetPlaceholder('reg-age', t.agePlaceholder);
    safeSetPlaceholder('reg-country', t.countryPlaceholder);
    safeSetPlaceholder('reg-email', t.emailPlaceholder);
    safeSetPlaceholder('reg-password', t.passwordPlaceholder);
    safeSetPlaceholder('reg-confirm-password', t.confirmPasswordPlaceholder);
    safeSetPlaceholder('verify-code', t.codePlaceholder);

    const htmlTag = document.documentElement;
    if (currentLang === 'ar') {
        htmlTag.setAttribute('dir', 'rtl');
        htmlTag.setAttribute('lang', 'ar');
    } else {
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.setAttribute('lang', 'en');
    }

    const langCheckbox = document.getElementById('langCheckbox');
    if (langCheckbox) langCheckbox.checked = (currentLang === 'en');

    // تحديث قائمة الدول
    updateCountriesList();
}

const langCheckbox = document.getElementById('langCheckbox');
if (langCheckbox) {
    langCheckbox.addEventListener('change', () => {
        currentLang = langCheckbox.checked ? 'en' : 'ar';
        localStorage.setItem('language', currentLang);
        applyLanguage();
    });
}
applyLanguage();

// ================== إدارة الوضع الداكن/الفاتح ==================
const themeCheckbox = document.getElementById('themeCheckbox');
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeCheckbox) themeCheckbox.checked = true;
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeCheckbox) themeCheckbox.checked = false;
}
if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ================== منطق النماذج ==================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const verifyForm = document.getElementById('verify-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const backToRegisterBtn = document.getElementById('back-to-register');
    const errorMsg = document.getElementById('error-message');
    const loginErrorMsg = document.getElementById('login-error-message');
    const verifyErrorMsg = document.getElementById('verify-error-message');
    const verifyTextInfo = verifyForm ? verifyForm.querySelector('p') : null;

    let tempUserName = '';
    let tempUserEmail = '';
    let tempUserAge = '';
    let tempUserCountry = '';
    let generatedOTP = '';

    function switchForms(formToHide, formToShow) {
        if (formToHide && formToShow) {
            formToHide.classList.remove('form-active');
            formToHide.classList.add('form-hidden');
            formToShow.classList.remove('form-hidden');
            formToShow.classList.add('form-active');
        }
    }

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
            switchForms(loginForm, registerForm);
        });
    }
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';
            switchForms(registerForm, loginForm);
        });
    }
    if (backToRegisterBtn) {
        backToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (verifyErrorMsg) verifyErrorMsg.style.display = 'none';
            switchForms(verifyForm, registerForm);
        });
    }

    // ================== تسجيل الدخول ==================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';

            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const loginBtn = document.getElementById('loginBtn');
            const t = translations[currentLang];

            if (!emailInput || !passwordInput || !loginBtn) {
                if (loginErrorMsg) {
                    loginErrorMsg.innerText = t.errPageError;
                    loginErrorMsg.style.display = 'block';
                }
                return;
            }

            const loginEmail = emailInput.value.trim();
            const loginPassword = passwordInput.value.trim();

            if (!loginEmail || !loginPassword) {
                if (loginErrorMsg) {
                    loginErrorMsg.innerText = t.loginErrorInvalid;
                    loginErrorMsg.style.display = 'block';
                }
                return;
            }

            const originalText = loginBtn.innerText;
            loginBtn.innerText = t.verifying;
            loginBtn.disabled = true;

            const formData = new FormData();
            formData.append('action', 'login');
            formData.append('email', loginEmail);
            formData.append('password', loginPassword);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => res.text())
                .then(result => {
                    loginBtn.innerText = originalText;
                    loginBtn.disabled = false;

                    if (result.startsWith('Success')) {
                        const parts = result.split('|');
                        const userName = parts[1] || 'مستخدم';
                        const userAge = parts[2] || '?';
                        const userCountry = parts[4] || '';
                        const developerEmail = 'ibrahimtarteel1@gmail.com';
                        localStorage.setItem('userLoggedIn', 'true');
                        localStorage.setItem('userEmail', loginEmail);
                        localStorage.setItem('userName', userName);
                        localStorage.setItem('userAge', userAge);
                        if (userCountry) localStorage.setItem('userCountry', userCountry);
                        localStorage.setItem('isDeveloper', loginEmail === developerEmail ? 'true' : 'false');
                        window.location.href = 'profile.html';
                    } else if (result === 'Banned') {
                        if (loginErrorMsg) { loginErrorMsg.innerText = t.loginErrorBanned; loginErrorMsg.style.display = 'block'; }
                    } else if (result === 'Suspended') {
                        if (loginErrorMsg) { loginErrorMsg.innerText = t.loginErrorSuspended; loginErrorMsg.style.display = 'block'; }
                    } else if (result === 'Invalid') {
                        if (loginErrorMsg) { loginErrorMsg.innerText = t.loginErrorInvalid; loginErrorMsg.style.display = 'block'; }
                    } else {
                        if (loginErrorMsg) { loginErrorMsg.innerText = t.unknownError; loginErrorMsg.style.display = 'block'; }
                    }
                })
                .catch(err => {
                    loginBtn.innerText = originalText;
                    loginBtn.disabled = false;
                    if (loginErrorMsg) { loginErrorMsg.innerText = t.networkError; loginErrorMsg.style.display = 'block'; }
                });
        });
    }

    // ================== إنشاء حساب جديد ==================
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';
            const regName = document.getElementById('reg-name')?.value.trim();
            const regAge = document.getElementById('reg-age')?.value.trim();
            const regCountry = document.getElementById('reg-country')?.value.trim();
            const regEmail = document.getElementById('reg-email')?.value.trim();
            const regPassword = document.getElementById('reg-password')?.value.trim();
            const regConfirmPassword = document.getElementById('reg-confirm-password')?.value.trim();

            const t = translations[currentLang];
            
            if (!regName || !regAge || !regCountry || !regEmail || !regPassword) {
                if (errorMsg) { errorMsg.innerText = t.errAllFieldsRequired; errorMsg.style.display = 'block'; }
                return;
            }
            if (regPassword !== regConfirmPassword) {
                if (errorMsg) { errorMsg.innerText = t.errPasswordMismatch; errorMsg.style.display = 'block'; }
                return;
            }
            if (parseInt(regAge) > 60) {
                if (errorMsg) { errorMsg.innerText = t.errAgeLimit; errorMsg.style.display = 'block'; }
                return;
            }
            if (regPassword.length < 8) {
                if (errorMsg) { errorMsg.innerText = t.errPasswordLength; errorMsg.style.display = 'block'; }
                return;
            }

            generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            tempUserName = regName;
            tempUserEmail = regEmail;
            tempUserAge = regAge;
            tempUserCountry = regCountry;

            const formData = new FormData();
            formData.append('action', 'register');
            formData.append('name', regName);
            formData.append('age', regAge);
            formData.append('email', regEmail);
            formData.append('password', regPassword);
            formData.append('otp', generatedOTP);
            formData.append('country', regCountry);

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerText;
            submitBtn.innerText = t.sendingCode;
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(res => res.text())
                .then(result => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    if (result === 'Success') {
                        if (verifyTextInfo) verifyTextInfo.innerText = `${t.verifySentTo} ${regEmail}`;
                        switchForms(registerForm, verifyForm);
                    } else if (result === 'EmailExists') {
                        if (errorMsg) { errorMsg.innerText = t.registerErrorEmailExists; errorMsg.style.display = 'block'; }
                    } else {
                        if (errorMsg) { errorMsg.innerText = t.registerErrorGeneral + ' (' + result + ')'; errorMsg.style.display = 'block'; }
                    }
                })
                .catch(err => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    if (errorMsg) { errorMsg.innerText = t.networkError; errorMsg.style.display = 'block'; }
                });
        });
    }

    // ================== التحقق من رمز OTP ==================
    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (verifyErrorMsg) verifyErrorMsg.style.display = 'none';
            const verifyCode = document.getElementById('verify-code')?.value.trim();
            const t = translations[currentLang];
            if (verifyCode === generatedOTP) {
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userName', tempUserName);
                localStorage.setItem('userEmail', tempUserEmail);
                localStorage.setItem('userAge', tempUserAge);
                localStorage.setItem('userCountry', tempUserCountry);
                const successDialog = document.getElementById('activationSuccessDialog');
                if (successDialog) successDialog.classList.remove('hidden');
            } else {
                if (verifyErrorMsg) { verifyErrorMsg.innerText = t.verifyErrorInvalid; verifyErrorMsg.style.display = 'block'; }
            }
        });
    }
});

// ================== زر تأكيد نجاح التفعيل ==================
const activationSuccessOkBtn = document.getElementById('activationSuccessOkBtn');
if (activationSuccessOkBtn) {
    activationSuccessOkBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// ================== إغلاق مربعات الحوار ==================
document.querySelectorAll('.dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.classList.add('hidden');
    });
});
