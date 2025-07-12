const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const EntrepreneurProfile = require('./models/EntrepreneueProfile');
const InvestorProfile = require('./models/InvestorProfile');

dotenv.config();
connectDB();

// Sample Entrepreneur Profiles
const sampleEntrepreneurs = [
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Tech enthusiast and AI innovator.',
    startupDescription: 'AI-driven customer support automation.',
    fundingNeed: '$20,000',
    pitchDeck: 'https://pitchdeck.com/ai-startup-1',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Passionate about clean energy solutions.',
    startupDescription: 'Solar-powered smart homes.',
    fundingNeed: '$50,000',
    pitchDeck: 'https://pitchdeck.com/solar-startup',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'EdTech pioneer focused on student success.',
    startupDescription: 'Gamified learning platform for kids.',
    fundingNeed: '$35,000',
    pitchDeck: 'https://pitchdeck.com/edtech-1',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Healthcare visionary.',
    startupDescription: 'Mobile health tracking app.',
    fundingNeed: '$45,000',
    pitchDeck: 'https://pitchdeck.com/health-startup',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Logistics and supply chain disruptor.',
    startupDescription: 'AI in supply chain optimization.',
    fundingNeed: '$70,000',
    pitchDeck: 'https://pitchdeck.com/logistics-ai',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Finance geek building the future of banking.',
    startupDescription: 'Peer-to-peer lending app.',
    fundingNeed: '$60,000',
    pitchDeck: 'https://pitchdeck.com/fintech-lend',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Blockchain developer and crypto enthusiast.',
    startupDescription: 'Secure identity using blockchain.',
    fundingNeed: '$40,000',
    pitchDeck: 'https://pitchdeck.com/block-id',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Fashion tech startup founder.',
    startupDescription: 'Virtual try-on clothing app.',
    fundingNeed: '$30,000',
    pitchDeck: 'https://pitchdeck.com/fashion-tech',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'AI researcher turning ideas into products.',
    startupDescription: 'AI-powered resume screening.',
    fundingNeed: '$25,000',
    pitchDeck: 'https://pitchdeck.com/hr-ai',
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Founder in foodtech space.',
    startupDescription: 'Smart kitchen assistant.',
    fundingNeed: '$55,000',
    pitchDeck: 'https://pitchdeck.com/foodtech',
  },
];

// Sample Investor Profiles
const sampleInvestors = [
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Experienced angel investor in tech startups.',
    investmentInterests: 'AI, SaaS, Fintech',
    portfolioCompanies: ['TechStart', 'SaaSly', 'QuickPay'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Investor in sustainable and green tech.',
    investmentInterests: 'Clean Energy, Sustainability',
    portfolioCompanies: ['GreenHomes', 'EcoDrive'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Former banker now investing in fintech.',
    investmentInterests: 'Fintech, Insurance Tech',
    portfolioCompanies: ['InsurX', 'FinOpt'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Early backer of edtech startups.',
    investmentInterests: 'EdTech, SaaS',
    portfolioCompanies: ['Learnly', 'TeachMate'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Startup mentor and seed funder.',
    investmentInterests: 'HealthTech, AgriTech',
    portfolioCompanies: ['FarmFresh', 'MediTrack'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'CEO turned investor in logistics tech.',
    investmentInterests: 'Logistics, Automation',
    portfolioCompanies: ['ShipEase', 'TrackIQ'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Serial entrepreneur backing AI projects.',
    investmentInterests: 'AI, Robotics',
    portfolioCompanies: ['BotCraft', 'VisionAI'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Investor in healthcare innovation.',
    investmentInterests: 'HealthTech, Pharma',
    portfolioCompanies: ['MediSmart', 'PharmaChain'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Fintech and blockchain enthusiast.',
    investmentInterests: 'Crypto, Blockchain',
    portfolioCompanies: ['BlockFund', 'CoinFast'],
  },
  {
    user: new mongoose.Types.ObjectId(),
    bio: 'Mentor in startup accelerators.',
    investmentInterests: 'EdTech, Mobility',
    portfolioCompanies: ['RideNext', 'StudyFlow'],
  },
];

// Seed Function
async function seedData() {
  try {
    await EntrepreneurProfile.deleteMany();
    await InvestorProfile.deleteMany();

    await EntrepreneurProfile.insertMany(sampleEntrepreneurs);
    await InvestorProfile.insertMany(sampleInvestors);

    console.log('✅ Sample entrepreneur and investor profiles added.');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
