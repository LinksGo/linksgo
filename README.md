# LinksGo - Modern Link Management Platform

<div align="center">
  <img src="1.png" alt="LinksGo Logo" width="200"/>
  <p>Your All-in-One Link Management Platform</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  [Demo](https://linksgo.vercel.app) • [Documentation](https://linksgo.vercel.app/docs) • [Contributing](CONTRIBUTING.md)
</div>

## 🌟 Features

- 🔗 **Smart Link Management**
  - Custom short links
  - QR code generation
  - Link analytics
  - One-time links

- 👤 **User Profiles**
  - Customizable bio pages
  - Social media integration
  - Profile analytics
  - Custom themes

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode
  - Mobile-first approach
  - Smooth animations

- 🚀 **Progressive Web App**
  - Offline support
  - Install on devices
  - Push notifications
  - Fast performance

- 🔒 **Security**
  - OAuth authentication
  - Rate limiting
  - HTTPS enforced
  - Data encryption

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Google OAuth credentials
- AWS account (for deployment)

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

- **Framework**: [Next.js 13](https://nextjs.org/)
- **UI Library**: [NextUI](https://nextui.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [DynamoDB](https://aws.amazon.com/dynamodb/)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Deployment**: [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)

## 📱 Screenshots

<div align="center">
  <img src="public/screenshot-1.png" alt="Dashboard" width="45%"/>
  <img src="public/screenshot-2.png" alt="Profile" width="45%"/>
</div>

## 🚀 Deployment

LinksGo can be deployed to various platforms. We recommend AWS Elastic Beanstalk for production:

1. Set up AWS credentials
2. Configure environment variables
3. Run deployment command:
   ```bash
   npm run deploy:aws
   ```

Detailed deployment instructions are available in [DEPLOYMENT.md](DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Documentation

- [API Documentation](https://linksgo.vercel.app/docs/api)
- [User Guide](https://linksgo.vercel.app/docs/guide)
- [Development Guide](https://linksgo.vercel.app/docs/development)
- [Deployment Guide](https://linksgo.vercel.app/docs/deployment)

## 🔑 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=your-app-url
NEXTAUTH_URL=your-app-url
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

## 📊 Project Structure

```
linksgo/
├── src/
│   ├── app/           # Next.js 13 app directory
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom React hooks
│   └── styles/       # Global styles
├── public/           # Static assets
├── .platform/        # AWS configuration
└── scripts/         # Utility scripts
```

## 🧪 Testing

Run the test suite:

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
npm run test:ci     # Run all tests
```

## 📈 Analytics

LinksGo provides comprehensive analytics:

- Link click tracking
- Visitor demographics
- Device statistics
- Conversion rates
- Custom events

## 🔒 Security

- OAuth 2.0 authentication
- HTTPS enforcement
- Rate limiting
- Data encryption
- Regular security audits
- Compliance with GDPR

## 📱 PWA Features

- Offline support
- Push notifications
- Home screen installation
- Background sync
- Fast performance

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Custom domain support
- [ ] Team collaboration
- [ ] API access
- [ ] Enhanced security features

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
- [NextUI Team](https://nextui.org/)
- [Open Source Community](https://opensource.org/)

---

<div align="center">
  Made with ❤️ by <a href="github.com/Retr0-XD">Retr0</a>
</div>
