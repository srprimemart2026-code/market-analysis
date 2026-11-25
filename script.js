document.addEventListener('DOMContentLoaded', () => {
    // Set Current Date
    const dateBadge = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    dateBadge.textContent = new Date().toLocaleDateString('en-US', options);

    // Tab Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabSections = document.querySelectorAll('.tab-section');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const tabInfo = {
        'script-bot': {
            title: 'Viral Post & Reels Script Generator',
            sub: 'ফেসবুক অ্যালগরিদম অনুযায়ী হাই-কনভার্টিং ক্যাপশন ও ভিডিও স্ক্রিপ্ট তৈরি করুন'
        },
        'data-analyzer': {
            title: 'Facebook Page Data & Growth Analyzer',
            sub: 'পেজের রিচ, এনগেজমেন্ট ও সেলস ডাটা বিশ্লেষণ করে র‍্যাঙ্কিং বাড়ানোর সমাধান পান'
        },
        'growth-strategy': {
            title: 'Top-10 Page Ranking Roadmap',
            sub: 'প্রতিদিনের অ্যাকশন চেকলিস্ট ও ফেসবুক অ্যালগরিদম গ্রোথ গাইড'
        },
        'api-settings': {
            title: 'Gemini AI Engine Configuration',
            sub: 'লাইভ AI কানেকশনের জন্য আপনার API Key সেটআপ করুন'
        }
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabSections.forEach(sec => sec.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');

            pageTitle.textContent = tabInfo[target].title;
            pageSubtitle.textContent = tabInfo[target].sub;
        });
    });

    // Save & Load API Key
    const apiKeyInput = document.getElementById('gemini-api-key');
    const saveApiBtn = document.getElementById('save-api-btn');
    const apiStatusMsg = document.getElementById('api-status-msg');

    const savedKey = localStorage.getItem('sr_gemini_key');
    if (savedKey) apiKeyInput.value = savedKey;

    saveApiBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        localStorage.setItem('sr_gemini_key', key);
        apiStatusMsg.textContent = key ? '✅ API Key সফলভাবে সেভ হয়েছে!' : '⚠️ API Key রিমুভ করা হয়েছে (ডিফল্ট ইঞ্জিন চালু)।';
    });

    // 1. Script & Post Generator Bot
    const generateBtn = document.getElementById('generate-script-btn');
    const scriptOutput = document.getElementById('script-output');

    generateBtn.addEventListener('click', async () => {
        const type = document.getElementById('content-type').value;
        const product = document.getElementById('product-name').value.trim() || 'আমাদের এক্সক্লুসিভ প্রোডাক্ট';
        const offer = document.getElementById('product-offer').value.trim() || 'সেরা দামে ক্যাশ অন ডেলিভারি সুবিধা';
        const tone = document.getElementById('content-tone').value;
        const apiKey = localStorage.getItem('sr_gemini_key');

        generateBtn.textContent = '⏳ বট স্ক্রিপ্ট তৈরি করছে...';
        generateBtn.disabled = true;

        if (apiKey) {
            try {
                const prompt = `Act as an expert Bangladeshi Facebook Marketing & E-commerce Growth Strategist for the Facebook page "S.R. PRIME MART". Write a high-converting ${type} in natural, persuasive Bengali for the product: "${product}". Offer details: "${offer}". Tone: ${tone}. Include relevant emojis, strong Call-To-Action (CTA), and trending Bangladeshi e-commerce hashtags.`;
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    scriptOutput.value = data.candidates[0].content.parts[0].text;
                    resetBtn();
                    return;
                }
            } catch (err) {
                console.error('API Error, falling back to local engine:', err);
            }
        }

        // Built-in Smart Marketing Engine (Works 100% Offline/Without API)
        setTimeout(() => {
            scriptOutput.value = generateSmartTemplate(type, product, offer, tone);
            resetBtn();
        }, 400);
    });

    function resetBtn() {
        generateBtn.textContent = '✨ Generate Script & Post';
        generateBtn.disabled = false;
    }

    function generateSmartTemplate(type, product, offer, tone) {
        const urgencyLine = tone === 'urgent' ? '⚠️ সতর্কতা: স্টক কিন্তু একদমই সীমিত! অফার শেষ হওয়ার আগেই লুফে নিন।' : '✨ প্রিমিয়াম কোয়ালিটির নিশ্চয়তা দিচ্ছে S.R. PRIME MART!';

        if (type === 'reels-script') {
            return `🎬 FACEBOOK REELS / VIDEO SCRIPT (30 Seconds)
📌 Product: ${product}
--------------------------------------------------
[0:00 - 0:03 | HOOK - দর্শক আটকানোর কৌশল]
(ক্যামেরার দিকে তাকিয়ে হাতে প্রোডাক্টটি দেখিয়ে বলুন):
"আপনি কি এখনো সাধারণ মানের ${product} ব্যবহার করে টাকা নষ্ট করছেন? মাত্র ৩০ সেকেন্ড দেখুন, আপনার সিদ্ধান্ত বদলে যাবে!"

[0:04 - 0:18 | BODY - প্রোডাক্টের গুণাগুণ]
(প্রোডাক্টের ক্লোজ-আপ শট দেখান):
"S.R. PRIME MART নিয়ে এসেছে ১০০% অরিজিনাল ও প্রিমিয়াম কোয়ালিটির ${product}। 
✅ এটি যেমন টেকসই, দেখতেও তেমন স্টাইলিশ।
✅ ডেলিভারি ম্যানের সামনে চেক করে নেওয়ার সুবিধা।"

[0:19 - 0:30 | OFFER & CTA]
"${offer}! ${urgencyLine}
অর্ডার করতে এখনই নিচের 'Send Message' বাটনে ক্লিক করুন অথবা কমেন্টে 'Order' লিখুন!"

#SRPrimeMart #BangladeshOnlineShop #ReelsBD #ViralProduct #BestDealBD`;
        }

        if (type === 'engagement-post') {
            return `🔥 কাস্টমার চয়েস পোল (Reach Booster Post) 🔥

আপনার কাছে কোনটি সবচেয়ে বেশি গুরুত্বপূর্ণ? 👇

১️⃣ কম দামে সাধারণ প্রোডাক্ট
২️⃣ একটু ভালো বাজেটে ১০০% অরিজিনাল ও টেকসই ${product}

কমেন্টে ১ অথবা ২ লিখে জানান! 
(যারা সঠিক উত্তর দেবেন তাদের জন্য ${product}-এ থাকছে স্পেশাল সারপ্রাইজ ডিসকাউন্ট! 🎁)

👉 আমাদের কালেকশন দেখতে ভিজিট করুন: facebook.com/SRPRIMEMART

#SRPrimeMart #CustomerChoice #OnlineShoppingBD #Poll`;
        }

        return `🔥 সেরা মানের ${product} এখন S.R. PRIME MART-এ! 🔥

${urgencyLine}

কেন আমাদের থেকে ${product} নেবেন?
✅ ১০০% প্রিমিয়াম ও অরিজিনাল কোয়ালিটি
✅ ছবির সাথে হুবহু মিল থাকার গ্যারান্টি
✅ সারাদেশে দ্রুত হোম ডেলিভারি সুবিধা
✅ প্রোডাক্ট হাতে পেয়ে চেক করে টাকা পরিশোধের সুযোগ (Cash on Delivery)

💥 স্পেশাল অফার: ${offer}

📩 অর্ডার করতে আপনার নাম, ঠিকানা ও মোবাইল নম্বর লিখে আমাদের পেজে ইনবক্স করুন অথবা কমেন্টে "Price" লিখুন!

🔗 পেজ ভিজিট করুন: https://www.facebook.com/SRPRIMEMART

#SRPrimeMart #OnlineShoppingBangladesh #BestPriceBD #CashOnDelivery #TrendingBD`;
    }

    // Copy Output
    document.getElementById('copy-output-btn').addEventListener('click', () => {
        if (!scriptOutput.value) return;
        navigator.clipboard.writeText(scriptOutput.value);
        const btn = document.getElementById('copy-output-btn');
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy Text', 2000);
    });

    // 2. Page Data Analyzer Bot
    document.getElementById('analyze-data-btn').addEventListener('click', () => {
        const reach = parseFloat(document.getElementById('metric-reach').value) || 0;
        const engagement = parseFloat(document.getElementById('metric-engagement').value) || 0;
        const clicks = parseFloat(document.getElementById('metric-clicks').value) || 0;
        const orders = parseFloat(document.getElementById('metric-orders').value) || 0;

        const resultBox = document.getElementById('analysis-result');

        if (reach === 0) {
            resultBox.innerHTML = '<div class="advice-item" style="border-color: #ef4444;">⚠️ অনুগ্রহ করে অন্তত Post Reach-এর সংখ্যা ইনপুট দিন।</div>';
            return;
        }

        const engRate = ((engagement / reach) * 100).toFixed(2);
        const ctr = ((clicks / reach) * 100).toFixed(2);
        const convRate = clicks > 0 ? ((orders / clicks) * 100).toFixed(2) : 0;

        let recommendations = [];

        if (engRate < 5) {
            recommendations.push(`📉 <strong>Engagement Rate কম (${engRate}%):</strong> আপনার পোস্ট মানুষের সামনে যাচ্ছে ঠিকই, কিন্তু মানুষ লাইক/কমেন্ট করছে না। পোস্টে প্রশ্ন জুড়ে দিন এবং প্রতিদিন ১টি করে Reels আপলোড করুন।`);
        } else {
            recommendations.push(`🔥 <strong>দারুণ Engagement Rate (${engRate}%):</strong> আপনার কনটেন্ট অডিয়েন্স পছন্দ করছে। এখন পোস্ট বুস্ট করলে খুব কম খরচে ভালো রেজাল্ট পাবেন।`);
        }

        if (ctr < 2) {
            recommendations.push(`🎯 <strong>Inbox/Click কম (${ctr}%):</strong> কাস্টমাররা পোস্ট দেখছে কিন্তু ইনবক্স করছে না। পোস্টের শেষে স্পষ্ট Call-to-Action দিন (যেমন: "অর্ডার করতে ইনবক্সে 'YES' লিখুন")।`);
        } else {
            recommendations.push(`✅ <strong>ভালো Click-Through Rate (${ctr}%):</strong> কাস্টমাররা প্রোডাক্ট কিনতে আগ্রহী হয়ে ইনবক্সে আসছে।`);
        }

        if (clicks > 0 && convRate < 10) {
            recommendations.push(`💬 <strong>Sales Conversion বাড়াতে হবে (${convRate}%):</strong> ইনবক্সে অনেক মেসেজ আসছে কিন্তু অর্ডার কনফার্ম কম হচ্ছে। কাস্টমারকে ৫ মিনিটের মধ্যে রিপ্লাই দিন এবং ডেলিভারি চার্জ ও প্রোডাক্টের রিভিউ ছবি পাঠিয়ে বিশ্বাস অর্জন করুন।`);
        } else if (orders > 0) {
            recommendations.push(`🏆 <strong>চমৎকার সেলস কনভার্সন (${convRate}%):</strong> আপনার ইনবক্স ক্লোজিং স্ট্র্যাটেজি খুব ভালো কাজ করছে। কাস্টমারদের থেকে রিভিউ নিয়ে পেজে পোস্ট করুন।`);
        }

        resultBox.innerHTML = `
            <div class="metric-summary">
                <div class="stat-pill"><span>Engagement Rate</span><strong>${engRate}%</strong></div>
                <div class="stat-pill"><span>Click / Inbox Rate</span><strong>${ctr}%</strong></div>
                <div class="stat-pill"><span>Order Conversion</span><strong>${convRate}%</strong></div>
            </div>
            ${recommendations.map(item => `<div class="advice-item">${item}</div>`).join('')}
        `;
    });

    // 3. Daily Growth Checklist Persistence
    const checkboxes = document.querySelectorAll('#daily-checklist input[type="checkbox"]');
    const progressPercent = document.getElementById('progress-percent');
    const progressFill = document.getElementById('progress-fill');

    const todayKey = 'sr_checklist_' + new Date().toDateString();
    const savedChecks = JSON.parse(localStorage.getItem(todayKey)) || {};

    function updateProgress() {
        let checkedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) checkedCount++;
        });
        const percent = Math.round((checkedCount / checkboxes.length) * 100);
        progressPercent.textContent = percent + '%';
        progressFill.style.width = percent + '%';
    }

    checkboxes.forEach(cb => {
        const id = cb.getAttribute('data-id');
        if (savedChecks[id]) cb.checked = true;

        cb.addEventListener('change', () => {
            savedChecks[id] = cb.checked;
            localStorage.setItem(todayKey, JSON.stringify(savedChecks));
            updateProgress();
        });
    });

    updateProgress();
});
