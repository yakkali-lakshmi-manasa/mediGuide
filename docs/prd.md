# MediGuide AI - Healthcare Assessment and Care Navigation System Requirements Document

## 1. Application Overview

### 1.1 Application Name
MediGuide AI

### 1.2 Application Description
An AI-powered healthcare application designed to help users understand their symptoms, identify possible health conditions, receive specialist recommendations, and find suitable hospitals in India. This system serves as a care navigation tool and does NOT provide medical diagnosis or prescriptions. The application supports assessment for all types of diseases and health conditions, not limited to dermatology.

### 1.3 Core Purpose
- Help users understand their symptoms and possible conditions
- Guide users to appropriate medical specialists
- Recommend suitable hospitals based on location, budget, insurance, and preferences
- Provide health information and next-step guidance
- Detect urgency levels and provide emergency alerts when necessary

## 2. Functional Requirements

### 2.1 User Input Module

#### 2.1.1 Symptom Input
- Structured symptom selection from predefined list
- Free-text symptom description
- Duration of symptoms (days/weeks/months)
- Severity level (mild/moderate/severe)

#### 2.1.2 User Profile Information
- Age (optional)
- Gender (optional)
- Medical history (optional, free text)
- Current medications (optional)

#### 2.1.3 Location and Preferences
- City or State (India only)
- Budget range for treatment (Low/Medium/High)
- Insurance provider (optional)
- Hospital preference (Government/Private/Trust or Charitable)

#### 2.1.4 Image Upload
- Image upload capability for skin and visible diseases only
- Support common image formats (JPG, PNG)
- Image size validation

### 2.2 Disease Analysis Module

#### 2.2.1 Symptom-Based Analysis
- Process user symptoms using ML and rule-based logic
- Generate top 3-5 possible conditions
- Provide confidence scores for each condition
- Explain reasoning behind each possible condition

#### 2.2.2 Image-Based Analysis (Skin Diseases)
- CNN-based image analysis for skin conditions
- Combine image analysis with symptom data
- Multimodal fusion for enhanced accuracy
- Only applicable for skin and visible diseases

### 2.3 Disease Information Module

For each possible condition, provide:
- Brief description
- Common causes
- Risk factors
- Classification (acute vs chronic)
- Transmission type (infectious vs non-infectious)
- General information about the condition

### 2.4 Next-Step and Urgency Detection

#### 2.4.1 Urgency Classification
- Low urgency: Routine consultation recommended
- Medium urgency: Consultation within few days
- High urgency: Immediate medical attention required

#### 2.4.2 Diagnostic Test Suggestions
- Recommend relevant diagnostic tests
- Explain purpose of each test
- NO medication prescriptions

#### 2.4.3 Emergency Red-Flag Alerts
- Detect critical symptoms requiring immediate care
- Display prominent emergency warnings
- Provide emergency contact information

### 2.5 Specialist Recommendation Module

- Map possible conditions to appropriate medical specialties
- Recommend specialist type only (no individual doctor names)
- Explain why specific specialist is recommended
- Support multiple specialist recommendations if needed

### 2.6 Hospital Recommendation Module

#### 2.6.1 Search Criteria
- Location-based filtering (City/State - India only)
- Budget range matching (Low/Medium/High)
- Hospital type (Government/Private/Trust or Charitable)
- Insurance acceptance (Ayushman Bharat, State Government schemes, Private insurance, Cashless treatment, No insurance/Self-pay)
- Specialist department availability
- Emergency availability (Yes/No)
- Diagnostic facilities available (Yes/No)

#### 2.6.2 Hospital Information Display
- Hospital name
- Type (Government/Private/Trust or Charitable)
- Distance from user location
- Estimated cost range in INR (₹500–₹2,000, ₹2,000–₹10,000, ₹10,000+)
- Contact information (phone, address)
- Available departments
- Insurance providers accepted
- Emergency availability status
- Diagnostic facilities available

## 3. Technical Architecture

### 3.1 Backend Technology
- Python-based backend (FastAPI or Django)
- RESTful API architecture
- JSON data format for API responses

### 3.2 Frontend Technology
- Web application using React or Next.js
- Responsive design for mobile and desktop
- User-friendly interface

### 3.3 Database
- SQL database (PostgreSQL or MySQL)
- Relational database structure

### 3.4 Machine Learning Components
- Symptom analysis model (ML + rule-based)
- CNN-based image classification for skin diseases
- Multimodal fusion layer for combined analysis

## 4. Database Schema

### 4.1 Required Tables

#### users
- user_id (Primary Key)
- age
- gender
- medical_history
- location
- created_at

#### symptoms
- symptom_id (Primary Key)
- symptom_name
- category
- description

#### diseases
- disease_id (Primary Key)
- disease_name
- description
- causes
- risk_factors
- is_chronic
- is_infectious
- urgency_level

#### disease_symptom_mapping
- mapping_id (Primary Key)
- disease_id (Foreign Key)
- symptom_id (Foreign Key)
- weight

#### specialists
- specialist_id (Primary Key)
- specialist_name
- description

#### disease_specialist_mapping
- mapping_id (Primary Key)
- disease_id (Foreign Key)
- specialist_id (Foreign Key)

#### hospitals
- hospital_id (Primary Key)
- hospital_name
- type (Government/Private/Trust or Charitable)
- address
- city
- state
- pincode
- contact_number
- latitude
- longitude
- cost_range (Low/Medium/High)
- cost_range_inr (e.g., ₹500–₹2,000)
- emergency_available (Boolean)
- diagnostic_facilities (Boolean)

#### hospital_specialist_mapping
- mapping_id (Primary Key)
- hospital_id (Foreign Key)
- specialist_id (Foreign Key)

#### insurance_providers
- insurance_id (Primary Key)
- provider_name
- provider_type (Government/Private/Cashless/Self-pay)

#### hospital_insurance_mapping
- mapping_id (Primary Key)
- hospital_id (Foreign Key)
- insurance_id (Foreign Key)

### 4.2 Database Requirements
- Include foreign key constraints
- Add appropriate indexes for performance
- Provide sample INSERT queries for testing

## 5. API Endpoints

### 5.1 User Input APIs
- POST /api/symptoms/submit - Submit symptom data
- POST /api/images/upload - Upload medical images

### 5.2 Analysis APIs
- POST /api/analysis/symptoms - Analyze symptoms
- POST /api/analysis/image - Analyze uploaded image
- POST /api/analysis/combined - Combined multimodal analysis

### 5.3 Information APIs
- GET /api/diseases/{disease_id} - Get disease information
- GET /api/specialists/recommend - Get specialist recommendations
- GET /api/hospitals/search - Search hospitals by criteria

### 5.4 Utility APIs
- GET /api/symptoms/list - Get available symptoms
- GET /api/specialists/list - Get specialist types
- GET /api/insurance/list - Get insurance provider options

## 6. Safety and Ethical Guidelines

### 6.1 Medical Disclaimer
- Display prominent disclaimer on all pages
- Clarify this is NOT a diagnostic tool
- State that results show possible conditions only
- Recommend professional medical consultation

### 6.2 Language and Terminology
- Use possible condition instead of diagnosis
- Use recommendation instead of prescription
- Avoid definitive medical statements

### 6.3 Emergency Handling
- Implement red-flag symptom detection
- Display emergency warnings prominently
- Provide emergency contact numbers
- Suggest immediate medical attention when needed

### 6.4 Data Privacy
- Secure storage of user health information
- No sharing of personal medical data
- Compliance with data protection principles
- User consent for data collection

### 6.5 Limitations
- NO diagnosis provision
- NO medication prescriptions
- NO treatment plans
- NO replacement for professional medical advice
- NO individual doctor recommendations

## 7. Deliverables

### 7.1 Code Components
- Complete backend code (Python)
- Complete frontend code (React/Next.js)
- ML model structure and implementation
- Database schema with SQL scripts
- Sample data for testing

### 7.2 Documentation
- API documentation
- Setup and installation instructions
- README file
- User guide
- Developer documentation

### 7.3 Project Suitability
This application is designed to be suitable for:
- Final-year academic project
- Hackathon demonstration
- Startup MVP (Minimum Viable Product)

## 8. Other Requirements

### 8.1 Medical Disclaimer Text
Display the following disclaimer prominently:

IMPORTANT MEDICAL DISCLAIMER: This application is a health information and care navigation tool only. It does NOT provide medical diagnosis, treatment, or prescriptions. The information provided represents possible conditions based on symptoms and should not be considered as medical advice. Always consult qualified healthcare professionals for proper diagnosis and treatment. In case of emergency, contact emergency services immediately.

### 8.2 Emergency Red-Flag Symptoms
Implement detection for critical symptoms including but not limited to:
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Severe head injury
- Stroke symptoms
- Severe allergic reactions

### 8.3 Image Analysis Scope
Image upload and analysis is strictly limited to:
- Skin conditions and rashes
- Visible wounds or injuries
- External abnormalities
- NOT for internal conditions or X-rays/scans

### 8.4 India-Specific Requirements
- All hospital data must be India-specific (no US or foreign hospitals)
- Currency displayed in INR (₹) only
- Insurance options include Ayushman Bharat and State Government schemes
- Location filters limited to Indian cities and states
- Cost ranges realistic for Indian healthcare system

## 9. Changes Applied

### 9.1 Application Name
- Changed from DermaScan AI to MediGuide AI throughout the application
- Updated to reflect support for all diseases, not limited to dermatology

### 9.2 Currency and Pricing
- Replaced all USD ($) references with INR (₹)
- Updated cost ranges to realistic Indian healthcare pricing
- Added cost_range_inr field in hospitals table

### 9.3 Insurance System
- Added insurance_providers table with provider_type field
- Added hospital_insurance_mapping table for many-to-many relationship
- Included Government schemes (Ayushman Bharat, State schemes)
- Added Private insurance, Cashless treatment, and Self-pay options
- Added Insurance Accepted filter on Find Hospitals page

### 9.4 Hospital Filters
- Added State field to hospitals table
- Extended hospital type to include Trust or Charitable
- Added emergency_available and diagnostic_facilities fields
- Implemented filters for Location, Hospital Type, Budget Range, Emergency Availability, and Diagnostic Facilities

### 9.5 Data Localization
- Removed all non-Indian references
- Ensured all examples and data are India-specific
- Updated location fields to City/State format for India

### 9.6 Database Updates
- Added new tables: insurance_providers, hospital_insurance_mapping
- Extended hospitals table with new fields: state, cost_range_inr, emergency_available, diagnostic_facilities
- Maintained SQL relational database structure with proper foreign keys and normalization