import mongoose from 'mongoose';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';
import Contest from './models/Contest.js';
import Submission from './models/Submission.js';
import Payment from './models/Payment.js';
import { ADMIN_EMAIL, CONTEST_TYPES } from './utils/constants.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creatix';

// Initialize Firebase Admin SDK
let firebaseApp = null;
const initializeFirebase = () => {
    if (firebaseApp) return firebaseApp;
    
    try {
        let serviceAccount;
        
        if (process.env.FIREBASE_ADMIN_SDK_BASE64) {
            console.log('🔧 Loading Firebase Admin SDK from environment variable');
            const decoded = Buffer.from(process.env.FIREBASE_ADMIN_SDK_BASE64, 'base64').toString();
            serviceAccount = JSON.parse(decoded);
        } else {
            console.log('🔧 Loading Firebase Admin SDK from file');
            const serviceAccountPath = join(__dirname, 'firebase-admin-sdk.json');
            serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        }
        
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        
        console.log('✅ Firebase Admin SDK initialized');
        return firebaseApp;
    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization failed:', error.message);
        return null;
    }
};

// Default password for seeded users
const DEFAULT_PASSWORD = 'Test@123456';
const ADMIN_PASSWORD = 'Admin@123456';

// Dummy Users Data
const dummyUsers = [
    // Regular Users with contest stats (for leaderboard)
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        photo: 'https://i.pravatar.cc/150?u=john',
        role: 'user',
        bio: 'Creative enthusiast and design lover',
        address: 'New York, USA',
        contestsWon: 5,
        contestsParticipated: 12,
        points: 500,
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        photo: 'https://i.pravatar.cc/150?u=sarah',
        role: 'user',
        bio: 'Writer and content creator',
        address: 'Los Angeles, USA',
        contestsWon: 3,
        contestsParticipated: 8,
        points: 300,
    },
    {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        photo: 'https://i.pravatar.cc/150?u=mike',
        role: 'user',
        bio: 'Tech enthusiast and gamer',
        address: 'San Francisco, USA',
        contestsWon: 7,
        contestsParticipated: 15,
        points: 700,
    },
    {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        photo: 'https://i.pravatar.cc/150?u=emily',
        role: 'user',
        bio: 'Book lover and film critic',
        address: 'Chicago, USA',
        contestsWon: 2,
        contestsParticipated: 6,
        points: 200,
    },
    {
        name: 'Alex Turner',
        email: 'alex.t@example.com',
        photo: 'https://i.pravatar.cc/150?u=alex',
        role: 'user',
        bio: 'Marketing specialist',
        address: 'Miami, USA',
        contestsWon: 4,
        contestsParticipated: 10,
        points: 400,
    },
    // Additional users for leaderboard variety
    {
        name: 'Jessica Williams',
        email: 'jessica.w@example.com',
        photo: 'https://i.pravatar.cc/150?u=jessica',
        role: 'user',
        bio: 'Graphic designer and illustrator',
        address: 'Denver, USA',
        contestsWon: 8,
        contestsParticipated: 14,
        points: 800,
    },
    {
        name: 'David Brown',
        email: 'david.b@example.com',
        photo: 'https://i.pravatar.cc/150?u=david',
        role: 'user',
        bio: 'Video editor and filmmaker',
        address: 'Portland, USA',
        contestsWon: 6,
        contestsParticipated: 11,
        points: 600,
    },
    {
        name: 'Amanda Miller',
        email: 'amanda.m@example.com',
        photo: 'https://i.pravatar.cc/150?u=amanda',
        role: 'user',
        bio: 'Copywriter and brand strategist',
        address: 'Phoenix, USA',
        contestsWon: 1,
        contestsParticipated: 5,
        points: 100,
    },
    {
        name: 'Ryan Garcia',
        email: 'ryan.g@example.com',
        photo: 'https://i.pravatar.cc/150?u=ryan',
        role: 'user',
        bio: 'UX designer and researcher',
        address: 'Dallas, USA',
        contestsWon: 9,
        contestsParticipated: 18,
        points: 900,
    },
    {
        name: 'Sophia Lee',
        email: 'sophia.l@example.com',
        photo: 'https://i.pravatar.cc/150?u=sophia',
        role: 'user',
        bio: 'Social media manager and influencer',
        address: 'Atlanta, USA',
        contestsWon: 10,
        contestsParticipated: 20,
        points: 1000,
    },
    // Additional 10 users
    {
        name: 'Daniel Kim',
        email: 'daniel.k@example.com',
        photo: 'https://i.pravatar.cc/150?u=daniel',
        role: 'user',
        bio: 'Motion graphics designer',
        address: 'Seattle, USA',
        contestsWon: 11,
        contestsParticipated: 22,
        points: 1100,
    },
    {
        name: 'Olivia Martinez',
        email: 'olivia.m@example.com',
        photo: 'https://i.pravatar.cc/150?u=olivia',
        role: 'user',
        bio: 'Fashion photographer and stylist',
        address: 'Las Vegas, USA',
        contestsWon: 12,
        contestsParticipated: 25,
        points: 1200,
    },
    {
        name: 'Ethan Wilson',
        email: 'ethan.w@example.com',
        photo: 'https://i.pravatar.cc/150?u=ethan',
        role: 'user',
        bio: '3D artist and animator',
        address: 'San Diego, USA',
        contestsWon: 2,
        contestsParticipated: 7,
        points: 200,
    },
    {
        name: 'Isabella Anderson',
        email: 'isabella.a@example.com',
        photo: 'https://i.pravatar.cc/150?u=isabella',
        role: 'user',
        bio: 'Children book illustrator',
        address: 'Nashville, USA',
        contestsWon: 15,
        contestsParticipated: 30,
        points: 1500,
    },
    {
        name: 'Noah Thompson',
        email: 'noah.t@example.com',
        photo: 'https://i.pravatar.cc/150?u=noah',
        role: 'user',
        bio: 'Web developer and designer',
        address: 'Orlando, USA',
        contestsWon: 6,
        contestsParticipated: 14,
        points: 600,
    },
    {
        name: 'Mia Rodriguez',
        email: 'mia.r@example.com',
        photo: 'https://i.pravatar.cc/150?u=mia',
        role: 'user',
        bio: 'Brand identity designer',
        address: 'Houston, USA',
        contestsWon: 8,
        contestsParticipated: 16,
        points: 800,
    },
    {
        name: 'Liam Jackson',
        email: 'liam.j@example.com',
        photo: 'https://i.pravatar.cc/150?u=liam',
        role: 'user',
        bio: 'Digital marketing expert',
        address: 'Philadelphia, USA',
        contestsWon: 3,
        contestsParticipated: 9,
        points: 300,
    },
    {
        name: 'Charlotte White',
        email: 'charlotte.w@example.com',
        photo: 'https://i.pravatar.cc/150?u=charlotte',
        role: 'user',
        bio: 'Technical writer and blogger',
        address: 'Detroit, USA',
        contestsWon: 13,
        contestsParticipated: 27,
        points: 1300,
    },
    {
        name: 'James Harris',
        email: 'james.h@example.com',
        photo: 'https://i.pravatar.cc/150?u=james',
        role: 'user',
        bio: 'Product designer and innovator',
        address: 'Minneapolis, USA',
        contestsWon: 4,
        contestsParticipated: 11,
        points: 400,
    },
    {
        name: 'Ava Clark',
        email: 'ava.c@example.com',
        photo: 'https://i.pravatar.cc/150?u=ava',
        role: 'user',
        bio: 'UI/UX specialist and mentor',
        address: 'Salt Lake City, USA',
        contestsWon: 14,
        contestsParticipated: 28,
        points: 1400,
    },
    // Creators
    {
        name: 'Creative Studio',
        email: 'creator1@example.com',
        photo: 'https://i.pravatar.cc/150?u=creator1',
        role: 'creator',
        bio: 'Professional design studio hosting creative contests',
        address: 'Austin, USA',
        creatorStatus: 'approved',
    },
    {
        name: 'WriteHub Agency',
        email: 'creator2@example.com',
        photo: 'https://i.pravatar.cc/150?u=creator2',
        role: 'creator',
        bio: 'Content writing and marketing agency',
        address: 'Boston, USA',
        creatorStatus: 'approved',
    },
    {
        name: 'GameZone Reviews',
        email: 'creator3@example.com',
        photo: 'https://i.pravatar.cc/150?u=creator3',
        role: 'creator',
        bio: 'Gaming community and review platform',
        address: 'Seattle, USA',
        creatorStatus: 'approved',
    },
];

// Hardcoded Admin
const adminUser = {
    name: 'System Admin',
    email: ADMIN_EMAIL, // admin@creatix.com
    photo: 'https://i.pravatar.cc/150?u=admin',
    role: 'admin',
    bio: 'Creatix System Administrator',
    address: 'Headquarters',
};

// Helper to get random items from array
const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
};

// Function to create contests data (past, ongoing, upcoming)
const getContestsData = (creators) => {
    const now = new Date();
    const DAY = 24 * 60 * 60 * 1000;
    
    return {
        // PAST CONTESTS (completed, have winners)
        past: [
            {
                name: 'Logo Design Showdown 2024',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                description: 'Design a stunning logo for our annual design competition. Winners have been announced!',
                price: 15,
                prizeMoney: 1000,
                taskInstruction: 'Create a memorable logo. Submit in PNG and SVG formats.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() - 30 * DAY),
                creatorIndex: 0,
                status: 'completed',
            },
            {
                name: 'Tech Article Writing Championship',
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
                description: 'The best tech writers competed in this prestigious writing contest.',
                price: 10,
                prizeMoney: 600,
                taskInstruction: 'Write a 2000-word article about emerging technologies.',
                contestType: 'Article Writing',
                deadline: new Date(now.getTime() - 25 * DAY),
                creatorIndex: 1,
                status: 'completed',
            },
            {
                name: 'Ultimate Gaming Review Challenge',
                image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
                description: 'Gamers wrote amazing reviews for the best games of the year.',
                price: 8,
                prizeMoney: 500,
                taskInstruction: 'Write a comprehensive game review with pros/cons analysis.',
                contestType: 'Gaming Review',
                deadline: new Date(now.getTime() - 20 * DAY),
                creatorIndex: 2,
                status: 'completed',
            },
            {
                name: 'Brand Identity Design Contest',
                image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800',
                description: 'Designers created complete brand identities for startups.',
                price: 25,
                prizeMoney: 1500,
                taskInstruction: 'Design logo, business card, and letterhead.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() - 15 * DAY),
                creatorIndex: 0,
                status: 'completed',
            },
            {
                name: 'Travel Blog Writing Fest',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
                description: 'Amazing travel stories from around the world were shared.',
                price: 5,
                prizeMoney: 300,
                taskInstruction: 'Share your best travel adventure story.',
                contestType: 'Article Writing',
                deadline: new Date(now.getTime() - 12 * DAY),
                creatorIndex: 1,
                status: 'completed',
            },
            {
                name: 'Business Innovation Pitch 2024',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                description: 'Entrepreneurs pitched groundbreaking business ideas.',
                price: 30,
                prizeMoney: 2000,
                taskInstruction: 'Submit a complete business plan with financial projections.',
                contestType: 'Business Idea',
                deadline: new Date(now.getTime() - 10 * DAY),
                creatorIndex: 0,
                status: 'completed',
            },
            {
                name: 'Classic Movie Review Marathon',
                image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
                description: 'Film enthusiasts reviewed classic cinema masterpieces.',
                price: 5,
                prizeMoney: 250,
                taskInstruction: 'Review a movie from before 2000.',
                contestType: 'Movie Review',
                deadline: new Date(now.getTime() - 8 * DAY),
                creatorIndex: 2,
                status: 'completed',
            },
        ],
        
        // ONGOING CONTESTS (deadline approaching)
        ongoing: [
            {
                name: 'Modern App UI Challenge',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                description: 'Design a beautiful UI for a fitness tracking app. Contest ends soon!',
                price: 20,
                prizeMoney: 800,
                taskInstruction: 'Design 5 main screens with modern UI trends.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() + 3 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
            {
                name: 'AI Technology Blog Contest',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                description: 'Write about the future of artificial intelligence. Deadline approaching!',
                price: 12,
                prizeMoney: 500,
                taskInstruction: 'Write a 1500+ word article about AI applications.',
                contestType: 'Article Writing',
                deadline: new Date(now.getTime() + 5 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'Indie Game Deep Dive Review',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
                description: 'Review the best indie games of 2024. Time is running out!',
                price: 8,
                prizeMoney: 350,
                taskInstruction: 'Write an in-depth review of any indie game.',
                contestType: 'Gaming Review',
                deadline: new Date(now.getTime() + 4 * DAY),
                creatorIndex: 2,
                status: 'approved',
            },
            {
                name: 'Social Media Marketing Mastery',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
                description: 'Create a winning social media strategy. Contest ending this week!',
                price: 18,
                prizeMoney: 700,
                taskInstruction: 'Develop a 30-day social media campaign plan.',
                contestType: 'Marketing Strategy',
                deadline: new Date(now.getTime() + 6 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'Fiction Book Review Sprint',
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
                description: 'Share your thoughts on your favorite fiction book. Hurry!',
                price: 5,
                prizeMoney: 200,
                taskInstruction: 'Write a thoughtful review of a fiction book.',
                contestType: 'Book Review',
                deadline: new Date(now.getTime() + 2 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'Digital Banner Ad Blitz',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                description: 'Design eye-catching ad banners. Just 5 days left!',
                price: 10,
                prizeMoney: 400,
                taskInstruction: 'Create ad banners in 3 standard sizes.',
                contestType: 'Digital Advertisement',
                deadline: new Date(now.getTime() + 5 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
        ],
        
        // UPCOMING CONTESTS (future deadline)
        upcoming: [
            {
                name: 'E-commerce Website Design',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                description: 'Design a complete e-commerce website for a fashion brand.',
                price: 30,
                prizeMoney: 1200,
                taskInstruction: 'Design homepage, product page, cart, and checkout screens.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() + 21 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
            {
                name: 'Cryptocurrency Explainer Article',
                image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
                description: 'Write an accessible guide to cryptocurrency for beginners.',
                price: 15,
                prizeMoney: 600,
                taskInstruction: 'Write a beginner-friendly crypto guide, 2000+ words.',
                contestType: 'Article Writing',
                deadline: new Date(now.getTime() + 18 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'RPG Game Review Tournament',
                image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
                description: 'Review your favorite RPG game from any era.',
                price: 10,
                prizeMoney: 450,
                taskInstruction: 'Write a detailed RPG game review with scoring.',
                contestType: 'Gaming Review',
                deadline: new Date(now.getTime() + 25 * DAY),
                creatorIndex: 2,
                status: 'approved',
            },
            {
                name: 'Startup Pitch Competition',
                image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
                description: 'Pitch your startup idea to win funding support.',
                price: 35,
                prizeMoney: 2500,
                taskInstruction: 'Submit business plan, pitch deck, and financial model.',
                contestType: 'Business Idea',
                deadline: new Date(now.getTime() + 30 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
            {
                name: 'Documentary Film Review',
                image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
                description: 'Review impactful documentaries that changed perspectives.',
                price: 8,
                prizeMoney: 300,
                taskInstruction: 'Write an analytical review of a documentary film.',
                contestType: 'Movie Review',
                deadline: new Date(now.getTime() + 15 * DAY),
                creatorIndex: 2,
                status: 'approved',
            },
            {
                name: 'Content Marketing Strategy Challenge',
                image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
                description: 'Develop a content marketing strategy for a SaaS company.',
                price: 22,
                prizeMoney: 900,
                taskInstruction: 'Create a 90-day content marketing plan with KPIs.',
                contestType: 'Marketing Strategy',
                deadline: new Date(now.getTime() + 20 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'Non-Fiction Book Review Challenge',
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
                description: 'Review influential non-fiction books that shaped industries.',
                price: 6,
                prizeMoney: 250,
                taskInstruction: 'Write a review of a business or self-help book.',
                contestType: 'Book Review',
                deadline: new Date(now.getTime() + 12 * DAY),
                creatorIndex: 1,
                status: 'approved',
            },
            {
                name: 'Mobile Game Icon Design',
                image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
                description: 'Design app icons for mobile games across genres.',
                price: 12,
                prizeMoney: 500,
                taskInstruction: 'Design 5 app icons for different game genres.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() + 14 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
            {
                name: 'Video Ad Script Writing',
                image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800',
                description: 'Write compelling video ad scripts for digital marketing.',
                price: 14,
                prizeMoney: 550,
                taskInstruction: 'Write 3 video ad scripts: 15s, 30s, and 60s versions.',
                contestType: 'Digital Advertisement',
                deadline: new Date(now.getTime() + 17 * DAY),
                creatorIndex: 0,
                status: 'approved',
            },
            {
                name: 'Strategy Game Analysis',
                image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800',
                description: 'Deep dive analysis of popular strategy games.',
                price: 10,
                prizeMoney: 400,
                taskInstruction: 'Analyze game mechanics and strategy elements.',
                contestType: 'Gaming Review',
                deadline: new Date(now.getTime() + 22 * DAY),
                creatorIndex: 2,
                status: 'approved',
            },
        ],
        
        // PENDING CONTESTS (for admin to approve)
        pending: [
            {
                name: 'AI Art Generation Showcase',
                image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
                description: 'Create stunning AI-generated artwork.',
                price: 20,
                prizeMoney: 800,
                taskInstruction: 'Submit 5 AI-generated artworks with prompts.',
                contestType: 'Image Design',
                deadline: new Date(now.getTime() + 28 * DAY),
                creatorIndex: 0,
                status: 'pending',
            },
        ],
    };
};

async function seedDatabase() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Initialize Firebase
        const firebaseInitialized = initializeFirebase();
        const auth = firebaseInitialized ? admin.auth() : null;

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Contest.deleteMany({});
        await Submission.deleteMany({});
        await Payment.deleteMany({});
        console.log('✅ Cleared existing data');

        // Helper function to create Firebase user
        const createFirebaseUser = async (email, password, displayName, photoURL) => {
            if (!auth) {
                console.log(`   ⚠️  Firebase not available, skipping: ${email}`);
                return null;
            }
            
            try {
                // Check if user already exists in Firebase
                try {
                    const existingUser = await auth.getUserByEmail(email);
                    console.log(`   🔄 Firebase user exists, deleting: ${email}`);
                    await auth.deleteUser(existingUser.uid);
                } catch (e) {
                    // User doesn't exist, which is fine
                }
                
                // Create new Firebase user
                const firebaseUser = await auth.createUser({
                    email,
                    password,
                    displayName,
                    photoURL: photoURL || undefined,
                    emailVerified: true,
                });
                console.log(`   ✅ Firebase user created: ${email}`);
                return firebaseUser.uid;
            } catch (error) {
                console.error(`   ❌ Failed to create Firebase user ${email}:`, error.message);
                return null;
            }
        };

        // Create Admin first
        console.log('👑 Creating admin user...');
        const adminFirebaseUid = await createFirebaseUser(
            ADMIN_EMAIL,
            ADMIN_PASSWORD,
            adminUser.name,
            adminUser.photo
        );
        
        const adminData = {
            ...adminUser,
            firebaseUid: adminFirebaseUid,
            contestsWon: 0,
            contestsParticipated: 0,
            points: 0,
            balance: 0,
            totalEarnings: 0,
        };
        const createdAdmin = await User.create(adminData);
        console.log(`✅ Admin created: ${createdAdmin.email}`);

        // Create dummy users and creators
        console.log('👥 Creating users and creators...');
        const createdUsers = [];
        
        for (const userData of dummyUsers) {
            const firebaseUid = await createFirebaseUser(
                userData.email,
                DEFAULT_PASSWORD,
                userData.name,
                userData.photo
            );
            
            // Reset stats - will be calculated from actual contest data
            const user = await User.create({
                ...userData,
                firebaseUid,
                contestsWon: 0,
                contestsParticipated: 0,
                points: 0,
                balance: 0,
                totalEarnings: 0,
            });
            createdUsers.push(user);
        }
        console.log(`✅ Created ${createdUsers.length} users`);

        // Separate users and creators
        const regularUsers = createdUsers.filter(u => u.role === 'user');
        const creators = createdUsers.filter(u => u.role === 'creator');
        console.log(`✅ Found ${creators.length} creators and ${regularUsers.length} regular users`);

        // Get contest data
        const contestsData = getContestsData(creators);

        // Create all contests
        console.log('🏆 Creating contests...');
        const allContests = [];
        
        // Create past contests
        for (const contestData of contestsData.past) {
            const contest = await Contest.create({
                ...contestData,
                creator: creators[contestData.creatorIndex]._id,
                participants: [],
                winners: [],
                prizeDistribution: { first: 50, second: 30, third: 20 },
            });
            allContests.push({ contest, type: 'past' });
        }
        console.log(`   ✅ Created ${contestsData.past.length} past contests`);

        // Create ongoing contests
        for (const contestData of contestsData.ongoing) {
            const contest = await Contest.create({
                ...contestData,
                creator: creators[contestData.creatorIndex]._id,
                participants: [],
                prizeDistribution: { first: 50, second: 30, third: 20 },
            });
            allContests.push({ contest, type: 'ongoing' });
        }
        console.log(`   ✅ Created ${contestsData.ongoing.length} ongoing contests`);

        // Create upcoming contests
        for (const contestData of contestsData.upcoming) {
            const contest = await Contest.create({
                ...contestData,
                creator: creators[contestData.creatorIndex]._id,
                participants: [],
                prizeDistribution: { first: 50, second: 30, third: 20 },
            });
            allContests.push({ contest, type: 'upcoming' });
        }
        console.log(`   ✅ Created ${contestsData.upcoming.length} upcoming contests`);

        // Create pending contests
        for (const contestData of contestsData.pending) {
            const contest = await Contest.create({
                ...contestData,
                creator: creators[contestData.creatorIndex]._id,
                participants: [],
                prizeDistribution: { first: 50, second: 30, third: 20 },
            });
            allContests.push({ contest, type: 'pending' });
        }
        console.log(`   ✅ Created ${contestsData.pending.length} pending contests`);

        // Add participants and submissions to past and ongoing contests
        console.log('📝 Creating participants and submissions...');
        const userStats = {}; // Track each user's stats
        regularUsers.forEach(u => {
            userStats[u._id.toString()] = {
                participated: 0,
                won: 0,
                points: 0,
                balance: 0,
                totalEarnings: 0,
            };
        });

        for (const { contest, type } of allContests) {
            if (type === 'pending') continue; // Skip pending contests

            // Determine number of participants (5-15 for past/ongoing, 0-5 for upcoming)
            const minParticipants = type === 'upcoming' ? 0 : 5;
            const maxParticipants = type === 'upcoming' ? 5 : 15;
            const participantCount = Math.floor(Math.random() * (maxParticipants - minParticipants + 1)) + minParticipants;
            
            // Select random participants
            const participants = getRandomItems(regularUsers, participantCount);
            
            // Update contest with participants
            contest.participants = participants.map(p => p._id);
            contest.participantsCount = participants.length;
            await contest.save();

            // Create submissions for each participant
            for (const participant of participants) {
                const submissionData = {
                    contest: contest._id,
                    participant: participant._id,
                    taskSubmission: `This is my submission for ${contest.name}. I've put a lot of effort into this entry and hope it meets all the requirements. Here's my detailed work showcasing my skills and creativity for this competition.`,
                    isWinner: false,
                    rank: null,
                    prizeAmount: 0,
                };
                
                await Submission.create(submissionData);
                
                // Update user's participation count
                userStats[participant._id.toString()].participated++;
            }

            // For past contests, declare winners
            if (type === 'past' && participants.length >= 3) {
                const prizeMoney = contest.prizeMoney;
                const prizes = [
                    Math.floor(prizeMoney * 0.5),  // 1st: 50%
                    Math.floor(prizeMoney * 0.3),  // 2nd: 30%
                    Math.floor(prizeMoney * 0.2),  // 3rd: 20%
                ];

                // Select top 3 winners
                const winners = getRandomItems(participants, 3);
                const winnersData = [];

                for (let i = 0; i < 3; i++) {
                    const winner = winners[i];
                    const rank = i + 1;
                    const prize = prizes[i];

                    winnersData.push({
                        user: winner._id,
                        rank,
                        prize,
                        paid: true,
                    });

                    // Update the submission with rank and prize
                    await Submission.updateOne(
                        { contest: contest._id, participant: winner._id },
                        { 
                            rank, 
                            prizeAmount: prize,
                            isWinner: true,
                        }
                    );

                    // Update user stats
                    const userId = winner._id.toString();
                    userStats[userId].won++;
                    userStats[userId].points += 100; // 100 points per win
                    userStats[userId].balance += prize;
                    userStats[userId].totalEarnings += prize;

                    // Create payment record
                    await Payment.create({
                        user: winner._id,
                        contest: contest._id,
                        amount: prize,
                        type: 'prize_payout',
                        status: 'succeeded',
                        stripePaymentIntentId: null,
                    });
                }

                // Update contest with winners
                contest.winners = winnersData;
                contest.creatorPaymentStatus = 'paid';
                await contest.save();
            }
        }
        console.log('✅ Created participants and submissions');

        // Update user stats in database
        console.log('📊 Updating user statistics...');
        for (const user of regularUsers) {
            const stats = userStats[user._id.toString()];
            await User.updateOne(
                { _id: user._id },
                {
                    contestsParticipated: stats.participated,
                    contestsWon: stats.won,
                    points: stats.points,
                    balance: stats.balance,
                    totalEarnings: stats.totalEarnings,
                }
            );
        }
        console.log('✅ Updated user statistics');

        // Calculate totals for summary
        const totalContests = allContests.length;
        const submissionCount = await Submission.countDocuments();
        const paymentCount = await Payment.countDocuments();

        // Summary
        console.log('\n========================================');
        console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
        console.log('========================================');
        console.log(`\n📊 Summary:`);
        console.log(`   - Admin: 1 (${ADMIN_EMAIL})`);
        console.log(`   - Users: ${regularUsers.length}`);
        console.log(`   - Creators: ${creators.length}`);
        console.log(`   - Total Contests: ${totalContests}`);
        console.log(`     • Past (completed): ${contestsData.past.length}`);
        console.log(`     • Ongoing: ${contestsData.ongoing.length}`);
        console.log(`     • Upcoming: ${contestsData.upcoming.length}`);
        console.log(`     • Pending: ${contestsData.pending.length}`);
        console.log(`   - Submissions: ${submissionCount}`);
        console.log(`   - Payments: ${paymentCount}`);
        console.log(`\n🔐 LOGIN CREDENTIALS:`);
        console.log(`   Admin:`);
        console.log(`      Email: ${ADMIN_EMAIL}`);
        console.log(`      Password: ${ADMIN_PASSWORD}`);
        console.log(`   \n   All other users:`);
        console.log(`      Password: ${DEFAULT_PASSWORD}`);
        console.log(`\n   Sample user emails:`);
        regularUsers.slice(0, 3).forEach(u => console.log(`      - ${u.email}`));
        console.log(`\n   Creator emails:`);
        creators.forEach(u => console.log(`      - ${u.email}`));
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
}

// Run seed
seedDatabase();
