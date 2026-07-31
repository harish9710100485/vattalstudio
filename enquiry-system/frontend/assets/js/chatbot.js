// ===== VATTAL STUDIOS - ADVANCED CHATBOT =====

// Chatbot Knowledge Base
const chatbotKnowledge = {
    // Welcome & Greetings
    'hello': {
        responses: [
            "Hello! Welcome to Vattal Studios. I'm your virtual assistant. How can I help you today?",
            "Hi there! 👋 I'm the Vattal Studios assistant. Feel free to ask me anything about our services!",
            "Welcome to Vattal Studios! How may I assist you with your film production needs?"
        ],
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'namaste']
    },
    
    // About Vattal
    'about': {
        responses: [
            "Vattal Studios is a 360° creative studio specializing in film production, video editing, AD films, social media management, influencer marketing, and photography. We're based in Chennai and serve clients worldwide.",
            "We're a full-service creative agency offering end-to-end film production services. From concept to delivery, we handle everything under one roof!"
        ],
        keywords: ['about', 'who are you', 'what is vattal', 'tell me about vattal', 'company', 'studio']
    },
    
    // Services
    'services': {
        responses: [
            "🎬 We offer a wide range of services:\n\n• Feature Film Production\n• Short Film Production\n• Documentary Filmmaking\n• Music Video Production\n• Commercials & Ads\n• Corporate Videos\n• Event Coverage\n• Animation\n• Post Production\n• VFX & Color Grading\n• Social Media Management\n• Influencer Marketing",
            "Our core services include full-scale film production, video editing, AD films, social media strategy, influencer marketing, and captivating photoshoots. We handle everything from pre-production to final delivery!"
        ],
        keywords: ['services', 'service', 'what do you do', 'offer', 'provide', 'capabilities']
    },
    
    // Film Production
    'film production': {
        responses: [
            "🎥 Our film production services include:\n\n• Script Development\n• Pre-Production Planning\n• Casting & Crew Selection\n• Principal Photography\n• Post Production\n• VFX & Color Grading\n• Sound Design & Mixing\n• Distribution Support\n\nWe handle both feature films and short films with the same dedication to quality.",
            "We offer end-to-end film production services. From concept development to final delivery, our experienced team ensures your vision comes to life on screen."
        ],
        keywords: ['film', 'production', 'movie', 'feature film', 'short film', 'cinema']
    },
    
    // Video Editing
    'video editing': {
        responses: [
            "✂️ Our video editing services include:\n\n• Professional Video Editing\n• Color Grading\n• Sound Design\n• Motion Graphics\n• Visual Effects (VFX)\n• Video Stabilization\n• Audio Enhancement\n• Final Cut & Delivery\n\nWe use industry-standard tools like DaVinci Resolve, Adobe Premiere Pro, and After Effects.",
            "We provide professional video editing services with a focus on storytelling. Our editors bring your raw footage to life with expert cuts, transitions, color grading, and sound design."
        ],
        keywords: ['editing', 'video editing', 'editor', 'post production', 'cut', 'color grading']
    },
    
    // AD Films
    'ad films': {
        responses: [
            "📺 Our AD film services include:\n\n• TV Commercials\n• Digital Ads\n• Brand Films\n• Product Launch Videos\n• Social Media Ads\n• Corporate Ads\n• Concept Development\n• Complete Production\n\nWe create compelling advertisements that tell your brand story and engage your audience.",
            "We specialize in creating high-quality AD films that capture attention and drive results. From concept to completion, we deliver commercials that resonate with your target audience."
        ],
        keywords: ['ad', 'ad film', 'commercial', 'advertisement', 'tv ad', 'digital ad', 'brand film']
    },
    
    // Social Media
    'social media': {
        responses: [
            "📱 Our social media services include:\n\n• Social Media Strategy\n• Content Creation\n• Platform Management\n• Influencer Marketing\n• Analytics & Reporting\n• Community Management\n• Campaign Management\n\nWe help brands build a strong presence across all social media platforms.",
            "We offer comprehensive social media management and strategy services. Our team creates engaging content and manages your social presence to build your brand and grow your audience."
        ],
        keywords: ['social media', 'social', 'instagram', 'facebook', 'youtube', 'twitter', 'linkedin']
    },
    
    // Pricing
    'pricing': {
        responses: [
            "💰 Every project is unique. Our pricing depends on several factors:\n\n• Project Type & Scope\n• Duration & Complexity\n• Crew & Equipment Requirements\n• Location & Logistics\n• Post Production Needs\n• Timeline & Deadline\n\n💡 For a personalized quote, please fill out our enquiry form or contact us directly!",
            "We work with all budgets! From small independent projects to large productions. Fill out our enquiry form and we'll provide a customized quote tailored to your specific needs."
        ],
        keywords: ['price', 'pricing', 'cost', 'budget', 'expensive', 'quote', 'estimate', 'money']
    },
    
    // Timeline
    'timeline': {
        responses: [
            "⏰ Project timelines vary based on scope:\n\n• Short Films: 1-3 weeks\n• Music Videos: 1-2 weeks\n• Commercials: 1-2 weeks\n• Documentaries: 2-4 weeks\n• Feature Films: 3-6+ months\n• Animation: 2-4 weeks\n\nWe'll discuss your timeline during consultation and create a realistic schedule.",
            "We work with your timeline! Whether you need a rush project delivered quickly or a long-term production, we'll create a schedule that works for you."
        ],
        keywords: ['time', 'timeline', 'duration', 'how long', 'deadline', 'schedule', 'when']
    },
    
    // Process
    'process': {
        responses: [
            "📋 Our production process:\n\n1️⃣ Initial Consultation - Understanding your vision\n2️⃣ Project Planning - Creating a detailed plan\n3️⃣ Pre-Production - Scripting, casting, location scouting\n4️⃣ Production - Filming and shooting\n5️⃣ Post-Production - Editing, VFX, color grading\n6️⃣ Review & Approval - Feedback rounds\n7️⃣ Final Delivery - High-quality deliverables\n\nWe keep you involved at every step to ensure your vision is realized.",
            "We follow a structured yet flexible process that ensures quality at every stage. From the first consultation to final delivery, we're with you every step of the way."
        ],
        keywords: ['process', 'steps', 'how it works', 'workflow', 'method', 'approach']
    },
    
    // Contact
    'contact': {
        responses: [
            "📬 Get in touch with us:\n\n📍 Address: VATTAL MEDIA SERVICES\n   No.1, First Floor, New Colony 6th St,\n   Adambakkam, Chennai - 600088\n\n📧 Email: team@vattalstudios.com\n\n📱 Phone: +91-XXXXXXXXXX\n\n🌐 Website: www.vattalstudios.com\n\nYou can also fill out our enquiry form and we'll get back to you within 24 hours!",
            "We'd love to hear from you! Reach out via email at team@vattalstudios.com or fill out our enquiry form. We're always happy to discuss your project!"
        ],
        keywords: ['contact', 'email', 'phone', 'call', 'address', 'location', 'reach', 'connect']
    },
    
    // Team
    'team': {
        responses: [
            "👥 Our team is led by Vignesh & Nivitha, who bring years of experience in the film and creative industry. We have a dedicated team of professionals including directors, cinematographers, editors, sound designers, VFX artists, and creative strategists who work together to deliver exceptional results.",
            "We're a passionate team of creative professionals who love what we do. Led by experienced industry professionals, our team is committed to bringing your vision to life with creativity and excellence."
        ],
        keywords: ['team', 'founder', 'vignesh', 'nivitha', 'who', 'people', 'crew']
    },
    
    // Portfolio
    'portfolio': {
        responses: [
            "🎬 We've worked with some amazing clients including:\n\n• ZEE5 Entertainment\n• Aha Tamil\n• Storytel\n• YNOT Studios\n• Night Shift Studios\n\nOur portfolio includes feature films, short films, documentaries, music videos, commercials, and corporate videos across multiple genres.",
            "Our portfolio showcases a diverse range of work across films, commercials, music videos, and digital content. We've collaborated with leading brands and production houses to create compelling visual stories."
        ],
        keywords: ['portfolio', 'work', 'projects', 'showreel', 'clients', 'samples', 'past work']
    },
    
    // Testimonials
    'testimonials': {
        responses: [
            "⭐ What our clients say:\n\n'I am highly impressed with Vattal's approach to any of our project, bringing in innovative ideas that truly stand out. Their editing skills are mind-blowing!'\n- Pradeep, Marketing Manager, ZEE5 Entertainment\n\n'Team Vattal is extremely professional. It has been an absolute pleasure to work with them.'\n- Deepika Arun, Language Manager, Storytel Tamil\n\n'Working with Vattal has been a delight. I wholeheartedly recommend their services!'\n- Pranav, Head of Operations, YNOT Studios",
            "We're proud of the relationships we've built with our clients. Their testimonials speak to our commitment to quality, professionalism, and creativity in every project we undertake."
        ],
        keywords: ['testimonial', 'review', 'feedback', 'client review', 'recommendation', 'what people say']
    },
    
    // Booking
    'booking': {
        responses: [
            "📝 To book our services:\n\n1. Fill out our enquiry form on the home page\n2. We'll review your requirements\n3. Schedule a consultation call\n4. Receive a custom quote\n5. Confirm and start your project\n\nWe make the booking process simple and transparent. Fill out the form and we'll get back to you within 24 hours!",
            "Ready to start your project? Simply fill out our enquiry form with your project details and we'll get back to you within 24 hours with a customized solution."
        ],
        keywords: ['book', 'booking', 'hire', 'work with us', 'collaborate', 'start project']
    },
    
    // Default
    'default': {
        responses: [
            "I'm not quite sure about that. Let me help you with what I do know! 😊\n\nYou can ask me about:\n• Our services (film production, editing, AD films)\n• Pricing & quotes\n• Project timelines\n• Our process\n• Contact information\n• Team\n• Portfolio\n\nOr feel free to ask anything about Vattal Studios!",
            "That's a great question! While I don't have all the details, I can help you with information about our services, pricing, process, and team. What would you like to know?",
            "I'm here to help with any questions about Vattal Studios! Try asking about our services, pricing, or how to get started with your project."
        ],
        keywords: []
    }
};

// Chatbot UI
function createChatbot() {
    const chatHTML = `
        <div id="chatbot-toggle" onclick="toggleChatbot()" class="fixed bottom-6 right-6 z-50 cursor-pointer group">
            <div class="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-110">
                <i class="fas fa-comment-dots text-white text-2xl"></i>
            </div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>

        <div id="chatbot-window" class="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-[#18191b] rounded-2xl shadow-2xl hidden overflow-hidden transition-all duration-300 border border-amber-500/20">
            <!-- Header -->
            <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <i class="fas fa-film text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-white font-semibold">Vattal Assistant</h3>
                        <p class="text-amber-100 text-xs flex items-center gap-1">
                            <span class="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="resetChat()" class="text-white hover:text-gray-200 transition" title="Reset Chat">
                        <i class="fas fa-undo text-sm"></i>
                    </button>
                    <button onclick="toggleChatbot()" class="text-white hover:text-gray-200 transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="h-96 overflow-y-auto p-4 bg-[#1a1a1a] space-y-3">
                <div class="flex items-start gap-2 animate-fadeIn">
                    <div class="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-film text-white text-xs"></i>
                    </div>
                    <div class="bg-[#2d2d2d] rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] border border-gray-700">
                        <p class="text-sm text-gray-200">Hello! 👋 I'm the Vattal Studios assistant.</p>
                        <p class="text-sm text-gray-300 mt-1">I can help you with information about our services, pricing, process, and more. What would you like to know?</p>
                        <span class="text-xs text-gray-500 mt-1 block">Just now</span>
                    </div>
                </div>
            </div>

            <!-- Quick Reply Suggestions -->
            <div class="px-3 py-2 bg-[#1a1a1a] border-t border-gray-700">
                <div class="flex flex-wrap gap-1.5" id="quickReplies">
                    <button onclick="sendQuickReply('Services')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">🎬 Services</button>
                    <button onclick="sendQuickReply('Pricing')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">💰 Pricing</button>
                    <button onclick="sendQuickReply('Timeline')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">⏰ Timeline</button>
                    <button onclick="sendQuickReply('Process')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">📋 Process</button>
                    <button onclick="sendQuickReply('Contact')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">📬 Contact</button>
                    <button onclick="sendQuickReply('Portfolio')" class="text-xs bg-[#2d2d2d] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 px-3 py-1.5 rounded-full transition border border-gray-700">🎬 Portfolio</button>
                </div>
            </div>

            <!-- Input -->
            <div class="p-3 bg-[#1a1a1a] border-t border-gray-700 flex gap-2">
                <input type="text" id="chatbot-input" placeholder="Type a message..." 
                    class="flex-1 px-3 py-2 bg-[#2d2d2d] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-200 placeholder-gray-500"
                    onkeypress="if(event.key==='Enter') sendMessage()" />
                <button onclick="sendMessage()" class="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
        #chatbot-messages::-webkit-scrollbar {
            width: 4px;
        }
        #chatbot-messages::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        #chatbot-messages::-webkit-scrollbar-thumb {
            background: #f59e0b;
            border-radius: 4px;
        }
        #chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: #d97706;
        }
        .typing-indicator {
            display: inline-flex;
            gap: 4px;
            padding: 8px 12px;
        }
        .typing-indicator span {
            width: 8px;
            height: 8px;
            background: #f59e0b;
            border-radius: 50%;
            animation: typing 1.4s infinite both;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Toggle chat window
function toggleChatbot() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    window.classList.toggle('hidden');
    
    if (window.classList.contains('hidden')) {
        toggle.querySelector('i').className = 'fas fa-comment-dots text-white text-2xl';
    } else {
        toggle.querySelector('i').className = 'fas fa-times text-white text-2xl';
        setTimeout(() => document.getElementById('chatbot-input')?.focus(), 300);
    }
}

// Reset chat
function resetChat() {
    const messages = document.getElementById('chatbot-messages');
    messages.innerHTML = `
        <div class="flex items-start gap-2 animate-fadeIn">
            <div class="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-film text-white text-xs"></i>
            </div>
            <div class="bg-[#2d2d2d] rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] border border-gray-700">
                <p class="text-sm text-gray-200">Hello! 👋 I'm the Vattal Studios assistant.</p>
                <p class="text-sm text-gray-300 mt-1">How can I help you today?</p>
                <span class="text-xs text-gray-500 mt-1 block">Just now</span>
            </div>
        </div>
    `;
    showToast('info', 'Chat reset');
}

// Send message
function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        const response = getResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    }, 400 + Math.random() * 400);
}

// Send quick reply
function sendQuickReply(text) {
    addMessage(text, 'user');
    
    showTypingIndicator();
    
    setTimeout(() => {
        const response = getResponse(text);
        hideTypingIndicator();
        addMessage(response, 'bot');
    }, 300 + Math.random() * 300);
}

// Show typing indicator
function showTypingIndicator() {
    const messages = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex items-start gap-2 animate-fadeIn';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-film text-white text-xs"></i>
        </div>
        <div class="bg-[#2d2d2d] rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-700">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Add message to chat
function addMessage(text, sender) {
    const messages = document.getElementById('chatbot-messages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start gap-2 animate-fadeIn ${sender === 'user' ? 'flex-row-reverse' : ''}`;
    
    if (sender === 'bot') {
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-film text-white text-xs"></i>
            </div>
            <div class="bg-[#2d2d2d] rounded-lg ${sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} p-3 shadow-sm max-w-[85%] border border-gray-700">
                <p class="text-sm text-gray-200 whitespace-pre-line">${formattedText}</p>
                <span class="text-xs text-gray-500 mt-1 block">${time}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-white text-xs"></i>
            </div>
            <div class="bg-amber-500 text-white rounded-lg rounded-tr-none p-3 max-w-[85%]">
                <p class="text-sm whitespace-pre-line">${text}</p>
                <span class="text-amber-200 text-xs mt-1 block">${time}</span>
            </div>
        `;
    }
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Get response from knowledge base
function getResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Check for exact matches
    for (const [key, data] of Object.entries(chatbotKnowledge)) {
        if (key === 'default') continue;
        if (data.keywords && data.keywords.some(k => msg === k)) {
            return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
    }
    
    // Check for keyword matches (partial)
    for (const [key, data] of Object.entries(chatbotKnowledge)) {
        if (key === 'default') continue;
        if (data.keywords && data.keywords.some(k => msg.includes(k))) {
            return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
    }
    
    // Check for service-specific keywords
    const serviceKeywords = {
        'film production': ['feature film', 'short film', 'movie', 'cinema', 'documentary'],
        'video editing': ['edit', 'editing', 'post production', 'color grading', 'vfx'],
        'ad films': ['ad', 'commercial', 'advertisement', 'brand film'],
        'social media': ['social', 'instagram', 'facebook', 'youtube', 'marketing'],
        'music video': ['music', 'song', 'band', 'artist']
    };
    
    for (const [key, words] of Object.entries(serviceKeywords)) {
        if (words.some(w => msg.includes(w))) {
            const data = chatbotKnowledge[key];
            if (data) {
                return data.responses[Math.floor(Math.random() * data.responses.length)];
            }
        }
    }
    
    // Return default response
    const defaultData = chatbotKnowledge['default'];
    return defaultData.responses[Math.floor(Math.random() * defaultData.responses.length)];
}

// Show toast notification
function showToast(type, msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i> ${msg}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createChatbot();
});