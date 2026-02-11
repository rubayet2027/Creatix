import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Contest from './models/Contest.js';
import { ADMIN_EMAIL, CONTEST_TYPES } from './utils/constants.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creatix';

// Dummy Users Data
const dummyUsers = [
    // Regular Users
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        photo: 'https://i.pravatar.cc/150?u=john',
        role: 'user',
        bio: 'Creative enthusiast and design lover',
        address: 'New York, USA',
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        photo: 'https://i.pravatar.cc/150?u=sarah',
        role: 'user',
        bio: 'Writer and content creator',
        address: 'Los Angeles, USA',
    },
    {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        photo: 'https://i.pravatar.cc/150?u=mike',
        role: 'user',
        bio: 'Tech enthusiast and gamer',
        address: 'San Francisco, USA',
    },
    {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        photo: 'https://i.pravatar.cc/150?u=emily',
        role: 'user',
        bio: 'Book lover and film critic',
        address: 'Chicago, USA',
    },
    {
        name: 'Alex Turner',
        email: 'alex.t@example.com',
        photo: 'https://i.pravatar.cc/150?u=alex',
        role: 'user',
        bio: 'Marketing specialist',
        address: 'Miami, USA',
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

// Function to create dummy contests
const createDummyContests = (creators) => {
    const now = new Date();
    
    return [
        // Image Design Contests
        {
            name: 'Modern Logo Design Challenge',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
            description: 'Design a modern, minimalist logo for a tech startup. The logo should be versatile and work well on both dark and light backgrounds.',
            price: 15,
            prizeMoney: 500,
            taskInstruction: 'Create a logo that represents innovation and technology. Submit in PNG and SVG formats. Include at least 3 color variations.',
            contestType: 'Image Design',
            deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            creator: creators[0]._id,
            status: 'approved',
            participantsCount: 12,
        },
        {
            name: 'Mobile App UI Design',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
            description: 'Design a beautiful and intuitive UI for a fitness tracking mobile application.',
            price: 25,
            prizeMoney: 1000,
            taskInstruction: 'Design 5 main screens: Home, Workout, Progress, Profile, and Settings. Use modern design trends and ensure good UX.',
            contestType: 'Image Design',
            deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days
            creator: creators[0]._id,
            status: 'approved',
            participantsCount: 8,
        },
        // Article Writing Contests
        {
            name: 'Tech Blog Writing Contest',
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
            description: 'Write an engaging blog post about emerging technologies that will shape the future.',
            price: 10,
            prizeMoney: 300,
            taskInstruction: 'Write a 1500-2000 word article about AI, blockchain, or quantum computing. Include real-world examples and cite sources.',
            contestType: 'Article Writing',
            deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days
            creator: creators[1]._id,
            status: 'approved',
            participantsCount: 25,
        },
        {
            name: 'Travel Story Competition',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
            description: 'Share your most memorable travel experience in a compelling narrative.',
            price: 5,
            prizeMoney: 200,
            taskInstruction: 'Write a 1000-1500 word travel story. Include vivid descriptions and personal insights. Original photos are a plus.',
            contestType: 'Article Writing',
            deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
            creator: creators[1]._id,
            status: 'approved',
            participantsCount: 45,
        },
        // Marketing Strategy Contests
        {
            name: 'Social Media Campaign Strategy',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
            description: 'Develop a comprehensive social media marketing strategy for a new e-commerce brand.',
            price: 20,
            prizeMoney: 750,
            taskInstruction: 'Create a 30-day social media plan including content calendar, hashtag strategy, and engagement tactics for Instagram, Twitter, and TikTok.',
            contestType: 'Marketing Strategy',
            deadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days
            creator: creators[1]._id,
            status: 'approved',
            participantsCount: 15,
        },
        // Gaming Review Contests
        {
            name: 'Best Indie Game Review',
            image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
            description: 'Write an in-depth review of your favorite indie game from the past year.',
            price: 8,
            prizeMoney: 250,
            taskInstruction: 'Review any indie game released in the last 12 months. Include gameplay analysis, graphics, story, and overall recommendation. Min 800 words.',
            contestType: 'Gaming Review',
            deadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days
            creator: creators[2]._id,
            status: 'approved',
            participantsCount: 32,
        },
        {
            name: 'Retro Gaming Championship Review',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
            description: 'Review a classic retro game and explain why it still holds up today.',
            price: 5,
            prizeMoney: 150,
            taskInstruction: 'Choose any game from before 2000. Discuss its historical significance, gameplay mechanics, and why modern gamers should try it.',
            contestType: 'Gaming Review',
            deadline: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days
            creator: creators[2]._id,
            status: 'approved',
            participantsCount: 28,
        },
        // Book Review Contests
        {
            name: 'Fiction Book Review Challenge',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
            description: 'Review a fiction book that changed your perspective on life.',
            price: 5,
            prizeMoney: 200,
            taskInstruction: 'Write a thoughtful review (600-1000 words) of a fiction book. Discuss themes, character development, and personal impact.',
            contestType: 'Book Review',
            deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
            creator: creators[1]._id,
            status: 'approved',
            participantsCount: 18,
        },
        // Business Idea Contests
        {
            name: 'Sustainable Business Pitch',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            description: 'Pitch an innovative business idea that addresses environmental sustainability.',
            price: 30,
            prizeMoney: 1500,
            taskInstruction: 'Submit a business plan including problem statement, solution, target market, revenue model, and environmental impact. Max 3000 words.',
            contestType: 'Business Idea',
            deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
            creator: creators[0]._id,
            status: 'approved',
            participantsCount: 22,
        },
        // Digital Advertisement Contests
        {
            name: 'Creative Ad Banner Design',
            image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800',
            description: 'Design eye-catching digital advertisement banners for a food delivery app.',
            price: 12,
            prizeMoney: 400,
            taskInstruction: 'Create ad banners in 3 sizes: 728x90, 300x250, and 160x600. Focus on appetite appeal and clear call-to-action.',
            contestType: 'Digital Advertisement',
            deadline: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days
            creator: creators[0]._id,
            status: 'approved',
            participantsCount: 19,
        },
        // Movie Review Contests
        {
            name: 'Classic Cinema Review',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
            description: 'Review a classic movie and analyze its impact on modern cinema.',
            price: 5,
            prizeMoney: 175,
            taskInstruction: 'Review a movie made before 1990. Analyze cinematography, storytelling, acting, and cultural influence. 700-1200 words.',
            contestType: 'Movie Review',
            deadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days
            creator: creators[2]._id,
            status: 'approved',
            participantsCount: 35,
        },
        // Pending Contest (for admin to approve)
        {
            name: 'AI Art Generation Challenge',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            description: 'Create stunning artwork using AI tools and your creative vision.',
            price: 20,
            prizeMoney: 800,
            taskInstruction: 'Use any AI art generation tool to create a series of 5 related artworks. Include your prompts and explain your creative process.',
            contestType: 'Image Design',
            deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days
            creator: creators[0]._id,
            status: 'pending',
            participantsCount: 0,
        },
    ];
};

async function seedDatabase() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Contest.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create Admin first
        console.log('👑 Creating admin user...');
        const admin = await User.create(adminUser);
        console.log(`✅ Admin created: ${admin.email}`);

        // Create dummy users and creators
        console.log('👥 Creating users and creators...');
        const createdUsers = await User.insertMany(dummyUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Get creators from created users
        const creators = createdUsers.filter(u => u.role === 'creator');
        console.log(`✅ Found ${creators.length} creators`);

        // Create contests
        console.log('🏆 Creating contests...');
        const contestsData = createDummyContests(creators);
        const createdContests = await Contest.insertMany(contestsData);
        console.log(`✅ Created ${createdContests.length} contests`);

        // Summary
        console.log('\n========================================');
        console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
        console.log('========================================');
        console.log(`\n📊 Summary:`);
        console.log(`   - Admin: 1 (${ADMIN_EMAIL})`);
        console.log(`   - Users: ${createdUsers.filter(u => u.role === 'user').length}`);
        console.log(`   - Creators: ${creators.length}`);
        console.log(`   - Contests: ${createdContests.length}`);
        console.log(`\n🔐 ADMIN CREDENTIALS:`);
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: Admin@123456`);
        console.log(`\n⚠️  Note: You must create the admin account in Firebase with these credentials.`);
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
