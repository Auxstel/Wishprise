/**
 * prerender.js
 * Generates static HTML files for each route at build time.
 * Uses pure Node.js — no browser or Puppeteer needed.
 * Each page gets unique content so crawlers see real text instead of empty SPA shell.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, 'dist');

// Read the built index.html as our template
const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');

// Page-specific content for each route
const PAGES = {
    '/about': {
        title: 'About Wishprise - Our Mission to Make Birthdays Magical',
        description: 'Learn about Wishprise\'s mission to eliminate boring text wishes and replace them with magical, interactive 3D experiences.',
        content: `
      <h1>Reimagining the Birthday Wish</h1>
      <h2>The Problem</h2>
      <p>Every year, billions of birthday wishes are sent. Almost all of them are the same: "Happy Birthday!" on a WhatsApp message, a Facebook post, or a generic e-card. We wanted to change that.</p>
      <h2>Our Solution</h2>
      <p>Wishprise lets you create a fully interactive 3D birthday experience in minutes. The recipient gets a unique link that opens a magical world: they pop balloons, blow out candles on a 3D cake, spin a wheel of wishes, and discover heartfelt messages and voice notes — all in their browser, no app needed.</p>
      <h2>How It's Built</h2>
      <p>Wishprise is built with React, Three.js for 3D graphics, Web Audio API for interactive sound, and Supabase for secure cloud storage. The entire experience runs in the browser with no downloads required.</p>
      <h2>Our Philosophy</h2>
      <ul>
        <li>Free forever — no hidden fees, no premium tier</li>
        <li>Privacy first — surprises can auto-delete after viewing</li>
        <li>No account needed — create and share in minutes</li>
        <li>Works everywhere — desktop, tablet, phone</li>
      </ul>
      <p>Contact us: <a href="mailto:octaacebusiness@gmail.com">octaacebusiness@gmail.com</a></p>
    `
    },
    '/privacy': {
        title: 'Privacy Policy | Wishprise',
        description: 'Read our privacy policy to understand how Wishprise handles your data.',
        content: `
      <h1>Privacy Policy</h1>
      <p>Last updated: March 12, 2026</p>
      <h2>1. Introduction</h2>
      <p>Welcome to Wishprise. Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our birthday surprise creation service.</p>
      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Content You Create:</strong> Messages, images, and audio files you upload.</li>
        <li><strong>Usage Data:</strong> Anonymous analytics about how you interact with our service.</li>
        <li><strong>Device Information:</strong> Browser type, device type, and IP address for security.</li>
      </ul>
      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>Provide and maintain our birthday surprise creation service.</li>
        <li>Store and deliver your created surprises to recipients.</li>
        <li>Improve our service through anonymous analytics.</li>
        <li>Display relevant advertisements through Google AdSense.</li>
        <li>Prevent fraud and ensure the security of our platform.</li>
      </ul>
      <h2>4. Data Storage & Retention</h2>
      <p>Your birthday surprises are stored on our secure, private servers powered by Supabase. All uploaded media (audio, voice messages) are stored in a private storage bucket and can only be accessed through temporary, time-limited signed URLs generated when the surprise is viewed.</p>
      <p>Our data retention policy:</p>
      <ul>
        <li><strong>After viewing:</strong> Surprise content (audio, voice messages, and the database record) is automatically deleted once the recipient views the surprise.</li>
        <li><strong>Unviewed surprises:</strong> Any surprise that has not been viewed is automatically deleted after 30 days from creation.</li>
        <li><strong>No long-term storage:</strong> We do not retain personal data longer than necessary to deliver your surprise.</li>
      </ul>
      <h2>5. Third-Party Services</h2>
      <ul>
        <li><strong>Supabase:</strong> For secure database and file storage.</li>
        <li><strong>Vercel:</strong> For hosting our web application.</li>
        <li><strong>Google AdSense:</strong> To display advertisements.</li>
        <li><strong>Google Analytics:</strong> To understand how users interact with our service.</li>
      </ul>
      <p>Learn more about Google's data practices at <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>
      <p>To understand how Google uses data when you use our site, visit <a href="https://www.google.com/policies/privacy/partners/">How Google uses data when you use our partners' sites or apps</a>.</p>
      <h2>6. Your Rights</h2>
      <ul>
        <li>Request access to personal data we hold about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Opt out of personalized advertising.</li>
        <li>Withdraw consent at any time.</li>
      </ul>
      <h2>7. Children's Privacy</h2>
      <p>Wishprise is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
      <h2>8. Contact Us</h2>
      <p>Questions about this Privacy Policy? Contact us at: <a href="mailto:octaacebusiness@gmail.com">octaacebusiness@gmail.com</a></p>
    `
    },
    '/terms': {
        title: 'Terms of Service | Wishprise',
        description: 'Read our terms of service for using Wishprise.',
        content: `
      <h1>Terms of Service</h1>
      <p>Last updated: December 24, 2025</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Wishprise ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
      <h2>2. Description of Service</h2>
      <p>Wishprise is a free online platform that allows users to create interactive, personalized birthday surprise experiences. Users can upload images, record audio messages, write personalized text, and share a unique link with their intended recipient.</p>
      <h2>3. User Responsibilities</h2>
      <ul>
        <li>Use the service only for lawful purposes.</li>
        <li>Not upload any content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
        <li>Not upload content that infringes on intellectual property rights of others.</li>
        <li>Not attempt to interfere with or disrupt the service or servers.</li>
        <li>Not use the service to send spam or unsolicited messages.</li>
      </ul>
      <h2>4. Content Ownership</h2>
      <p>You retain ownership of any content you upload to Wishprise. By uploading content, you grant us a limited, non-exclusive license to store, display, and transmit that content solely for the purpose of providing the Service.</p>
      <h2>5. Content Moderation</h2>
      <p>We reserve the right to remove any content that violates these terms or that we deem inappropriate, without prior notice.</p>
      <h2>6. One-Time View Feature</h2>
      <p>Wishprise offers a "one-time view" feature where uploaded media may be automatically deleted after the recipient views it.</p>
      <h2>7. Advertisements</h2>
      <p>Wishprise is a free service supported by advertisements provided by Google AdSense. You can opt out of personalized ads through your browser settings.</p>
      <h2>8. Disclaimer of Warranties</h2>
      <p>The Service is provided "as is" without warranties of any kind, either express or implied.</p>
      <h2>9. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Wishprise shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
      <h2>10. Contact Information</h2>
      <p>Questions? Contact us at: <a href="mailto:octaacebusiness@gmail.com">octaacebusiness@gmail.com</a></p>
    `
    },
    '/contact': {
        title: 'Contact Us | Wishprise',
        description: 'Get in touch with the Wishprise team.',
        content: `
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Whether you have a question, feedback, or just want to say hello.</p>
      <h2>Email</h2>
      <p>Reach us at: <a href="mailto:octaacebusiness@gmail.com">octaacebusiness@gmail.com</a></p>
      <h2>About Wishprise</h2>
      <p>Wishprise is a free platform for creating magical, interactive 3D birthday surprises. No login required.</p>
      <nav>
        <a href="/">Home</a> | <a href="/about">About</a> | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms</a> | <a href="/resources">Resources</a>
      </nav>
    `
    },
    '/whatsapp-birthday-surprise': {
        title: 'Send a Birthday Surprise via WhatsApp Link | 3D Magic',
        description: 'The best way to send a birthday surprise via WhatsApp. Create a stunning 3D interactive link for free. No login required. Perfect for long-distance friends.',
        content: `
      <h1>The Perfect WhatsApp Birthday Surprise</h1>
      <p>Stop sending boring "Happy Birthday" texts. Send an interactive 3D experience they can open right in their chat.</p>
      <h2>Why use Wishprise for WhatsApp?</h2>
      <ul>
        <li>It generates a beautiful link preview in the chat</li>
        <li>No login required for you or the recipient</li>
        <li>Features 3D cakes, interactive balloons, and music</li>
        <li>Works perfectly on mobile devices</li>
      </ul>
      <p><a href="/create">Create Your WhatsApp Surprise Now →</a></p>
    `
    },
    '/long-distance-birthdays': {
        title: 'Best Virtual Birthday Surprise for Long Distance | Wishprise',
        description: 'The ultimate long-distance birthday surprise tool. Create a 3D interactive magic gift for your partner or friend. No shipping, just pure 3D magic via link.',
        content: `
      <h1>Celebrate Together, Miles Apart</h1>
      <p>Distance is just a number. With Wishprise, you can send a magical 3D surprise that feels like you're right there with them. No shipping required. No delays.</p>
      <h2>Perfect for Long Distance</h2>
      <ul>
        <li>Instant delivery via a simple link</li>
        <li>Personal voice notes and heartfelt messages</li>
        <li>Interactive 3D elements create a sense of presence</li>
        <li>100% free and private</li>
      </ul>
      <p><a href="/create">Start Your Long Distance Surprise →</a></p>
    `
    },
    '/resources': {
        title: 'Birthday Resources & Guides | Wishprise',
        description: 'Helpful guides on virtual birthday celebrations, digital cards, and birthday message etiquette.',
        content: `
      <h1>Birthday Resources & Guides</h1>
      <p>Everything you need to make birthdays special, whether near or far.</p>
      <ul>
        <li><a href="/resources/virtual-birthday-ideas-2026">10 Creative Virtual Birthday Ideas for 2026</a> — The world has changed, and so has the way we celebrate. Virtual birthdays are a unique way to connect globally.</li>
        <li><a href="/resources/long-distance-birthday-guide">The Complete Long-Distance Birthday Celebration Guide</a> — Distance doesn't diminish a birthday. Practical tips for celebrating across miles.</li>
        <li><a href="/resources/digital-vs-physical-cards">Digital vs Physical Birthday Cards: The Honest Comparison</a> — A practical analysis of when each format excels.</li>
        <li><a href="/resources/birthday-message-etiquette">Birthday Message Etiquette: The Unwritten Rules</a> — Navigate the nuances of birthday wishes for every relationship.</li>
      </ul>
    `
    },
    '/resources/virtual-birthday-ideas-2026': {
        title: '10 Creative Virtual Birthday Ideas for 2026 | Wishprise',
        description: 'Virtual birthdays are no longer just a backup plan. Here are 10 creative ideas for 2026.',
        content: `
      <h1>10 Creative Virtual Birthday Ideas for 2026</h1>
      <p>Gone are the days when a virtual birthday meant an awkward Zoom call. In 2026, technology has given us tools to make digital gatherings just as exciting as physical ones.</p>
      <h2>1. Send an Interactive 3D Wish</h2>
      <p>Instead of a flat e-card, send a Wishprise. It allows the birthday person to virtually "blow out" candles on a 3D cake, complete with spatial audio and physics.</p>
      <h2>2. Virtual Escape Rooms</h2>
      <p>Companies like The Escape Game offer remote adventures where you control a real-life avatar or explore a digital room together.</p>
      <h2>3. Synchronized Movie Night</h2>
      <p>Use tools like Teleparty to watch a favorite movie together with real-time commentary.</p>
      <h2>4. Online Trivia Competition</h2>
      <p>Create a custom Kahoot! quiz about the birthday person.</p>
      <h2>5. Virtual Mixology Class</h2>
      <p>Hire a mixologist to guide your group through making cocktails together.</p>
      <h2>6. Multiplayer Gaming Tournament</h2>
      <p>Games like Jackbox Party Pack are the gold standard for virtual parties.</p>
      <h2>7. The "Surprise" Video Montage</h2>
      <p>Ask friends to record 15-second video messages and stitch them together.</p>
      <h2>8. Digital Gift Unboxing</h2>
      <p>Ask the recipient to leave gifts unopened until the video call for genuine reactions.</p>
      <h2>9. Theme Dress-Up</h2>
      <p>Set a theme—80s Neon, Superheroes, or "Fancy from the Waist Up."</p>
      <h2>10. Digital Jam Session</h2>
      <p>For musical groups, do a karaoke session using YouTube lyric videos.</p>
      <p><a href="/create">Create a Free Surprise on Wishprise →</a></p>
    `
    },
    '/resources/long-distance-birthday-guide': {
        title: 'Long-Distance Birthday Celebration Guide | Wishprise',
        description: 'Practical tips for celebrating birthdays across miles and time zones.',
        content: `
      <h1>The Complete Long-Distance Birthday Celebration Guide</h1>
      <p>Distance doesn't diminish a birthday — it just asks for more creativity. Here's how to make it special.</p>
      <h2>Before the Day</h2>
      <ul>
        <li>Coordinate with local friends for a surprise delivery</li>
        <li>Send a physical gift to arrive on the actual day</li>
        <li>Create a Wishprise 3D surprise to send at midnight their time</li>
      </ul>
      <h2>On the Day</h2>
      <ul>
        <li>Schedule a video call during their free time</li>
        <li>Do an activity together digitally — cooking, painting, games</li>
        <li>Share a playlist of songs that remind you of them</li>
      </ul>
      <h2>Making it Personal</h2>
      <p>The best long-distance celebrations focus on quality over spectacle. A heartfelt voice message or a personalized 3D birthday experience means more than an expensive gift.</p>
      <p><a href="/create">Create a Free Surprise on Wishprise →</a></p>
    `
    },
    '/resources/digital-vs-physical-cards': {
        title: 'Digital vs Physical Birthday Cards | Wishprise',
        description: 'An honest comparison of digital and physical birthday cards — when each format excels.',
        content: `
      <h1>Digital vs Physical Birthday Cards: The Honest Comparison</h1>
      <p>The birthday card market has evolved. Here's when each format truly shines.</p>
      <h2>Physical Cards Excel When...</h2>
      <ul>
        <li>You want something the recipient can display on a shelf</li>
        <li>You're attending the celebration in person</li>
        <li>The recipient values traditional gestures</li>
      </ul>
      <h2>Digital Cards Excel When...</h2>
      <ul>
        <li>You're celebrating across distances or time zones</li>
        <li>You want to include multimedia — music, voice, animation</li>
        <li>You need it last-minute (we've all been there)</li>
        <li>You care about environmental impact</li>
      </ul>
      <h2>The Best of Both Worlds</h2>
      <p>Interactive digital experiences like Wishprise combine the personal touch of a handwritten card with the multimedia richness of digital — 3D cakes, personal voice messages, and interactive elements.</p>
      <p><a href="/create">Create a Free Surprise on Wishprise →</a></p>
    `
    },
    '/resources/birthday-message-etiquette': {
        title: 'Birthday Message Etiquette Guide | Wishprise',
        description: 'Navigate the nuances of birthday wishes for every relationship and situation.',
        content: `
      <h1>Birthday Message Etiquette: The Unwritten Rules</h1>
      <p>What you say in a birthday message matters. Here's how to get it right for every situation.</p>
      <h2>For Close Friends</h2>
      <p>Be specific and personal. Reference inside jokes, shared memories, or recent events in their life.</p>
      <h2>For Family Members</h2>
      <p>Express warmth and gratitude. Mention what they mean to you beyond the birthday.</p>
      <h2>For Colleagues</h2>
      <p>Keep it friendly but professional. A genuine one-liner beats a generic paragraph.</p>
      <h2>For Acquaintances</h2>
      <p>Short and genuine is perfect. "Happy birthday! Hope it's a great one."</p>
      <h2>Timing Matters</h2>
      <ul>
        <li>Midnight wishes show you remembered first</li>
        <li>Morning wishes are always welcome</li>
        <li>Late wishes — mention you were thinking of them</li>
      </ul>
      <h2>Going Beyond Text</h2>
      <p>A personalized 3D surprise, voice message, or video greeting shows vastly more effort than a text. Consider using Wishprise for birthdays that really matter.</p>
      <p><a href="/create">Create a Free Surprise on Wishprise →</a></p>
    `
    },
    '/resources/whatsapp-birthday-surprise-ideas': {
        title: '5 Creative WhatsApp Birthday Surprise Ideas for 2026',
        description: 'Looking for unique ways to surprise a friend on WhatsApp? From 3D interactive links to custom voice notes, here are the best virtual surprise ideas.',
        content: `
      <h1>5 Creative WhatsApp Birthday Surprise Ideas for 2026</h1>
      <p>Sending a "Happy Birthday" text is standard. Sending a surprise that actually matters? That takes a little more thought.</p>
      <h2>1. The 3D Interactive Surprise Link</h2>
      <p>Using a birthday wish maker like Wishprise, you can create a unique 3D cake that they actually "unwrap" or "cut" on their screen.</p>
      <h2>2. The "Time-Released" Voice Note</h2>
      <p>Create a series of short voice notes to be opened at specific times throughout the day.</p>
      <h2>3. The Mystery Status Update</h2>
      <p>Post a blurry photo with a countdown on your WhatsApp Status.</p>
      <p><a href="/resources/whatsapp-birthday-surprise-ideas">Read the full guide here →</a></p>
    `
    },
    '/ai-wishes': {
        title: 'AI Birthday Wish Generator - Create Heartfelt Messages | Wishprise',
        description: 'Generate personalized, heartfelt birthday wishes using AI. Choose the tone, relationship, and style — get the perfect birthday message instantly. Free, no login.',
        content: `
      <h1>AI Birthday Wish Generator</h1>
      <p>Struggling to find the right words? Let our AI craft the perfect birthday message for your loved ones.</p>
      <h2>How It Works</h2>
      <ul>
        <li>Select your relationship (friend, partner, parent, colleague)</li>
        <li>Choose a tone (funny, heartfelt, professional, poetic)</li>
        <li>Get multiple unique wish options instantly</li>
        <li>Copy and use anywhere — WhatsApp, cards, or inside a Wishprise surprise</li>
      </ul>
      <h2>Why Use Our AI Wish Generator?</h2>
      <p>Every birthday deserves more than a generic "HBD." Our AI understands context and emotion, creating wishes that feel genuinely personal and thoughtful.</p>
      <p><a href="/ai-wishes">Try the AI Wish Generator →</a></p>
    `
    },
    '/poster': {
        title: 'Birthday Poster Maker - Create Stunning Posters Free | Wishprise',
        description: 'Design beautiful birthday posters with our free online poster maker. Choose from premium templates, customize text and colors. Download instantly.',
        content: `
      <h1>Birthday Poster Maker</h1>
      <p>Create eye-catching birthday posters in seconds. Choose from professionally designed templates and customize everything.</p>
      <h2>Features</h2>
      <ul>
        <li>Multiple premium poster templates</li>
        <li>Customizable text, colors, and fonts</li>
        <li>High-resolution download</li>
        <li>Perfect for social media, printing, or sharing</li>
      </ul>
      <p><a href="/poster">Create Your Birthday Poster →</a></p>
    `
    },
    '/gifts': {
        title: 'Birthday Gift Suggestions - Curated Ideas | Wishprise',
        description: 'Find the perfect birthday gift with our curated suggestions. Browse ideas for friends, family, partners, and colleagues. Every budget covered.',
        content: `
      <h1>Birthday Gift Suggestions</h1>
      <p>Finding the perfect gift can be stressful. We've curated thoughtful suggestions for every relationship and budget.</p>
      <h2>Browse by Relationship</h2>
      <ul>
        <li>For Your Partner — Romantic and meaningful gifts</li>
        <li>For Friends — Fun and memorable picks</li>
        <li>For Parents — Thoughtful and heartfelt choices</li>
        <li>For Colleagues — Professional yet personal options</li>
      </ul>
      <p><a href="/gifts">Explore Gift Ideas →</a></p>
    `
    },
    '/space-birthday': {
        title: 'NASA Space Birthday - What Happened in Space on Your Birthday | Wishprise',
        description: 'Discover what NASA captured in space on your birthday. See the Astronomy Picture of the Day from your birth date. A unique, cosmic birthday experience.',
        content: `
      <h1>Your NASA Space Birthday</h1>
      <p>Ever wondered what the universe looked like on the day you were born? Find out with NASA's Astronomy Picture of the Day.</p>
      <h2>How It Works</h2>
      <ul>
        <li>Enter your birthday</li>
        <li>See the official NASA astronomy image from that date</li>
        <li>Learn about the cosmic event captured</li>
        <li>Share your space birthday with friends</li>
      </ul>
      <p><a href="/space-birthday">Discover Your Space Birthday →</a></p>
    `
    },
    '/birthday-wishes-for/my/friend': {
        title: 'Birthday Wishes for Best Friend - 3D Interactive Surprise | Wishprise',
        description: 'Create a magical 3D birthday surprise for your best friend. Interactive cakes, personal messages, and music — all in one shareable link. Free!',
        content: `
      <h1>Birthday Wishes for Your Best Friend</h1>
      <p>Your best friend deserves more than a generic text. Create an interactive 3D birthday experience they'll never forget.</p>
      <p><a href="/create">Create a Surprise for Your Friend →</a></p>
    `
    },
    '/birthday-wishes-for/my/sister': {
        title: 'Birthday Wishes for Sister - 3D Interactive Surprise | Wishprise',
        description: 'Make your sister feel special with a magical 3D birthday surprise. Personalized cakes, heartfelt messages, and music. Free and instant!',
        content: `
      <h1>Birthday Wishes for Your Sister</h1>
      <p>Sisters are the best friends life gives us. Show yours how much she means with a stunning 3D birthday surprise.</p>
      <p><a href="/create">Create a Surprise for Your Sister →</a></p>
    `
    },
    '/birthday-wishes-for/my/brother': {
        title: 'Birthday Wishes for Brother - 3D Interactive Surprise | Wishprise',
        description: 'Surprise your brother with an epic 3D birthday experience. Custom cakes, personal messages, and interactive elements. Free!',
        content: `
      <h1>Birthday Wishes for Your Brother</h1>
      <p>Brothers deserve an epic celebration. Create an interactive 3D birthday surprise that will blow his mind.</p>
      <p><a href="/create">Create a Surprise for Your Brother →</a></p>
    `
    },
    '/birthday-wishes-for/my/mom': {
        title: 'Birthday Wishes for Mom - 3D Interactive Surprise | Wishprise',
        description: 'Make Mom cry happy tears with a heartfelt 3D birthday surprise. Personal voice notes, custom cakes, and loving messages. Free!',
        content: `
      <h1>Birthday Wishes for Your Mom</h1>
      <p>She gave you everything. Give her a birthday experience that shows how much she means to you — a personalized 3D surprise with your voice and love.</p>
      <p><a href="/create">Create a Surprise for Mom →</a></p>
    `
    },
    '/birthday-wishes-for/my/boyfriend': {
        title: 'Birthday Wishes for Boyfriend - 3D Interactive Surprise | Wishprise',
        description: 'Surprise your boyfriend with a romantic 3D birthday experience. Music, personal messages, and interactive magic. Free and shareable!',
        content: `
      <h1>Birthday Wishes for Your Boyfriend</h1>
      <p>Make his day unforgettable with a romantic, interactive 3D birthday surprise. Add your voice, a love song, and a heartfelt message.</p>
      <p><a href="/create">Create a Surprise for Your Boyfriend →</a></p>
    `
    },
    '/birthday-wishes-for/my/crush': {
        title: 'Birthday Wishes for Crush - 3D Interactive Surprise | Wishprise',
        description: 'Send your crush a stunning 3D birthday surprise. Make a memorable impression with interactive magic and heartfelt wishes. Free!',
        content: `
      <h1>Birthday Wishes for Your Crush</h1>
      <p>Want to make an impression? A personalized 3D birthday surprise shows you care — without being over the top.</p>
      <p><a href="/create">Create a Surprise for Your Crush →</a></p>
    `
    },
    '/birthday-wishes-for/my/boss': {
        title: 'Birthday Wishes for Boss - Professional 3D Surprise | Wishprise',
        description: 'Send your boss a professional yet memorable 3D birthday surprise. Appropriate, impressive, and free!',
        content: `
      <h1>Birthday Wishes for Your Boss</h1>
      <p>Show appreciation with a professional yet memorable 3D birthday surprise. It's the perfect balance of thoughtful and appropriate.</p>
      <p><a href="/create">Create a Surprise for Your Boss →</a></p>
    `
    },
    '/birthday-wishes-for/my/colleague': {
        title: 'Birthday Wishes for Colleague - Fun 3D Surprise | Wishprise',
        description: 'Make your colleague smile with a fun 3D birthday surprise. Perfect for work friendships. Free and easy to share!',
        content: `
      <h1>Birthday Wishes for Your Colleague</h1>
      <p>Brighten your colleague's workday with a fun, interactive 3D birthday surprise. Share it in the team chat!</p>
      <p><a href="/create">Create a Surprise for Your Colleague →</a></p>
    `
    },
    '/birthday-wishes-for/my/bhabhi': {
        title: 'Birthday Wishes for Bhabhi - 3D Interactive Surprise | Wishprise',
        description: 'Surprise your bhabhi (sister-in-law) with a beautiful 3D birthday experience. Heartfelt wishes, music, and magic. Free!',
        content: `
      <h1>Birthday Wishes for Your Bhabhi</h1>
      <p>Show your bhabhi how much she means to the family with a beautiful, personalized 3D birthday surprise.</p>
      <p><a href="/create">Create a Surprise for Your Bhabhi →</a></p>
    `
    },
    '/birthday-wishes-for/my/daughter': {
        title: 'Birthday Wishes for Daughter - Magical 3D Surprise | Wishprise',
        description: 'Create a magical 3D birthday surprise for your daughter. Interactive cakes, loving messages, and music. Free!',
        content: `
      <h1>Birthday Wishes for Your Daughter</h1>
      <p>Make your daughter feel like a princess with a magical 3D birthday surprise filled with love and sparkle.</p>
      <p><a href="/create">Create a Surprise for Your Daughter →</a></p>
    `
    },
    '/birthday-wishes-for/my/son': {
        title: 'Birthday Wishes for Son - Epic 3D Surprise | Wishprise',
        description: 'Surprise your son with an epic 3D birthday experience. Interactive elements, cool music, and personal messages. Free!',
        content: `
      <h1>Birthday Wishes for Your Son</h1>
      <p>Give your son an epic birthday moment with an interactive 3D surprise he can explore and enjoy.</p>
      <p><a href="/create">Create a Surprise for Your Son →</a></p>
    `
    },
    '/birthday-wishes-for/my/nephew': {
        title: 'Birthday Wishes for Nephew - Fun 3D Surprise | Wishprise',
        description: 'Make your nephew smile with a fun 3D birthday surprise. Interactive cakes, cool effects, and personal wishes. Free!',
        content: `
      <h1>Birthday Wishes for Your Nephew</h1>
      <p>Be the coolest aunt or uncle — send your nephew a jaw-dropping 3D birthday surprise he can play with.</p>
      <p><a href="/create">Create a Surprise for Your Nephew →</a></p>
    `
    }
};

function generatePageHtml(route, page) {
    let html = template;

    // Replace the title
    html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${page.title}</title>`
    );

    // Replace meta description
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${page.description}">`
    );

    // Replace the static fallback content inside the root div
    const rootDivRegex = /(<div id="root" class="h-full">)([\s\S]*?)(<\/div>\s*<noscript>)/;
    const pageContent = `
    <div style="background:#020617;color:#e2e8f0;font-family:Inter,sans-serif;padding:2rem;min-height:100vh;">
      <nav style="max-width:800px;margin:0 auto 2rem;display:flex;justify-content:space-between;align-items:center;">
        <a href="/" style="color:#ffffff;font-size:1.25rem;font-weight:bold;text-decoration:none;">🎁 Wishprise</a>
        <a href="/" style="color:#e879f9;text-decoration:none;">← Home</a>
      </nav>
      <main style="max-width:800px;margin:0 auto;line-height:1.8;">
        ${page.content}
      </main>
      <footer style="max-width:800px;margin:2rem auto 0;padding:2rem 0;border-top:1px solid #1e293b;text-align:center;">
        <nav style="margin-bottom:1rem;">
          <a href="/about" style="color:#e879f9;margin:0 1rem;">About</a>
          <a href="/privacy" style="color:#e879f9;margin:0 1rem;">Privacy</a>
          <a href="/terms" style="color:#e879f9;margin:0 1rem;">Terms</a>
          <a href="/contact" style="color:#e879f9;margin:0 1rem;">Contact</a>
          <a href="/resources" style="color:#e879f9;margin:0 1rem;">Resources</a>
        </nav>
        <p style="color:#64748b;">© 2026 Wishprise. All rights reserved.</p>
      </footer>
    </div>`;

    html = html.replace(rootDivRegex, `$1${pageContent}$3`);

    return html;
}

console.log('\n🔨 Pre-rendering static pages (no browser needed)...\n');

let successCount = 0;

for (const [route, page] of Object.entries(PAGES)) {
    try {
        const html = generatePageHtml(route, page);
        const outputDir = join(DIST_DIR, ...route.split('/').filter(Boolean));
        mkdirSync(outputDir, { recursive: true });
        writeFileSync(join(outputDir, 'index.html'), html, 'utf-8');
        console.log(`  ✅ ${route}`);
        successCount++;
    } catch (err) {
        console.error(`  ❌ ${route} — ${err.message}`);
    }
}

console.log(`\n🎉 Pre-rendered ${successCount}/${Object.keys(PAGES).length} pages.\n`);
