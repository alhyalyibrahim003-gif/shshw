// ==========================================
// 1. رابط التطبيق (Google Apps Script)
// ==========================================
const scriptURL = 'https://script.google.com/macros/s/AKfycbx8aD02LxWq1U9iD17VlqgcRhZ2PP5G7jlkjtdTsWxgG3EgHOUclkJw1M19FpFwTQntgQ/exec'; // استبدل برابطك

// ==========================================
// 2. بيانات المستخدم من localStorage
// ==========================================
const isLoggedIn = localStorage.getItem('userLoggedIn');
const userEmail = localStorage.getItem('userEmail');
const userName = localStorage.getItem('userName') || 'يا صديقي';
const userAge = localStorage.getItem('userAge') || '?';
let userCountry = localStorage.getItem('userCountry') || '';

userCountry = userCountry.trim().toLowerCase();
if (!userCountry) {
    userCountry = 'غير محدد';
    localStorage.setItem('userCountry', userCountry);
    console.warn('⚠️ لم يتم تحديد بلد للمستخدم. تم تعيين قيمة افتراضية: "غير محدد"');
}

let serverMessage = "";

// ==========================================
// 3. التحقق من تسجيل الدخول
// ==========================================
if (isLoggedIn !== 'true' || !userEmail) {
    window.location.href = 'index.html';
} else {
    function checkBanStatus() {
        const formData = new FormData();
        formData.append('action', 'check_status');
        formData.append('email', userEmail);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.text())
            .then(result => {
                if (result === 'Banned') {
                    alert('⚠️ لقد تم حظر حسابك للتو من قبل الإدارة. سيتم تسجيل خروجك فوراً.');
                    localStorage.clear();
                    window.location.href = 'index.html';
                } else if (result === 'Suspended') {
                    alert('⏳ تم تعليق حسابك مؤقتاً لمدة 5 دقائق. سيتم تسجيل خروجك الآن.');
                    localStorage.clear();
                    window.location.href = 'index.html';
                } else if (result === 'NotFound') {
                    alert('⚠️ تم حذف حسابك من النظام. سيتم تسجيل خروجك.');
                    localStorage.clear();
                    window.location.href = 'index.html';
                } else if (result.startsWith('Success')) {
                    const parts = result.split('|');
                    const messageFromServer = parts[3] ? parts[3].trim() : "";
                    serverMessage = messageFromServer;
                    displayTickerMessage(serverMessage);
                }
            })
            .catch(error => {
                console.log('خطأ في الاتصال بالخادم، سيتم إعادة المحاولة لاحقاً...', error);
            });
    }

    checkBanStatus();
    setInterval(checkBanStatus, 10000);
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function displayTickerMessage(message) {
    const tickerBox = document.getElementById('ticker-box');
    const tickerMessage = document.getElementById('ticker-message');
    if (!tickerBox || !tickerMessage) return;
    if (message && message !== "") {
        tickerMessage.innerText = message;
        tickerBox.style.display = 'block';
    } else {
        tickerBox.style.display = 'none';
        tickerMessage.innerText = "";
    }
}

const user = {
    name: userName,
    age: userAge,
    email: userEmail,
    country: userCountry
};

const displayNameEl = document.getElementById("displayName");
const displayAgeEl = document.getElementById("displayAge");
if (displayNameEl) displayNameEl.innerText = user.name;
if (displayAgeEl) displayAgeEl.innerText = user.age;

// ---------- Firebase ----------
const firebaseConfig = {
    apiKey: "AIzaSyAihDkvyBa8XaDJRNvuPHo2n-_sY3KsR-k",
    authDomain: "testy-87676.firebaseapp.com",
    databaseURL: "https://testy-87676-default-rtdb.firebaseio.com",
    projectId: "testy-87676",
    storageBucket: "testy-87676.firebasestorage.app",
    messagingSenderId: "281875165600",
    appId: "1:281875165600:web:41263c687d86e8d7e074c5"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const onlineRef = db.ref("online-users");

const peer = new Peer({
    secure: true,
    pingInterval: 3000,
    debug: 2,
    config: {
        'iceServers': [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            {
                urls: "turn:free.expressturn.com:3478",
                username: "000000002089553375",
                credential: "JbH5oi23aNVXflro2WjTM"
            },
            {
                urls: "turn:free.expressturn.com:443?transport=tcp",
                username: "000000002089553375",
                credential: "JbH5oi23aNVXflro2WjTM"
            }
        ]
    }
});

const remoteVideo = document.getElementById("remote");
const localVideo = document.getElementById("local");
const myIdSpan = document.getElementById("myId");
const onlineListDiv = document.getElementById("onlineList");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const muteBtn = document.getElementById("muteBtn");
const flipBtn = document.getElementById("flip");
const resolutionSelect = document.getElementById("resolution");
const endCallBtn = document.getElementById("endCallBtn");
const logoutBtn = document.getElementById("logout");
const logoutDialog = document.getElementById("logoutDialog");
const confirmLogoutBtn = document.getElementById("confirmLogout");
const cancelLogoutBtn = document.getElementById("cancelLogout");
const suspendedDialog = document.getElementById("suspendedDialog");
const suspendedOkBtn = document.getElementById("suspendedOkBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const emojis = document.querySelectorAll(".emoji");
const reportBtn = document.getElementById("reportBtn");
const reportConfirmDialog = document.getElementById("reportConfirmDialog");
const confirmReportBtn = document.getElementById("confirmReportBtn");
const cancelReportBtn = document.getElementById("cancelReportBtn");
let pendingReportUser = null;

// ---------- نظام تبديل الوضع ----------
const themeCheckbox = document.getElementById('themeCheckbox');
let currentTheme = localStorage.getItem('theme') || 'dark';
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (themeCheckbox) themeCheckbox.checked = false;
    } else {
        document.body.classList.remove('light-mode');
        if (themeCheckbox) themeCheckbox.checked = true;
    }
    localStorage.setItem('theme', theme);
}
if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'dark' : 'light';
        setTheme(newTheme);
    });
}
setTheme(currentTheme);

// ---------- متغيرات عامة ----------
let localStream = null;
let currentCall = null;
let currentConnection = null;
let currentCallPeerId = null;
let useFrontCamera = true;
let isMuted = false;
let myPeerId = null;
let heartbeatInterval = null;
let onlineUsersData = {};

let currentResolution = {
    width: { ideal: 854 },
    height: { ideal: 480 }
};

if (endCallBtn) endCallBtn.classList.add("hidden");

let isCameraInitializing = false;

function updateLocalVideoMirror() {
    if (localVideo) {
        if (useFrontCamera) {
            localVideo.classList.add('mirror');
        } else {
            localVideo.classList.remove('mirror');
        }
    }
}

function updateReportButtonVisibility() {
    if (reportBtn) {
        reportBtn.style.display = (currentCallPeerId && localStream) ? 'inline-flex' : 'none';
    }
}

// ---------- دوال التحديث في Google Sheets عند الاتصال بالمطور ----------
const DEVELOPER_EMAIL = 'ibrahimtarteel1@gmail.com'; // بريد المطور

async function updateSheetCallStatus(targetEmail, status) {
    // status: 'start' أو 'end'
    try {
        const formData = new FormData();
        formData.append('action', 'update_call_status');
        formData.append('developerEmail', targetEmail);
        formData.append('status', status);
        // إضافة البريد الإلكتروني للمستخدم الحالي لاستخدامه في الرسالة (اختياري)
        formData.append('currentUserEmail', userEmail);
        formData.append('currentUserName', userName);
        await fetch(scriptURL, { method: 'POST', body: formData });
        // لا ننتظر الرد لتسريع العملية
    } catch (err) {
        console.error("خطأ في تحديث حالة المكالمة في الورقة:", err);
    }
}

// دالة للتحقق إذا كان الطرف الآخر هو المطور
function isDeveloper(peerId) {
    const otherUser = onlineUsersData[peerId];
    return otherUser && otherUser.email === DEVELOPER_EMAIL;
}

function getResolutionConstraints(resValue) {
    switch (resValue) {
        case "144": return { width: { ideal: 256 }, height: { ideal: 144 } };
        case "240": return { width: { ideal: 426 }, height: { ideal: 240 } };
        case "360": return { width: { ideal: 640 }, height: { ideal: 360 } };
        case "480": return { width: { ideal: 854 }, height: { ideal: 480 } };
        case "720": return { width: { ideal: 1280 }, height: { ideal: 720 } };
        case "1080": return { width: { ideal: 1920 }, height: { ideal: 1080 } };
        default: return { width: { ideal: 854 }, height: { ideal: 480 } };
    }
}

async function initCamera() {
    if (isCameraInitializing) return;
    isCameraInitializing = true;
    try {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
            if (localVideo) localVideo.srcObject = null;
        }
        await new Promise(resolve => setTimeout(resolve, 200));

        const constraints = {
            video: {
                facingMode: useFrontCamera ? "user" : "environment",
                width: currentResolution.width,
                height: currentResolution.height
            },
            audio: true
        };
        localStream = await navigator.mediaDevices.getUserMedia(constraints);

        if (localVideo) {
            localVideo.srcObject = localStream;
            localVideo.muted = true;
            updateLocalVideoMirror();
            localVideo.play().catch(e => console.warn("خطأ في تشغيل الفيديو المحلي:", e));
        }

        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = !isMuted;

        updateReportButtonVisibility();
        return localStream;
    } catch (err) {
        console.error("❌ خطأ في الكاميرا:", err);
        alert("خطأ في تشغيل الكاميرا: " + (err.message || err.name) + "\nتأكد من منح الإذن.");
        throw err;
    } finally {
        isCameraInitializing = false;
    }
}

async function updateVideoTrackInCall() {
    if (currentCall && currentCall.peerConnection && localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (!videoTrack) return;
        const senders = currentCall.peerConnection.getSenders();
        const videoSender = senders.find(s => s.track && s.track.kind === "video");
        if (videoSender) {
            try { await videoSender.replaceTrack(videoTrack); } catch (err) { console.error("فشل تحديث الفيديو:", err); }
        }
    }
}

async function updateAudioTrackInCall() {
    if (currentCall && currentCall.peerConnection && localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (!audioTrack) return;
        const senders = currentCall.peerConnection.getSenders();
        const audioSender = senders.find(s => s.track && s.track.kind === "audio");
        if (audioSender) {
            try { await audioSender.replaceTrack(audioTrack); } catch (err) { console.error("فشل تحديث الصوت:", err); }
        }
    }
}

if (resolutionSelect) {
    resolutionSelect.addEventListener("change", async function(e) {
        currentResolution = getResolutionConstraints(e.target.value);
        try {
            await initCamera();
            await updateVideoTrackInCall();
            await updateAudioTrackInCall();
        } catch (err) { console.error("فشل تغيير الدقة:", err); }
    });
}

if (flipBtn) {
    flipBtn.addEventListener("click", async function() {
        useFrontCamera = !useFrontCamera;
        try {
            await initCamera();
            await updateVideoTrackInCall();
            await updateAudioTrackInCall();
        } catch (err) { console.error("فشل قلب الكاميرا:", err); }
    });
}

if (muteBtn) {
    muteBtn.addEventListener("click", function() {
        if (!localStream) return;
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            isMuted = !isMuted;
            audioTrack.enabled = !isMuted;
            muteBtn.innerText = isMuted ? "🔇" : "🔊";
            muteBtn.classList.toggle("muted", isMuted);
            if (currentCall && currentCall.peerConnection) {
                const senders = currentCall.peerConnection.getSenders();
                const audioSender = senders.find(s => s.track && s.track.kind === "audio");
                if (audioSender) audioSender.replaceTrack(audioTrack).catch(e => console.error(e));
            }
        }
    });
}

// ---------- أحداث PeerJS ----------
peer.on("open", function(id) {
    myPeerId = id;
    if (myIdSpan) myIdSpan.innerText = id;
    console.log("✅ معرفك:", id);

    const userStatusRef = onlineRef.child(myPeerId);
    const dataToSend = {
        name: user.name,
        age: user.age,
        country: user.country,
        email: user.email,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    };
    userStatusRef.set(dataToSend);
    userStatusRef.onDisconnect().remove();

    heartbeatInterval = setInterval(function() {
        userStatusRef.update({ lastSeen: firebase.database.ServerValue.TIMESTAMP });
    }, 10000);
});

peer.on("disconnected", function() {
    if (myPeerId) onlineRef.child(myPeerId).remove();
    peer.reconnect();
});

peer.on("error", function(err) {
    if (err.type === 'peer-unavailable') {
        alert("الطرف الآخر غير متاح حالياً.");
        updateOnlineList();
    } else if (err.type === 'network' || err.type === 'server-error' || err.type === 'unavailable-id') {
        if (myPeerId) onlineRef.child(myPeerId).remove();
        peer.reconnect();
    }
});

peer.on("call", function(call) {
    if (!localStream) {
        alert("الكاميرا لم تبدأ بعد");
        return;
    }
    if (currentCall) {
        currentCall.close();
        if (currentConnection) currentConnection.close();
    }
    call.answer(localStream);
    call.on("stream", function(remoteStream) {
        if (remoteVideo) remoteVideo.srcObject = remoteStream;
        // عند استقبال بث الفيديو (المكالمة نجحت) - نتحقق من المطور
        if (isDeveloper(call.peer)) {
            updateSheetCallStatus(DEVELOPER_EMAIL, 'start');
        }
    });
    call.on("close", function() {
        if (remoteVideo) remoteVideo.srcObject = null;
        if (endCallBtn) endCallBtn.classList.add("hidden");
        // عند انتهاء المكالمة - نرسل تحديث الإنهاء إذا كان الطرف الآخر مطوراً
        if (isDeveloper(call.peer)) {
            updateSheetCallStatus(DEVELOPER_EMAIL, 'end');
        }
        currentCall = null;
        currentCallPeerId = null;
        updateReportButtonVisibility();
    });
    currentCall = call;
    currentCallPeerId = call.peer;
    if (endCallBtn) endCallBtn.classList.remove("hidden");
    updateReportButtonVisibility();

    const conn = peer.connect(call.peer);
    conn.on("open", function() { currentConnection = conn; });
    conn.on("data", function(data) { displayMessage(data, "other"); });
});

peer.on("connection", function(conn) {
    conn.on("data", function(data) { displayMessage(data, "other"); });
    currentConnection = conn;
});

// ==========================================
// إدارة اللغة وترجمة الدول
// ==========================================
let currentLang = localStorage.getItem('language') || 'ar';

const countryTranslations = { ... }; // (كما هي - لم تتغير)

function getTranslatedCountry(rawCountry) { ... } // (كما هي)

function populateCountryFilter() { ... } // (كما هي)

// ---------- استماع لتغييرات المتصلين ----------
onlineRef.on("value", function(snapshot) {
    if (!onlineListDiv) return;
    const users = snapshot.val();

    onlineUsersData = users || {};

    onlineListDiv.innerHTML = "";

    let sameCountryCount = 0;
    let totalOnline = 0;
    const now = Date.now();
    const selectedCountry = document.getElementById('countryFilter')?.value || 'all';
    const currentUserCountry = userCountry ? userCountry.toLowerCase() : '';

    if (!users) {
        onlineListDiv.innerHTML = "<span class='online-list-placeholder'>" + (currentLang === 'ar' ? 'لا يوجد متصلون الآن' : 'No online users right now') + "</span>";
    } else {
        let count = 0;
        for (const key in users) {
            if (key === myPeerId) continue;
            const u = users[key];
            const isOnline = u.lastSeen && (now - u.lastSeen < 30000);
            if (!isOnline) continue;

            totalOnline++;
            const otherCountry = u.country ? u.country.trim().toLowerCase() : '';

            if (currentUserCountry && currentUserCountry !== 'غير محدد' && otherCountry === currentUserCountry) {
                sameCountryCount++;
            }

            if (selectedCountry !== 'all' && otherCountry !== selectedCountry) continue;
            count++;

            const btn = document.createElement("button");
            btn.className = "user-btn";
            if (key === currentCallPeerId) btn.classList.add("active");

            const translatedOtherCountry = getTranslatedCountry(u.country || '');
            const countryDisplay = translatedOtherCountry ? ` - ${translatedOtherCountry}` : "";

            btn.textContent = u.name + " (" + (u.age || "?") + ")" + countryDisplay;
            btn.onclick = (function(pid) {
                return function() { toggleCall(pid); };
            })(key);
            onlineListDiv.appendChild(btn);
        }
        if (count === 0) {
            onlineListDiv.innerHTML = "<span class='online-list-placeholder'>" + (currentLang === 'ar' ? 'لا يوجد متصلون آخرون حالياً' : 'No other online users currently') + "</span>";
        }
    }

    const onlineCountSpan = document.getElementById('onlineCount');
    if (onlineCountSpan) {
        if (currentUserCountry && currentUserCountry !== 'غير محدد') {
            onlineCountSpan.innerText = `(${sameCountryCount})`;
        } else {
            onlineCountSpan.innerText = `(${totalOnline})`;
        }
    }
});

const filterSelect = document.getElementById('countryFilter');
if (filterSelect) {
    filterSelect.addEventListener('change', () => {
        onlineRef.once('value');
    });
}

function toggleCall(peerId) {
    if (!localStream) {
        alert("الكاميرا لم تبدأ بعد");
        return;
    }
    if (currentCall && currentCallPeerId === peerId) {
        currentCall.close();
        if (currentConnection) currentConnection.close();
        currentCall = null;
        currentConnection = null;
        currentCallPeerId = null;
        if (remoteVideo) remoteVideo.srcObject = null;
        if (endCallBtn) endCallBtn.classList.add("hidden");
        updateReportButtonVisibility();
        updateOnlineList();
        // إذا كان الطرف الآخر مطوراً وكانت المكالمة تنتهي - نرسل تحديث الإنهاء
        if (isDeveloper(peerId)) {
            updateSheetCallStatus(DEVELOPER_EMAIL, 'end');
        }
    } else {
        if (currentCall) {
            currentCall.close();
            if (currentConnection) currentConnection.close();
        }
        currentCall = peer.call(peerId, localStream);
        currentCallPeerId = peerId;
        updateReportButtonVisibility();
        currentCall.on("stream", function(remoteStream) {
            if (remoteVideo) remoteVideo.srcObject = remoteStream;
            // عند بدء البث (المكالمة نجحت) - نتحقق من المطور
            if (isDeveloper(peerId)) {
                updateSheetCallStatus(DEVELOPER_EMAIL, 'start');
            }
        });
        currentCall.on("close", function() {
            if (remoteVideo) remoteVideo.srcObject = null;
            currentCall = null;
            currentConnection = null;
            currentCallPeerId = null;
            if (endCallBtn) endCallBtn.classList.add("hidden");
            updateReportButtonVisibility();
            if (isDeveloper(peerId)) {
                updateSheetCallStatus(DEVELOPER_EMAIL, 'end');
            }
        });
        currentCall.on("error", function(err) {
            if (err.type === 'peer-unavailable') {
                alert('الطرف الآخر غير متاح حالياً.');
                updateOnlineList();
            }
            currentCall = null;
            currentCallPeerId = null;
            updateReportButtonVisibility();
        });
        currentConnection = peer.connect(peerId);
        currentConnection.on("data", function(data) { displayMessage(data, "other"); });
        if (endCallBtn) endCallBtn.classList.remove("hidden");
    }
}

function updateOnlineList() {
    onlineRef.once("value");
}

function displayMessage(text, sender) {
    if (!messagesDiv) return;
    const msg = document.createElement("div");
    msg.className = "message" + (sender === "me" ? " me" : "");
    msg.innerText = (sender === "me" ? (currentLang === 'ar' ? "أنا: " : "Me: ") : (currentLang === 'ar' ? "صديق: " : "Friend: ")) + text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

if (sendBtn) {
    sendBtn.addEventListener("click", function() {
        const text = chatInput?.value.trim();
        if (!text) return;
        displayMessage(text, "me");
        if (currentConnection && currentConnection.open) {
            currentConnection.send(text);
        } else {
            alert(currentLang === 'ar' ? "لا يوجد اتصال دردشة نشط" : "No active chat connection");
        }
        if (chatInput) chatInput.value = "";
    });
}
if (chatInput) {
    chatInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") sendBtn?.click();
    });
}
if (endCallBtn) {
    endCallBtn.addEventListener("click", function() {
        if (currentCall) {
            currentCall.close();
            if (currentConnection) currentConnection.close();
            currentCall = null;
            currentConnection = null;
            currentCallPeerId = null;
            if (remoteVideo) remoteVideo.srcObject = null;
            endCallBtn.classList.add("hidden");
            updateReportButtonVisibility();
            if (isDeveloper(currentCallPeerId)) {
                updateSheetCallStatus(DEVELOPER_EMAIL, 'end');
            }
        }
    });
}
if (emojiBtn) {
    emojiBtn.addEventListener("click", function() {
        if (emojiPicker) emojiPicker.classList.toggle("hidden");
    });
}
emojis.forEach(function(emo) {
    emo.addEventListener("click", function() {
        if (chatInput) chatInput.value += emo.innerText;
        if (emojiPicker) emojiPicker.classList.add("hidden");
        chatInput?.focus();
    });
});
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        if (logoutDialog) logoutDialog.classList.remove("hidden");
    });
}
if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", function() {
        if (myPeerId) onlineRef.child(myPeerId).remove();
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        if (localStream) localStream.getTracks().forEach(t => t.stop());
        if (peer) peer.destroy();
        logout();
    });
}
if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", function() {
        if (logoutDialog) logoutDialog.classList.add("hidden");
    });
}
if (logoutDialog) {
    logoutDialog.addEventListener("click", function(e) {
        if (e.target === logoutDialog) logoutDialog.classList.add("hidden");
    });
}
if (suspendedDialog) {
    suspendedDialog.addEventListener("click", function(e) {
        if (e.target === suspendedDialog) suspendedDialog.classList.add("hidden");
    });
}
if (suspendedOkBtn) {
    suspendedOkBtn.addEventListener("click", function() {
        suspendedDialog?.classList.add("hidden");
        logout();
    });
}

if (localVideo) {
    localVideo.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const videoSection = document.querySelector('.video-section');
        if (videoSection) {
            videoSection.classList.toggle('enlarged');
            updateLocalVideoMirror();
        }
    });
    localVideo.style.touchAction = 'manipulation';
}

// ==========================================
// إضافة لوحة تحكم المطور
// ==========================================
const isDeveloperUser = localStorage.getItem('isDeveloper') === 'true';
const devDashboardBtn = document.getElementById('devDashboardBtn');
const devModal = document.getElementById('devDashboardModal');
const sheetDataContainer = document.getElementById('sheetDataContainer');

if (isDeveloperUser && devDashboardBtn) {
    devDashboardBtn.classList.remove('hidden');
    devDashboardBtn.addEventListener('click', () => {
        if (devModal) devModal.classList.remove('hidden');
        loadSheetData();
    });
}

const closeDevModal = document.getElementById('closeDevModal');
if (closeDevModal) {
    closeDevModal.addEventListener('click', () => {
        if (devModal) devModal.classList.add('hidden');
    });
}

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function loadSheetData() {
    if (!sheetDataContainer) return;
    sheetDataContainer.innerHTML = '<div style="text-align:center; padding: 20px;">' + (currentLang === 'ar' ? '⏳ جاري التحميل...' : '⏳ Loading...') + '</div>';
    try {
        const formData = new FormData();
        formData.append('action', 'get_sheet_data');
        formData.append('developerEmail', userEmail);
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const data = await response.json();
        if (data.error) {
            sheetDataContainer.innerHTML = `<p style="color:#ef4444; text-align:center; font-weight:bold;">❌ خطأ: ${escapeHtml(data.error)}</p>`;
        } else {
            renderSheetTable(data);
        }
    } catch (err) {
        sheetDataContainer.innerHTML = `<p style="color:#ef4444; text-align:center; font-weight:bold;">❌ فشل التحميل: ${escapeHtml(err.message)}</p>`;
    }
}

function renderSheetTable(rows) {
    if (!rows || rows.length === 0) {
        sheetDataContainer.innerHTML = '<p style="text-align:center;">' + (currentLang === 'ar' ? 'لا توجد بيانات.' : 'No data.') + '</p>';
        return;
    }

    // توحيد عدد الأعمدة
    let maxCols = 0;
    for (let r = 0; r < rows.length; r++) {
        if (rows[r] && rows[r].length > maxCols) maxCols = rows[r].length;
    }
    for (let r = 0; r < rows.length; r++) {
        if (rows[r].length < maxCols) {
            rows[r] = rows[r].concat(Array(maxCols - rows[r].length).fill(''));
        }
    }

    // ألوان تتناسب مع الوضعين (فاتح/داكن)
    const isLightMode = document.body.classList.contains('light-mode');
    const headerBg = isLightMode ? '#f1f3f4' : '#2a2b2e';
    const rowNumBg = isLightMode ? '#f8f9fa' : '#1e1f22';
    const borderColor = isLightMode ? '#cccccc' : '#444444';
    const inputColor = isLightMode ? '#000000' : '#ffffff';

    // هيكل الجدول الاحترافي
    let html = `<div style="overflow: auto; max-height: 65vh; border: 1px solid ${borderColor}; border-radius: 4px; background: transparent;">`;
    html += `<table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 13px; text-align: center; white-space: nowrap;">`;

    // الرأس (عناوين الأعمدة) - مجمد (Sticky)
    html += '<thead>械';
    
    // الخلية الأولى فارغة ومجمدة (لتقاطع أرقام الصفوف وعناوين الأعمدة)
    html += `<th style="background: ${headerBg}; border: 1px solid ${borderColor}; position: sticky; top: 0; left: 0; z-index: 3; width: 40px; padding: 8px;">#</th>`;
    
    for (let i = 0; i < maxCols; i++) {
        const colTitle = rows[0][i] !== null && rows[0][i] !== undefined ? String(rows[0][i]) : `عمود ${i+1}`;
        html += `<th style="background: ${headerBg}; border: 1px solid ${borderColor}; padding: 10px; position: sticky; top: 0; z-index: 2; min-width: 120px; font-weight: bold; color: ${inputColor};">${escapeHtml(colTitle)}</th>`;
    }
    
    // عمود الإجراءات - مجمد
    html += `<th style="background: ${headerBg}; border: 1px solid ${borderColor}; padding: 10px; position: sticky; top: 0; z-index: 2; font-weight: bold; color: ${inputColor};">${currentLang === 'ar' ? 'الإجراءات' : 'Actions'}</th>`;
    html += '</thead>';

    // الجسم (الصفوف)
    html += '<tbody>';
    for (let r = 1; r < rows.length; r++) {
        html += '械';
        
        // رقم الصف على الجانب (مجمد)
        html += `<td style="background: ${rowNumBg}; border: 1px solid ${borderColor}; font-weight: bold; color: #888; position: sticky; left: 0; z-index: 1;">${r}`, true);
        
        for (let c = 0; c < maxCols; c++) {
            const cellValue = rows[r][c] !== null && rows[r][c] !== undefined ? String(rows[r][c]) : '';
            html += `<td style="border: 1px solid ${borderColor}; padding: 0;">
                        <input type="text" data-row="${r}" data-col="${c}" value="${escapeHtml(cellValue)}" 
                        style="width: 100%; height: 100%; min-height: 35px; background: transparent; color: ${inputColor}; border: none; outline: none; padding: 0 8px; box-sizing: border-box; text-align: center; font-family: inherit;">
                      `;
        }
        
        // زر الحفظ
        html += `<td style="border: 1px solid ${borderColor}; padding: 5px;">
                    <button class="save-row-btn" data-row="${r}" style="background: #10b981; border: none; border-radius: 4px; padding: 6px 12px; color: white; cursor: pointer; font-size: 12px; font-weight: bold; transition: opacity 0.2s;">
                        💾 ${currentLang === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  `;
        html += '械';
    }
    html += '</tbody> </div>';
    
    // زر الإضافة في الأسفل
    html += '<div style="margin-top: 15px; text-align: center;">';
    html += `<button id="addRowBtn" style="background: #3b82f6; border: none; border-radius: 5px; padding: 10px 20px; color: white; cursor: pointer; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                ➕ ${currentLang === 'ar' ? 'إضافة صف جديد' : 'Add New Row'}
             </button>`;
    html += '</div>';

    sheetDataContainer.innerHTML = html;

    // ربط أحداث الأزرار
    document.querySelectorAll('.save-row-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const row = parseInt(btn.dataset.row);
            const inputs = document.querySelectorAll(`input[data-row="${row}"]`);
            const updatedRow = Array.from(inputs).map(inp => inp.value);
            btn.style.opacity = '0.5';
            await saveRow(row, updatedRow);
            btn.style.opacity = '1';
        });
    });

    const addRowBtn = document.getElementById('addRowBtn');
    if (addRowBtn) addRowBtn.addEventListener('click', () => addNewRow());
}

async function saveRow(rowIndex, rowData) {
    try {
        const formData = new FormData();
        formData.append('action', 'update_row');
        formData.append('developerEmail', userEmail);
        formData.append('row', rowIndex);
        formData.append('data', JSON.stringify(rowData));
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const result = await response.text();
        if (result !== 'OK') {
            alert('فشل الحفظ: ' + result);
        } else {
            alert(currentLang === 'ar' ? '✅ تم حفظ التغييرات بنجاح' : '✅ Changes saved successfully');
        }
    } catch (err) {
        alert('خطأ في الاتصال: ' + err.message);
    }
}

async function addNewRow() {
    const newRow = prompt(currentLang === 'ar' ? 'أدخل بيانات الصف الجديد مفصولة بفاصلة (مثل: الاسم, العمر, البريد, ...)' : 'Enter new row data separated by commas (e.g., name, age, email, ...)');
    if (!newRow) return;
    const rowData = newRow.split(',').map(s => s.trim());
    try {
        const formData = new FormData();
        formData.append('action', 'add_row');
        formData.append('developerEmail', userEmail);
        formData.append('data', JSON.stringify(rowData));
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const result = await response.text();
        if (result === 'OK') {
            loadSheetData();
        } else {
            alert('فشل الإضافة: ' + result);
        }
    } catch (err) {
        alert('خطأ: ' + err.message);
    }
}

// ========== إدارة القاموس المترجم لصفحة البروفايل ==========
const profileTranslations = {
    ar: {
        logout: "تسجيل خروج",
        onlineTitle: "المتصلون الآن",
        filterLabel: "تصفية حسب البلد:",
        allCountries: "جميع البلدان",
        chatPlaceholder: "رسالة...",
        send: "إرسال",
        logoutConfirm: "هل أنت متأكد من تسجيل الخروج؟",
        confirmYes: "نعم",
        confirmNo: "لا",
        suspendedMsg: "تم تعليق حسابك. يرجى التواصل مع الدعم.",
        ok: "حسناً",
        close: "إغلاق",
        devTitle: "📋 لوحة تحكم المطور",
        dashboardBtnText: "📊 لوحة التحكم",
        reportBtnText: "🚨",
        reportConfirmMsg: "هل أنت متأكد من الإبلاغ عن {name}؟ سيتم مراجعة الأمر من قبل الإدارة.",
        resolution: {
            144: "144p",
            240: "240p",
            360: "360p",
            480: "480p",
            720: "720p",
            1080: "1080p"
        }
    },
    en: {
        logout: "Logout",
        onlineTitle: "Online now",
        filterLabel: "Filter by country:",
        allCountries: "All countries",
        chatPlaceholder: "Message...",
        send: "Send",
        logoutConfirm: "Are you sure you want to logout?",
        confirmYes: "Yes",
        confirmNo: "No",
        suspendedMsg: "Your account is suspended. Please contact support.",
        ok: "OK",
        close: "Close",
        devTitle: "📋 Developer Dashboard",
        dashboardBtnText: "📊 Dashboard",
        reportBtnText: "🚨",
        reportConfirmMsg: "Are you sure you want to report {name}? The admin will review this.",
        resolution: {
            144: "144p",
            240: "240p",
            360: "360p",
            480: "480p",
            720: "720p",
            1080: "1080p"
        }
    }
};

function safeSetProfileText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
function safeSetProfilePlaceholder(id, text) {
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
}

function applyProfileLanguage() {
    const t = profileTranslations[currentLang];
    safeSetProfileText('logout', t.logout);
    safeSetProfileText('onlineTitle', t.onlineTitle);

    const devBtn = document.getElementById('devDashboardBtn');
    if (devBtn) devBtn.innerText = t.dashboardBtnText;
    if (reportBtn) reportBtn.innerText = t.reportBtnText;

    const filterLabel = document.querySelector('.filter-bar label');
    if (filterLabel) filterLabel.innerText = t.filterLabel;
    const chatInputElem = document.getElementById('chatInput');
    if (chatInputElem) chatInputElem.placeholder = t.chatPlaceholder;
    safeSetProfileText('sendBtn', t.send);
    safeSetProfileText('logoutConfirmMsg', t.logoutConfirm);
    safeSetProfileText('confirmLogout', t.confirmYes);
    safeSetProfileText('cancelLogout', t.confirmNo);
    safeSetProfileText('suspendedMsg', t.suspendedMsg);
    safeSetProfileText('suspendedOkBtn', t.ok);
    safeSetProfileText('closeDevModal', t.close);
    safeSetProfileText('devDashboardTitle', t.devTitle);

    const resolutionSelectElem = document.getElementById('resolution');
    if (resolutionSelectElem) {
        const options = resolutionSelectElem.options;
        for (let i = 0; i < options.length; i++) {
            const val = options[i].value;
            if (t.resolution[val]) {
                options[i].innerText = t.resolution[val];
            }
        }
    }

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
}

const langToggleCheckbox = document.getElementById('langCheckbox');
if (langToggleCheckbox) {
    langToggleCheckbox.addEventListener('change', () => {
        currentLang = langToggleCheckbox.checked ? 'en' : 'ar';
        localStorage.setItem('language', currentLang);
        applyProfileLanguage();
        if (devModal && !devModal.classList.contains('hidden')) {
            loadSheetData();
        }
        populateCountryFilter();
        updateOnlineList();
    });
}
applyProfileLanguage();

// ==========================================
// ✨ زر التبليغ (Report Button) – مع نافذة تأكيد
// ==========================================
if (reportBtn) {
    reportBtn.addEventListener("click", function() {
        if (!currentCallPeerId) {
            alert(currentLang === 'ar' ? "أنت لست في مكالمة حالياً للإبلاغ عن شخص." : "You are not in a call to report anyone.");
            return;
        }

        const reportedUser = onlineUsersData[currentCallPeerId];
        if (!reportedUser || !reportedUser.email) {
            alert(currentLang === 'ar' ? "تعذر العثور على بيانات المستخدم للتبليغ." : "Could not find user data to report.");
            return;
        }

        pendingReportUser = reportedUser;
        const confirmMsg = (currentLang === 'ar' 
            ? `هل أنت متأكد من الإبلاغ عن ${reportedUser.name}؟ سيتم مراجعة الأمر من قبل الإدارة.` 
            : `Are you sure you want to report ${reportedUser.name}? The admin will review this.`);
        const reportConfirmMsg = document.getElementById('reportConfirmMsg');
        if (reportConfirmMsg) reportConfirmMsg.innerText = confirmMsg;
        if (reportConfirmDialog) reportConfirmDialog.classList.remove('hidden');
    });
}

if (confirmReportBtn) {
    confirmReportBtn.addEventListener("click", function() {
        if (!pendingReportUser) return;
        const reportedUser = pendingReportUser;
        pendingReportUser = null;
        if (reportConfirmDialog) reportConfirmDialog.classList.add('hidden');

        const formData = new FormData();
        formData.append('action', 'report');
        formData.append('reportedEmail', reportedUser.email);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.text())
            .then(result => {
                if (result === 'Reported') {
                    alert(currentLang === 'ar' ? "تم الإبلاغ بنجاح. ستقوم الإدارة بالمراجعة." : "Reported successfully. Admin will review.");
                    if (currentCall) {
                        currentCall.close();
                        if (currentConnection) currentConnection.close();
                        currentCall = null;
                        currentConnection = null;
                        currentCallPeerId = null;
                        if (remoteVideo) remoteVideo.srcObject = null;
                        if (endCallBtn) endCallBtn.classList.add("hidden");
                        updateReportButtonVisibility();
                    }
                } else if (result === 'NotFound') {
                    alert(currentLang === 'ar' ? "المستخدم غير موجود في قاعدة البيانات." : "User not found in database.");
                } else {
                    alert(currentLang === 'ar' ? "حدث خطأ أثناء التبليغ: " + result : "Error reporting: " + result);
                }
            })
            .catch(error => {
                console.error("Error reporting:", error);
                alert(currentLang === 'ar' ? "حدث خطأ في الاتصال بالسيرفر." : "Connection error to the server.");
            });
    });
}

if (cancelReportBtn) {
    cancelReportBtn.addEventListener("click", function() {
        pendingReportUser = null;
        if (reportConfirmDialog) reportConfirmDialog.classList.add('hidden');
    });
}

// ========== بدء تشغيل الكاميرا ==========
initCamera().then(() => {
    updateLocalVideoMirror();
}).catch(err => {
    console.error("❌ فشل تشغيل الكاميرا:", err);
});

// ========== تعبئة قائمة البلدان بعد تحميل الصفحة ==========
setTimeout(() => {
    populateCountryFilter();
}, 1000);