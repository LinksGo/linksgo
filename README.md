# LinksGo - Modern Link Management Platform

<div align="center">
  <img src="1.png" alt="LinksGo Logo" width="200"/>
  <p>Your All-in-One Link Management Platform</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  [Demo](https://linksgo.vercel.app) • [Documentation](https://linksgo.vercel.app/docs) • [Contributing](CONTRIBUTING.md)
</div>

## 🌟 Features

- 🔗 **Smart Link Management**
  - Drag-and-drop link reordering
  - Link analytics and tracking
  - Custom profile links
  - Click statistics

- 👤 **User Profiles**
  - Customizable usernames
  - Profile analytics
  - Custom themes
  - Social media integration

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode
  - Mobile-first approach
  - Smooth animations

- 📊 **Analytics Dashboard**
  - Real-time statistics
  - Click tracking
  - View rates
  - Performance metrics

- 🔒 **Security**
  - Supabase authentication
  - Secure data storage
  - HTTPS enforced
  - Data encryption

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Supabase account
- AWS account (for Amplify deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linksgo.git
   cd linksgo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com/)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/)
- **Deployment**: [AWS Amplify](https://aws.amazon.com/amplify/)

## 📱 Screenshots

<div align="center">
  <img src="sample.png" alt="Dashboard" width="45%"/>
  <img src="linksGoLogo.png" alt="Profile" width="45%"/>
</div>

## 🚀 Deployment

LinksGo is deployed using AWS Amplify:

1. Set up AWS Amplify CLI
2. Configure environment variables in Amplify Console
3. Connect your GitHub repository
4. Deploy with a single click

Detailed deployment instructions are available in [DEPLOYMENT.md](DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details. For all contributions, please use the `contribution` branch.

1. Fork the repository
2. Create your feature branch from `contribution`
3. Commit your changes
4. Push to the branch
5. Open a Pull Request to merge into `contribution`

## 📝 Documentation

- [API Documentation](https://linksgo.vercel.app/docs/api)
- [User Guide](https://linksgo.vercel.app/docs/guide)
- [Development Guide](https://linksgo.vercel.app/docs/development)
- [Deployment Guide](https://linksgo.vercel.app/docs/deployment)

## 🔑 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=your-app-url
NEXT_PUBLIC_APP_DOMAIN=your-app-domain
```

## 📊 Project Structure

```
linksgo/
├── src/
│   ├── app/           # Next.js 14 app directory
│   ├── components/    # React components
│   │   ├── ui/       # Shadcn UI components
│   │   └── ...       # Custom components
│   ├── lib/          # Utility functions
│   └── styles/       # Global styles
├── public/           # Static assets
└── migrations/      # Database migrations
```

## 🧪 Testing

Run the test suite:

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
npm run test:ci     # Run all tests
```

## 📈 Analytics

LinksGo provides essential analytics:

- Link click tracking
- View rates
- Total views
- Active links tracking
- Performance metrics

## 🔒 Security

- Supabase authentication
- HTTPS enforcement
- Secure data storage
- Regular security updates
- Data encryption

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 🎯 Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Custom domain support
- [ ] Team collaboration
- [ ] API access
- [ ] Additional themes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rodolfo Hernández**
- Website: [https://retr0-sec.netlify.app/](https://retr0-sec.netlify.app/)
- GitHub: [@Retr0-XD](https://github.com/Retr0-XD)
- Email: retr0secanddev@gmail.com

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Supabase Team](https://supabase.com/)
- [Open Source Community](https://opensource.org/)

---

<div align="center">
  Made with ❤️ by <a href="github.com/Retr0-XD">Retr0</a>
</div>
