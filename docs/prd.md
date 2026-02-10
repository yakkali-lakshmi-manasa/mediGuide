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

#### 2.1.1 Symptom Input (UPDATED)
**User-Driven Symptom Selection:**
- Predefined symptom checklist (common symptoms only)
- Free-text input field: \"Add other symptoms (optional)\"
- Users may:
  - Select symptoms only from predefined list
  - Enter symptoms only via free-text
  - Use BOTH together

**Validation Rule:**
- No single symptom field is mandatory by itself
- At least ONE symptom must be provided (either from predefined list OR free-text OR both)
- Form submission is blocked if zero symptoms are provided
- Display validation message: \"Please provide at least one symptom to continue.\"

**UI Clarity:**
- Display clear instruction: \"You can select symptoms, type symptoms, or do both.\"
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

#### 2.1.4 Image Upload (UPDATED)
- Image upload capability is OPTIONAL
- If image is provided: Use it as additional context (especially for skin-related conditions)
- If image is NOT provided: System functions normally using symptoms only
- Support common image formats (JPG, PNG)
- Image size validation
- Applicable for skin and visible diseases only

### 2.2 Disease Analysis Module (UPDATED)

#### 2.2.1 Symptom-Based Analysis
**Combined Symptom Processing:**
- Combine predefined symptoms and user-entered symptoms
- Normalize free-text symptoms (handle typos, synonyms)
- Treat both predefined and custom symptoms with equal importance
- Do NOT prioritize predefined symptoms over custom symptoms
- Process user symptoms using ML and rule-based logic
- Generate top 3-5 possible conditions
- Provide confidence scores for each condition
- Explain reasoning behind each possible condition

#### 2.2.2 Image-Based Analysis (Optional)
- CNN-based image analysis for skin conditions (if image provided)
- Combine image analysis with symptom data
- Multimodal fusion for enhanced accuracy
- Only applicable for skin and visible diseases
- System functions without image if not provided

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
- Free-text symptom normalization (NLP)
- CNN-based image classification for skin diseases (optional)
- Multimodal fusion layer for combined analysis

## 4. Database Schema (UPDATED)

### 4.1 Required Tables

#### users
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    age INT,
    gender VARCHAR(20),
    medical_history TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### symptoms (predefined)
```sql
CREATE TABLE symptoms (
    symptom_id INT PRIMARY KEY AUTO_INCREMENT,
    symptom_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    INDEX idx_symptom_name (symptom_name)
);
```

#### user_custom_symptoms (NEW)
```sql
CREATE TABLE user_custom_symptoms (
    custom_symptom_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    original_text TEXT NOT NULL,
    normalized_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_id (user_id)
);
```

#### user_symptom_input (NEW)
```sql
CREATE TABLE user_symptom_input (
    input_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    symptom_id INT NULL,
    custom_symptom_id INT NULL,
    duration VARCHAR(50),
    severity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id),
    FOREIGN KEY (custom_symptom_id) REFERENCES user_custom_symptoms(custom_symptom_id),
    INDEX idx_user_id (user_id)
);
```

#### diseases
```sql
CREATE TABLE diseases (
    disease_id INT PRIMARY KEY AUTO_INCREMENT,
    disease_name VARCHAR(255) NOT NULL,
    description TEXT,
    causes TEXT,
    risk_factors TEXT,
    is_chronic BOOLEAN,
    is_infectious BOOLEAN,
    urgency_level VARCHAR(20),
    INDEX idx_disease_name (disease_name)
);
```

#### disease_symptom_mapping
```sql
CREATE TABLE disease_symptom_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    disease_id INT,
    symptom_id INT,
    weight DECIMAL(3,2),
    FOREIGN KEY (disease_id) REFERENCES diseases(disease_id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id),
    INDEX idx_disease_id (disease_id),
    INDEX idx_symptom_id (symptom_id)
);
```

#### specialists
```sql
CREATE TABLE specialists (
    specialist_id INT PRIMARY KEY AUTO_INCREMENT,
    specialist_name VARCHAR(255) NOT NULL,
    description TEXT,
    INDEX idx_specialist_name (specialist_name)
);
```

#### disease_specialist_mapping
```sql
CREATE TABLE disease_specialist_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    disease_id INT,
    specialist_id INT,
    FOREIGN KEY (disease_id) REFERENCES diseases(disease_id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(specialist_id),
    INDEX idx_disease_id (disease_id),
    INDEX idx_specialist_id (specialist_id)
);
```

#### hospitals
```sql
CREATE TABLE hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    contact_number VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    cost_range VARCHAR(20),
    cost_range_inr VARCHAR(50),
    emergency_available BOOLEAN,
    diagnostic_facilities BOOLEAN,
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_type (type)
);
```

#### hospital_specialist_mapping
```sql
CREATE TABLE hospital_specialist_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT,
    specialist_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(specialist_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_specialist_id (specialist_id)
);
```

#### insurance_providers
```sql
CREATE TABLE insurance_providers (
    insurance_id INT PRIMARY KEY AUTO_INCREMENT,
    provider_name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50),
    INDEX idx_provider_type (provider_type)
);
```

#### hospital_insurance_mapping
```sql
CREATE TABLE hospital_insurance_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT,
    insurance_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
    FOREIGN KEY (insurance_id) REFERENCES insurance_providers(insurance_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_insurance_id (insurance_id)
);
```

### 4.2 Sample INSERT Queries

```sql
-- Sample predefined symptoms
INSERT INTO symptoms (symptom_name, category, description) VALUES
('Fever', 'General', 'Elevated body temperature'),
('Headache', 'Neurological', 'Pain in head region'),
('Cough', 'Respiratory', 'Forceful expulsion of air from lungs'),
('Fatigue', 'General', 'Extreme tiredness'),
('Nausea', 'Gastrointestinal', 'Feeling of sickness');

-- Sample diseases
INSERT INTO diseases (disease_name, description, causes, risk_factors, is_chronic, is_infectious, urgency_level) VALUES
('Common Cold', 'Viral infection of upper respiratory tract', 'Rhinovirus', 'Weakened immunity', FALSE, TRUE, 'Low'),
('Migraine', 'Severe headache disorder', 'Neurological factors', 'Stress, genetics', TRUE, FALSE, 'Medium');

-- Sample specialists
INSERT INTO specialists (specialist_name, description) VALUES
('General Physician', 'Primary care doctor'),
('Neurologist', 'Specialist in nervous system disorders'),
('Dermatologist', 'Specialist in skin conditions');

-- Sample hospitals
INSERT INTO hospitals (hospital_name, type, address, city, state, pincode, contact_number, cost_range, cost_range_inr, emergency_available, diagnostic_facilities) VALUES
('Apollo Hospital', 'Private', 'MG Road', 'Bangalore', 'Karnataka', '560001', '080-12345678', 'High', '₹10,000+', TRUE, TRUE),
('Government General Hospital', 'Government', 'Park Street', 'Chennai', 'Tamil Nadu', '600002', '044-87654321', 'Low', '₹500–₹2,000', TRUE, TRUE);

-- Sample insurance providers
INSERT INTO insurance_providers (provider_name, provider_type) VALUES
('Ayushman Bharat', 'Government'),
('State Government Scheme', 'Government'),
('ICICI Lombard', 'Private'),
('Cashless Treatment', 'Cashless'),
('Self-pay', 'Self-pay');
```

## 5. API Endpoints (UPDATED)

### 5.1 User Input APIs
- POST /api/symptoms/submit - Submit combined symptom data (predefined + custom)
- POST /api/images/upload - Upload medical images (optional)

### 5.2 Analysis APIs
- POST /api/analysis/symptoms - Analyze combined symptoms (predefined + normalized custom)
- POST /api/analysis/image - Analyze uploaded image (optional)
- POST /api/analysis/combined - Combined multimodal analysis (symptoms + image if provided)

### 5.3 Information APIs
- GET /api/diseases/{disease_id} - Get disease information
- GET /api/specialists/recommend - Get specialist recommendations
- GET /api/hospitals/search - Search hospitals by criteria

### 5.4 Utility APIs
- GET /api/symptoms/list - Get predefined symptoms
- GET /api/specialists/list - Get specialist types
- GET /api/insurance/list - Get insurance provider options

## 6. Combined Symptom Processing Logic (NEW)

### 6.1 Input Processing Flow
1. User submits symptoms via:
   - Predefined symptom selection (checkboxes)
   - Free-text input field
   - Or both

2. Validation:
   - Check if at least one symptom is provided
   - If zero symptoms: Block submission and display \"Please provide at least one symptom to continue.\"

3. Storage:
   - Store predefined symptoms in user_symptom_input table (linked to symptoms table)
   - Store custom symptoms in user_custom_symptoms table
   - Link both to user_symptom_input table

### 6.2 Normalization Process
1. Free-text symptoms undergo NLP processing:
   - Spell correction
   - Synonym mapping
   - Medical term standardization
   - Store normalized_text in user_custom_symptoms table

2. Mapping to predefined symptoms:
   - Match normalized custom symptoms to existing symptoms table
   - If match found: Link to symptom_id
   - If no match: Keep as custom symptom

### 6.3 AI Analysis
1. Combine all symptoms:
   - Predefined symptoms (from symptoms table)
   - Normalized custom symptoms (from user_custom_symptoms table)

2. Equal importance:
   - Treat both predefined and custom symptoms with equal weight
   - Do NOT prioritize predefined over custom

3. Disease matching:
   - Use disease_symptom_mapping for predefined symptoms
   - Use ML model for custom symptoms
   - Combine scores to generate top 3-5 possible conditions

4. Confidence scoring:
   - Calculate confidence based on symptom match percentage
   - Consider severity and duration
   - Adjust for custom symptom uncertainty

### 6.4 Image Integration (Optional)
- If image provided:
  - Run CNN analysis
  - Combine image results with symptom analysis
  - Use multimodal fusion for final output
- If image NOT provided:
  - Proceed with symptom-only analysis
  - No impact on system functionality

## 7. Safety and Ethical Guidelines

### 7.1 Medical Disclaimer
- Display prominent disclaimer on all pages
- Clarify this is NOT a diagnostic tool
- State that results show possible conditions only
- Recommend professional medical consultation

### 7.2 Language and Terminology
- Use possible condition instead of diagnosis
- Use recommendation instead of prescription
- Avoid definitive medical statements

### 7.3 Emergency Handling
- Implement red-flag symptom detection
- Display emergency warnings prominently
- Provide emergency contact numbers
- Suggest immediate medical attention when needed

### 7.4 Data Privacy
- Secure storage of user health information
- No sharing of personal medical data
- Compliance with data protection principles
- User consent for data collection

### 7.5 Limitations
- NO diagnosis provision
- NO medication prescriptions
- NO treatment plans
- NO replacement for professional medical advice
- NO individual doctor recommendations

## 8. Deliverables

### 8.1 Code Components
- Complete backend code (Python)
- Complete frontend code (React/Next.js)
- ML model structure and implementation
- NLP symptom normalization module
- Database schema with SQL scripts
- Sample data for testing

### 8.2 Documentation
- API documentation
- Setup and installation instructions
- README file
- User guide
- Developer documentation

### 8.3 Project Suitability
This application is designed to be suitable for:
- Final-year academic project
- Hackathon demonstration
- Startup MVP (Minimum Viable Product)

## 9. Other Requirements

### 9.1 Medical Disclaimer Text
Display the following disclaimer prominently:

IMPORTANT MEDICAL DISCLAIMER: This application is a health information and care navigation tool only. It does NOT provide medical diagnosis, treatment, or prescriptions. The information provided represents possible conditions based on symptoms and should not be considered as medical advice. Always consult qualified healthcare professionals for proper diagnosis and treatment. In case of emergency, contact emergency services immediately.

### 9.2 Emergency Red-Flag Symptoms
Implement detection for critical symptoms including but not limited to:
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Severe head injury
- Stroke symptoms
- Severe allergic reactions

### 9.3 Image Analysis Scope
Image upload and analysis is strictly limited to:
- Skin conditions and rashes
- Visible wounds or injuries
- External abnormalities
- NOT for internal conditions or X-rays/scans
- OPTIONAL - system functions without image

### 9.4 India-Specific Requirements
- All hospital data must be India-specific (no US or foreign hospitals)
- Currency displayed in INR (₹) only
- Insurance options include Ayushman Bharat and State Government schemes
- Location filters limited to Indian cities and states
- Cost ranges realistic for Indian healthcare system

## 10. Changes Applied

### 10.1 Symptom Input Logic
- Removed predefined or forced disease/module selection
- System is now fully USER-DRIVEN
- No skin-first or predefined filters

### 10.2 Symptom Selection Design
- Predefined symptom checklist provided (common symptoms only)
- Free-text input field added: \"Add other symptoms (optional)\"
- Users can select from predefined list, enter free-text, or use both

### 10.3 Validation Rule
- No single symptom field is mandatory
- At least ONE symptom must be provided (predefined OR free-text OR both)
- Form submission blocked if zero symptoms provided
- Validation message: \"Please provide at least one symptom to continue.\"

### 10.4 AI Processing
- Combines predefined and user-entered symptoms
- Normalizes free-text symptoms (typos, synonyms)
- Treats both inputs with equal importance
- Does NOT prioritize predefined over custom symptoms

### 10.5 Image Upload Handling
- Image upload is OPTIONAL
- If provided: Used as additional context (especially for skin conditions)
- If NOT provided: System functions normally using symptoms only

### 10.6 Database Updates
- Added user_custom_symptoms table for storing custom symptom text
- Added user_symptom_input table for linking predefined and custom symptoms
- Maintains SQL relational structure with proper foreign keys
- Stores original_text and normalized_text separately

### 10.7 UI & UX Clarity
- Clear instruction displayed: \"You can select symptoms, type symptoms, or do both.\"
- Validation message shown when no symptoms provided
- Optional image upload clearly indicated

### 10.8 Output Logic
- Generates possible conditions with confidence levels
- Provides severity classification and emergency alerts
- Suggests diagnostic tests and next steps
- Maintains medical disclaimer
- Does NOT provide diagnosis, treatment, or doctor recommendation