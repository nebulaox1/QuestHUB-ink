# Ink QuestHUB

QuestHUB is a premier quest platform built on Inkchain, designed to engage users with the ecosystem through interactive quests, rewards, and seamless Web3 integrations.

## 🚀 Technologies

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3**: [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/)
- **Connect**: [RainbowKit](https://www.rainbowkit.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/questhub.git
   cd questhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` (create if doesn't exist) and fill in your values:
   ```bash
   # Example required variables
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Deploy!

## 📜 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

---

Built with ❤️ for Inkchain.
