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
            sub: 'প্রোডাক্টের সাথে মিল রেখে ভিন্ন ভিন্ন ক্যাপশন, হুক ও ভিডিও স্ক্রিপ্ট তৈরি করুন'
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
        apiStatusMsg.textContent = key ? '✅ API Key সফলভাবে সেভ হয়েছে!' : '⚠️ API Key রিমুভ করা হয়েছে (Product Engine চালু)।';
    });

    // Track last variation index so consecutive clicks don't repeat
    let lastVariationIndex = -1;

    // 1. Script & Post Generator Bot
    const generateBtn = document.getElementById('generate-script-btn');
    const scriptOutput = document.getElementById('script-output');

    generateBtn.addEventListener('click', async () => {
        const type = document.getElementById('content-type').value;
        const product = document.getElementById('product-name').value.trim() || 'আমাদের প্রোডাক্ট';
        const offer = document.getElementById('product-offer').value.trim() || 'সেরা দামে হোম ডেলিভারি সুবিধা';
        const tone = document.getElementById('content-tone').value;
        const apiKey = localStorage.getItem('sr_gemini_key');

        generateBtn.textContent = '⏳ প্রোডাক্ট অনুযায়ী ক্যাপশন তৈরি হচ্ছে...';
        generateBtn.disabled = true;

        if (apiKey) {
            try {
                const randomSeed = Math.floor(Math.random() * 100000);
                const prompt = `You are a top Bangladeshi e-commerce copywriter for Facebook page "S.R. PRIME MART" (https://www.facebook.com/SRPRIMEMART).
Create a completely fresh, unique ${type} in natural Bengali strictly tailored to the specific product: "${product}".
Offer/Price info: "${offer}".
Tone: ${tone}.
Variation seed: ${randomSeed}.
Rules:
- Mention specific real-world features, use-cases, and buyer pain points relevant to "${product}".
- Write in clean, engaging Bengali with smart emojis and a clear Call-To-Action.
- End with 4-5 relevant hashtags including #SRPrimeMart.`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                    scriptOutput.value = data.candidates[0].content.parts[0].text.trim();
                    resetBtn();
                    return;
                }
            } catch (err) {
                console.error('API Error, using Product Engine:', err);
            }
        }

        setTimeout(() => {
            scriptOutput.value = generateProductMatchedTemplate(type, product, offer, tone);
            resetBtn();
        }, 350);
    });

    function resetBtn() {
        generateBtn.textContent = '✨ Generate Fresh Script & Post';
        generateBtn.disabled = false;
    }

    function detectCategory(productText) {
        const p = productText.toLowerCase();
        if (/(watch|ওয়াচ|ঘড়ি|earbud|headphone|চার্জার|পাওয়ার ব্যাংক|gadget|গ্যাজেট|smart|camera|ক্যামেরা|mouse|keyboard|cable|anc|tws)/.test(p)) {
            return 'gadget';
        }
        if (/(wallet|ওয়ালেট|belt|বেল্ট|shirt|শার্ট|panjabi|পাঞ্জাবি|shoe|জুতা|bag|ব্যাগ|hoodie|হুডি|jacket|জ্যাকেট|glass|সানগ্লাস|leather|লেদার)/.test(p)) {
            return 'fashion';
        }
        if (/(cream|ক্রিম|serum|সিরাম|perfume|পারফিউম|attar|আতর|facewash|ফেসওয়াশ|hair|oil|তেল|skin|স্কিন|soap)/.test(p)) {
            return 'beauty';
        }
        if (/(kitchen|কিচেন|blender|ব্লেন্ডার|cooker|কুকার|lamp|ল্যাম্প|home|হোম|bottle|বটল|stand|হোল্ডার)/.test(p)) {
            return 'home';
        }
        return 'general';
    }

    function getProductProfile(product, category) {
        const profiles = {
            gadget: {
                tag: '#TechBD #GadgetBD #SmartAccessories',
                hooks: [
                    `প্রতিদিনের কাজে ${product} কি ঠিকমতো সাপোর্ট দিচ্ছে না?`,
                    `বাজেটের মধ্যে নির্ভরযোগ্য ${product} খুঁজছেন? একনজর দেখে নিন।`,
                    `ব্যবহারে স্মুথ আর লুকিংয়ে প্রিমিয়াম—এমন ${product} কয়টা পাওয়া যায়?`
                ],
                points: [
                    `দৈনন্দিন ব্যবহারে স্মুথ পারফরম্যান্স ও স্টেবল কানেক্টিভিটি`,
                    `হালকা ও পোর্টেবল ডিজাইন—অফিস, ভ্রমণ বা বাসায় সহজেই ব্যবহারযোগ্য`,
                    `দীর্ঘক্ষণ ব্যবহারের উপযোগী বিল্ড কোয়ালিটি`
                ],
                cta: `অর্ডার করতে ইনবক্সে আপনার নাম, ঠিকানা ও ফোন নম্বর পাঠান অথবা কমেন্টে "${product.split(' ')[0]}" লিখুন।`
            },
            fashion: {
                tag: '#MensFashionBD #StyleBD #LifestyleBD',
                hooks: [
                    `আপনার স্টাইলকে আরেক ধাপ এগিয়ে নিতে ${product} কেমন হয়?`,
                    `অফিস, দাওয়াত বা ক্যাজুয়াল আউটিং—সব জায়গায় মানানসই ${product}।`,
                    `ম্যাটেরিয়ালের মান নিয়ে আপস না করলে এই ${product} আপনার জন্য।`
                ],
                points: [
                    `আরামদায়ক ফিনিশিং ও দীর্ঘস্থায়ী ম্যাটেরিয়াল`,
                    `মডার্ন লুক যা সহজেই আপনার প্রতিদিনের আউটফিটের সাথে মানিয়ে যাবে`,
                    `সঠিক সাইজ ও ফিনিশিংয়ের যত্নসহ প্রস্তুত`
                ],
                cta: `পছন্দের সাইজ বা কালার বুক করতে এখনই মেসেজ দিন অথবা কমেন্টে জানান কোন কালারটি আপনার পছন্দ।`
            },
            beauty: {
                tag: '#SkincareBD #FragranceBD #SelfCareBD',
                hooks: [
                    `নিজের যত্নে ${product} যুক্ত করার আগে যা জানা জরুরি—`,
                    `প্রতিদিনের রুটিনে একটি ভালো ${product} বড় পার্থক্য তৈরি করতে পারে।`,
                    `খাঁটি ও মানসম্মত ${product} খুঁজে পাওয়া এখন আগের চেয়ে সহজ।`
                ],
                points: [
                    `নিয়মিত ব্যবহারের উপযোগী ব্যালেন্সড ফর্মুলা`,
                    `ব্যবহারের পর ফ্রেশ ও কম্ফোর্টেবল ফিল`,
                    `প্রথমবার ব্যবহারকারীদের জন্যও সহজ রুটিন ফ্রেন্ডলি অপশন`
                ],
                cta: `বিস্তারিত জানতে বা অর্ডার করতে পেজে মেসেজ করুন, আমরা প্রয়োজনীয় গাইডলাইন দিয়ে সাহায্য করব।`
            },
            home: {
                tag: '#HomeLivingBD #SmartHomeBD #DailyNeedsBD',
                hooks: [
                    `ঘরের বা কাজের জায়গার ছোট্ট একটি ${product} কীভাবে সময় বাঁচাতে পারে?`,
                    `কাজকে আরও সহজ ও গোছানো করতে ${product} দারুণ কার্যকর।`,
                    `ঘরের প্রয়োজনীয় জিনিসে স্মার্ট চয়েস মানেই বাড়তি স্বস্তি—দেখুন ${product}।`
                ],
                points: [
                    `দৈনন্দিন কাজ সহজ ও সময়সাশ্রয়ী করার উপযোগী ডিজাইন`,
                    `টেকসই গঠন ও সহজে ব্যবহার করার সুবিধা`,
                    `পরিবারের সবার ব্যবহারের জন্য প্র্যাকটিক্যাল চয়েস`
                ],
                cta: `হোম ডেলিভারিতে ${product} নিতে এখনই আমাদের ইনবক্সে নাম ও ঠিকানা লিখে মেসেজ করুন।`
            },
            general: {
                tag: '#OnlineShopBD #ShoppingBD #QualityFirst',
                hooks: [
                    `${product} নেওয়ার আগে কোয়ালিটি আর দাম—দুটোই মিলিয়ে দেখা জরুরি।`,
                    `আপনার প্রয়োজনীয় ${product} এখন পাওয়া যাচ্ছে S.R. PRIME MART-এ।`,
                    `সঠিক দামে মানসম্মত ${product} খুঁজলে এই পোস্টটি আপনার জন্য।`
                ],
                points: [
                    `প্রয়োজন অনুযায়ী ব্যবহারোপযোগী ও মানসম্মত নির্মাণ`,
                    `হাতে পাওয়ার পর যাচাই করে নেওয়ার সুবিধা`,
                    `সাশ্রয়ী প্রাইসিং ও নির্ভরযোগ্য ডেলিভারি সাপোর্ট`
                ],
                cta: `অর্ডার করতে বা বিস্তারিত জানতে এখনই পেজে মেসেজ করুন।`
            }
        };

        return profiles[category] || profiles.general;
    }

    function pickNonRepeatingIndex(length) {
        if (length <= 1) return 0;
        let idx = Math.floor(Math.random() * length);
        if (idx === lastVariationIndex) {
            idx = (idx + 1) % length;
        }
        lastVariationIndex = idx;
        return idx;
    }

    function generateProductMatchedTemplate(type, product, offer, tone) {
        const category = detectCategory(product);
        const profile = getProductProfile(product, category);
        const vIdx = pickNonRepeatingIndex(profile.hooks.length);
        const hook = profile.hooks[vIdx];

        const toneClosing = tone === 'urgent'
            ? `⏳ সীমিত স্টকের অফার: ${offer}। দ্রুত অর্ডার কনফার্ম করুন।`
            : tone === 'friendly'
                ? `😊 অফার ও মূল্য: ${offer}। কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞেস করুন!`
                : `💰 অফার বিস্তারিত: ${offer}`;

        if (type === 'reels-script') {
            const angle = vIdx === 0 ? 'প্রবলেম ও সমাধান' : vIdx === 1 ? 'ফার্স্ট লুক ও ফিচার' : 'ব্যবহারের খুঁটিনাটি';
            return `🎬 Reels Script (${angle}) — ${product}
--------------------------------------------------
[0:00 - 0:03 | Hook]
"${hook}"

[0:04 - 0:18 | Product Showcase]
• ${product} হাতে নিয়ে কাছ থেকে দেখান এবং বলুন: "${profile.points[0]}।"
• দ্বিতীয় শটে দেখান: "${profile.points[1]}।"
• তৃতীয় শটে দেখান: "${profile.points[2]}।"

[0:19 - 0:30 | Offer & CTA]
"${toneClosing}
${profile.cta}"

#SRPrimeMart ${profile.tag}`;
        }

        if (type === 'engagement-post') {
            const optionA = vIdx === 0 ? `বাজেট-ফ্রেন্ডলি ${product}` : `দ্রুত ডেলিভারি ও সহজ সাপোর্ট`;
            const optionB = vIdx === 0 ? `প্রিমিয়াম কোয়ালিটির ${product}` : `দীর্ঘস্থায়ী বিল্ড ও ফিনিশিং`;

            return `${product} নেওয়ার ক্ষেত্রে আপনি কোন বিষয়টিকে বেশি গুরুত্ব দেন?

Option 1: ${optionA}
Option 2: ${optionB}

কমেন্টে 1 বা 2 লিখে আপনার মতামত জানান। ${product} নিয়ে আপনার কোনো প্রশ্ন থাকলেও কমেন্টে লিখতে পারেন—আমরা উত্তর দিচ্ছি।

Page: https://www.facebook.com/SRPRIMEMART

#SRPrimeMart ${profile.tag}`;
        }

        if (type === 'ad-copy') {
            return `${hook}

${product} — S.R. PRIME MART
• ${profile.points[0]}
• ${profile.points[1]}
• ${profile.points[2]}

${toneClosing}
${profile.cta}

👉 https://www.facebook.com/SRPRIMEMART

#SRPrimeMart ${profile.tag}`;
        }

        return `${hook}

${product} কেন দেখবেন:
• ${profile.points[0]}
• ${profile.points[1]}
• ${profile.points[2]}

${toneClosing}

${profile.cta}
Page Link: https://www.facebook.com/SRPRIMEMART

#SRPrimeMart ${profile.tag}`;
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
            recommendations.push(`📉 <strong>Engagement Rate কম (${engRate}%):</strong> পোস্টে প্রোডাক্টের নির্দিষ্ট ব্যবহার বা তুলনা যুক্ত করুন এবং Reels-এর মাধ্যমে নতুন রিচ বাড়ান।`);
        } else {
            recommendations.push(`🔥 <strong>দারুণ Engagement Rate (${engRate}%):</strong> অডিয়েন্স প্রোডাক্ট পোস্টে ভালো সাড়া দিচ্ছে। টার্গেটেড বুস্ট বা রিপিট পোস্ট টেস্ট করতে পারেন।`);
        }

        if (ctr < 2) {
            recommendations.push(`🎯 <strong>Inbox/Click কম (${ctr}%):</strong> ক্যাপশনের শেষে স্পষ্ট অ্যাকশন দিন যাতে কাস্টমার সহজেই মেসেজ বা কমেন্ট করে।`);
        } else {
            recommendations.push(`✅ <strong>ভালো Click-Through Rate (${ctr}%):</strong> ক্যাপশন ও প্রোডাক্ট উপস্থাপনা আগ্রহ তৈরি করতে পারছে।`);
        }

        if (clicks > 0 && convRate < 10) {
            recommendations.push(`💬 <strong>Sales Conversion বাড়াতে হবে (${convRate}%):</strong> ইনবক্সে দ্রুত রিপ্লাই দিন, প্রোডাক্টের আসল ছবি/ভিডিও ও ডেলিভারি নিয়ম পরিষ্কারভাবে জানান।`);
        } else if (orders > 0) {
            recommendations.push(`🏆 <strong>চমৎকার সেলস কনভার্সন (${convRate}%):</strong> ইনবক্স ক্লোজিং ভালো হচ্ছে। সন্তুষ্ট কাস্টমারদের রিভিউ সংগ্রহে রাখুন।`);
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
