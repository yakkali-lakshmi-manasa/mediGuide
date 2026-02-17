# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-9gmytsqjzo5d

# HealthCare Navigator

An AI-powered healthcare assessment and care navigation system designed to help users understand their symptoms, identify possible health conditions, receive specialist recommendations, and find suitable hospitals.

## ⚠️ Important Medical Disclaimer

**This application is a health information and care navigation tool only. It does NOT provide medical diagnosis, treatment, or prescriptions.** The information provided represents possible conditions based on symptoms and should not be considered as medical advice. Always consult qualified healthcare professionals for proper diagnosis and treatment. In case of emergency, contact emergency services immediately.

## 🌟 Features

### 1. Symptom Assessment
- **Structured Symptom Selection**: Choose from a comprehensive list of predefined symptoms
- **Free-text Description**: Describe symptoms in your own words
- **Severity & Duration Tracking**: Record symptom severity (mild/moderate/severe) and duration
- **Image Upload**: Upload images for skin conditions and visible symptoms
- **User Profile**: Optional age, gender, medical history for personalized analysis

### 2. AI-Powered Analysis
- **Symptom-Based Analysis**: ML-powered analysis of symptom combinations
- **Confidence Scoring**: Each possible condition comes with a confidence score
- **Reasoning Explanation**: Clear explanation of why each condition is suggested
- **Red-Flag Detection**: Automatic detection of critical symptoms requiring immediate care

### 3. Disease Information
- **Comprehensive Details**: Description, causes, risk factors for each condition
- **Classification**: Chronic vs acute, infectious vs non-infectious
- **Urgency Levels**: Low, medium, high, or emergency classification

### 4. Specialist Recommendations
- **Appropriate Specialists**: Recommendations based on possible conditions
- **Specialist Descriptions**: Information about each medical specialty
- **Multiple Options**: Support for conditions requiring multiple specialist types

### 5. Hospital Finder
- **Location-Based Search**: Find hospitals by city or pincode
- **Budget Filtering**: Filter by cost range
- **Hospital Type**: Government, private, or both
- **Specialist Availability**: Filter by required specialist departments
- **Insurance Information**: View accepted insurance providers
- **Distance Calculation**: See distance from your location
- **Map Integration**: Direct links to Google Maps

### 6. Emergency Alerts
- **Critical Symptom Detection**: Automatic detection of emergency symptoms
- **Prominent Warnings**: Clear, unmissable emergency alerts
- **Emergency Contact**: Quick access to emergency services

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS with custom healthcare theme
- **Routing**: React Router v6
- **Forms**: React Hook Form with validation
- **State Management**: React Context + Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for medical images
- **Edge Functions**: Deno-based serverless functions for AI analysis
- **Authentication**: Ready for Supabase Auth integration

### Database Schema
- **symptoms**: Comprehensive symptom catalog with red-flag indicators
- **diseases**: Disease information with urgency levels
- **specialists**: Medical specialist types and descriptions
- **hospitals**: Hospital database with location and cost data
- **diagnostic_tests**: Recommended diagnostic tests
- **disease_symptom_mapping**: Symptom-disease relationships with weights
- **disease_specialist_mapping**: Disease-specialist relationships
- **hospital_specialist_mapping**: Hospital specialist availability
- **insurance_providers**: Insurance acceptance by hospital
- **user_assessments**: User assessment history

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (already configured)

### Installation

1. **Install dependencies**:
```bash
npm install
# or
pnpm install
```

2. **Environment variables** (already configured):
```
VITE_SUPABASE_URL=https://gplmolgdmowwxrcdrvve.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]
```

3. **Run development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

## 📱 Application Flow

1. **Home Page**: Introduction, disclaimer, and feature overview
2. **Symptom Assessment**: User inputs symptoms, severity, duration, and optional image
3. **AI Analysis**: Edge function analyzes symptoms and returns possible conditions
4. **Results Page**: Display possible conditions, specialists, tests, and urgency level
5. **Disease Details**: Detailed information about specific conditions
6. **Hospital Finder**: Search and filter hospitals based on needs

## 🎨 Design System

### Color Palette
- **Primary**: Calming blue (#0891B2) - Trust and professionalism
- **Secondary**: Medical green (#16A085) - Health and wellness
- **Accent**: Light blue for highlights
- **Destructive**: Red for emergency alerts
- **Muted**: Neutral grays for backgrounds

### Typography
- Clean, readable fonts
- Clear hierarchy for medical information
- Accessible contrast ratios (WCAG AA compliant)

## 🔒 Safety & Privacy

### Medical Safety
- Prominent disclaimers on all pages
- "Possible condition" instead of "diagnosis"
- "Recommendation" instead of "prescription"
- Emergency red-flag symptom detection
- Clear guidance to seek professional care

### Data Privacy
- Secure storage of health information
- Row-level security policies
- No sharing of personal medical data
- User consent for data collection

### Limitations
- ❌ NO medical diagnosis
- ❌ NO medication prescriptions
- ❌ NO treatment plans
- ✅ Information and guidance only
- ✅ Professional consultation required

## 📊 Sample Data

The application includes sample data for:
- 20 common symptoms (including red-flag symptoms)
- 12 diseases with varying urgency levels
- 10 medical specialists
- 6 hospitals (government and private)
- 9 diagnostic tests
- Insurance provider information

## 🔧 API Endpoints (Edge Functions)

### analyze-symptoms
**POST** `/functions/v1/analyze-symptoms`

Analyzes user symptoms and returns possible conditions with confidence scores.

**Request Body**:
```json
{
  "symptoms": {
    "symptom_ids": ["uuid1", "uuid2"],
    "symptom_description": "Additional details",
    "duration": "3 days",
    "severity": "moderate"
  },
  "userProfile": {
    "age": 30,
    "gender": "male",
    "medical_history": "..."
  },
  "imageUrl": "https://..."
}
```

**Response**:
```json
{
  "possible_conditions": [...],
  "urgency_level": "medium",
  "red_flags": [...],
  "recommended_specialists": [...],
  "recommended_tests": [...],
  "emergency_alert": false
}
```

## 🎯 Use Cases

### Academic Project
- Demonstrates full-stack development skills
- Shows understanding of healthcare domain
- Implements AI/ML concepts
- Database design and optimization
- User experience design

### Hackathon
- Complete working prototype
- Addresses real-world healthcare problem
- Scalable architecture
- Modern tech stack

### Startup MVP
- Production-ready codebase
- Extensible architecture
- User-friendly interface
- Safety-first approach

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DiseaseCard.tsx
│   ├── SpecialistCard.tsx
│   ├── HospitalCard.tsx
│   ├── EmergencyAlert.tsx
│   └── MedicalDisclaimer.tsx
├── pages/              # Application pages
│   ├── HomePage.tsx
│   ├── AssessmentPage.tsx
│   ├── ResultsPage.tsx
│   ├── DiseaseDetailsPage.tsx
│   └── HospitalFinderPage.tsx
├── db/                 # Database layer
│   ├── supabase.ts
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
└── routes.tsx          # Route configuration

supabase/
└── functions/
    └── analyze-symptoms/
        └── index.ts    # AI analysis edge function
```

### Key Technologies
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Supabase**: Backend-as-a-Service
- **React Router**: Client-side routing
- **React Hook Form**: Form management
- **Lucide React**: Icon library

## 📈 Future Enhancements

- [ ] User authentication and profile management
- [ ] Assessment history tracking
- [ ] Multi-language support
- [ ] Telemedicine integration
- [ ] Appointment booking
- [ ] Medication reminders
- [ ] Health tracking dashboard
- [ ] Integration with wearable devices
- [ ] Advanced ML models for better accuracy
- [ ] Real-time chat with healthcare professionals

## 📄 License

This project is created for educational and demonstration purposes.

## 👥 Support

For questions or issues, please refer to the documentation or contact the development team.

---

**Remember**: This is an information tool, not a replacement for professional medical advice. Always consult healthcare professionals for proper diagnosis and treatment.
