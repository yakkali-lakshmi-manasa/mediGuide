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
**User-Driven Symptom Selection:**
- Predefined symptom checklist (common symptoms only)
- Free-text input field: Add other symptoms (optional)
- Users may:
  - Select symptoms only from predefined list
  - Enter symptoms only via free-text
  - Use BOTH together

**Validation Rule:**
- No single symptom field is mandatory by itself
- At least ONE symptom must be provided (either from predefined list OR free-text OR both)
- Form submission is blocked if zero symptoms are provided
- Display validation message: Please provide at least one symptom to continue.

**UI Clarity:**
- Display clear instruction: You can select symptoms, type symptoms, or do both.
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
- Image upload capability is OPTIONAL
- If image is provided: Use it as additional context (especially for skin-related conditions)
- If image is NOT provided: System functions normally using symptoms only
- Support common image formats (JPG, PNG)
- Image size validation
- Applicable for skin and visible diseases only

### 2.2 Disease Analysis Module

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

**Severity-Aware Condition Filtering (CRITICAL):**
- Explicitly incorporate user-reported severity into condition generation
- If severity = Mild:
  - PRIORITIZE common, self-limiting conditions
  - DE-PRIORITIZE or SUPPRESS serious, chronic, or organ-specific diseases unless strongly justified by symptoms
  - Examples:
    - Mild fever + headache + body pain → Allow: Viral Fever, Influenza, Tension Headache; Suppress: Pneumonia, Hypertension, Cardiac conditions

**Symptom-Condition Minimum Match Rule:**
- Each condition must meet a minimum symptom relevance threshold
- A condition should be included ONLY IF:
  - At least one PRIMARY symptom matches, OR
  - Two or more SECONDARY symptoms match
- Examples:
  - Gastroenteritis requires ≥1 GI symptom (vomiting, diarrhea, abdominal pain)
  - Pneumonia requires ≥1 respiratory symptom (cough, breathlessness, chest pain)
  - Hypertension must NOT be suggested unless BP-related symptoms OR user history indicates it

**Fever-Specific Logic:**
- Fever should increase likelihood of:
  - Viral infections
  - Influenza
- Fever should DECREASE likelihood of:
  - Purely chronic conditions (e.g., hypertension, migraine-only cases)

**Confidence Score Adjustment:**
- For mild severity:
  - Cap confidence scores to lower ranges (e.g., ≤60%)
- Do NOT allow high-confidence serious conditions unless severity is Moderate or Severe

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
- Emergency conditions may still appear ONLY IF strong symptom indicators exist
- Do NOT remove emergency alert system

### 2.5 Specialist Recommendation Module

**Specialist Recommendation Control:**
- Map possible conditions to appropriate medical specialties
- Recommend specialist type only (no individual doctor names)
- Explain why specific specialist is recommended
- Support multiple specialist recommendations if needed
- If all suggested conditions are Low Risk + Mild severity:
  - Recommend ONLY General Physician
- Do NOT suggest organ-specific specialists unless matching organ symptoms are present

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
- Severity-aware filtering logic
- Symptom-condition matching threshold system

## 4. Database Schema

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
    symptom_type VARCHAR(50),
    INDEX idx_symptom_name (symptom_name)
);
```

#### user_custom_symptoms
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

#### user_symptom_input
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
    risk_level VARCHAR(20),
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
    symptom_priority VARCHAR(20),
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
INSERT INTO symptoms (symptom_name, category, description, symptom_type) VALUES
('Fever', 'General', 'Elevated body temperature', 'PRIMARY'),
('Headache', 'Neurological', 'Pain in head region', 'PRIMARY'),
('Cough', 'Respiratory', 'Forceful expulsion of air from lungs', 'PRIMARY'),
('Fatigue', 'General', 'Extreme tiredness', 'SECONDARY'),
('Nausea', 'Gastrointestinal', 'Feeling of sickness', 'PRIMARY'),
('Body Pain', 'General', 'Generalized body ache', 'SECONDARY'),
('Vomiting', 'Gastrointestinal', 'Forceful expulsion of stomach contents', 'PRIMARY'),
('Diarrhea', 'Gastrointestinal', 'Loose or watery stools', 'PRIMARY'),
('Breathlessness', 'Respiratory', 'Difficulty breathing', 'PRIMARY'),
('Chest Pain', 'Cardiovascular', 'Pain in chest region', 'PRIMARY');

-- Sample diseases
INSERT INTO diseases (disease_name, description, causes, risk_factors, is_chronic, is_infectious, urgency_level, risk_level) VALUES
('Common Cold', 'Viral infection of upper respiratory tract', 'Rhinovirus', 'Weakened immunity', FALSE, TRUE, 'Low', 'Low'),
('Viral Fever', 'Fever caused by viral infection', 'Various viruses', 'Weakened immunity, seasonal changes', FALSE, TRUE, 'Low', 'Low'),
('Influenza', 'Flu caused by influenza virus', 'Influenza virus', 'Seasonal exposure, weakened immunity', FALSE, TRUE, 'Low', 'Low'),
('Tension Headache', 'Headache caused by muscle tension', 'Stress, poor posture', 'Stress, fatigue', FALSE, FALSE, 'Low', 'Low'),
('Migraine', 'Severe headache disorder', 'Neurological factors', 'Stress, genetics', TRUE, FALSE, 'Medium', 'Medium'),
('Pneumonia', 'Lung infection', 'Bacterial or viral infection', 'Weakened immunity, smoking', FALSE, TRUE, 'High', 'High'),
('Hypertension', 'High blood pressure', 'Multiple factors', 'Age, obesity, family history', TRUE, FALSE, 'Medium', 'Medium'),
('Gastroenteritis', 'Inflammation of stomach and intestines', 'Viral or bacterial infection', 'Contaminated food or water', FALSE, TRUE, 'Medium', 'Medium');

-- Sample disease-symptom mappings
INSERT INTO disease_symptom_mapping (disease_id, symptom_id, weight, symptom_priority) VALUES
(1, 1, 0.8, 'PRIMARY'),
(1, 2, 0.6, 'SECONDARY'),
(1, 3, 0.9, 'PRIMARY'),
(2, 1, 0.9, 'PRIMARY'),
(2, 2, 0.7, 'SECONDARY'),
(2, 6, 0.8, 'SECONDARY'),
(3, 1, 0.9, 'PRIMARY'),
(3, 3, 0.7, 'PRIMARY'),
(3, 4, 0.6, 'SECONDARY'),
(4, 2, 0.9, 'PRIMARY'),
(6, 3, 0.9, 'PRIMARY'),
(6, 9, 0.8, 'PRIMARY'),
(6, 10, 0.7, 'PRIMARY'),
(8, 5, 0.9, 'PRIMARY'),
(8, 7, 0.9, 'PRIMARY'),
(8, 8, 0.9, 'PRIMARY');

-- Sample specialists
INSERT INTO specialists (specialist_name, description) VALUES
('General Physician', 'Primary care doctor'),
('Neurologist', 'Specialist in nervous system disorders'),
('Dermatologist', 'Specialist in skin conditions'),
('Pulmonologist', 'Specialist in respiratory system'),
('Cardiologist', 'Specialist in heart conditions'),
('Gastroenterologist', 'Specialist in digestive system');

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

## 5. API Endpoints

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

## 6. Combined Symptom Processing Logic

### 6.1 Input Processing Flow
1. User submits symptoms via:
   - Predefined symptom selection (checkboxes)
   - Free-text input field
   - Or both

2. Validation:
   - Check if at least one symptom is provided
   - If zero symptoms: Block submission and display Please provide at least one symptom to continue.

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

### 6.3 AI Analysis with Enhanced Decision Logic

#### Step 1: Combine All Symptoms
- Predefined symptoms (from symptoms table)
- Normalized custom symptoms (from user_custom_symptoms table)
- Treat both predefined and custom symptoms with equal weight
- Do NOT prioritize predefined over custom

#### Step 2: Apply Severity-Aware Filtering
**If severity = Mild:**
- PRIORITIZE common, self-limiting conditions
- DE-PRIORITIZE or SUPPRESS serious, chronic, or organ-specific diseases unless strongly justified
- Examples:
  - Mild fever + headache + body pain → Allow: Viral Fever, Influenza, Tension Headache
  - Mild fever + headache + body pain → Suppress: Pneumonia, Hypertension, Cardiac conditions

**If severity = Moderate or Severe:**
- Allow broader range of conditions including serious diseases
- Apply standard matching logic

#### Step 3: Apply Symptom-Condition Minimum Match Rule
For each candidate condition, verify:
- At least one PRIMARY symptom matches, OR
- Two or more SECONDARY symptoms match

**Examples:**
- Gastroenteritis: Requires ≥1 GI symptom (vomiting, diarrhea, abdominal pain)
- Pneumonia: Requires ≥1 respiratory symptom (cough, breathlessness, chest pain)
- Hypertension: Must NOT be suggested unless BP-related symptoms OR user history indicates it

#### Step 4: Apply Fever-Specific Logic
**If fever is present:**
- INCREASE likelihood of:
  - Viral infections
  - Influenza
  - Infectious diseases
- DECREASE likelihood of:
  - Purely chronic conditions (e.g., hypertension, migraine-only cases)

#### Step 5: Confidence Score Adjustment
**For mild severity:**
- Cap confidence scores to lower ranges (e.g., ≤60%)
- Do NOT allow high-confidence serious conditions unless severity is Moderate or Severe

**For moderate/severe severity:**
- Apply standard confidence calculation
- Allow higher confidence scores for serious conditions if symptom match is strong

#### Step 6: Generate Final Output
- Output top 2-3 conditions for mild severity
- Output top 3-5 conditions for moderate/severe severity
- Provide confidence scores for each condition
- Explain reasoning behind each possible condition

#### Step 7: Safety Override
- Emergency conditions may still appear ONLY IF strong symptom indicators exist
- Do NOT remove emergency alert system
- Red-flag symptoms always trigger emergency warnings regardless of severity

### 6.4 Image Integration (Optional)
- If image provided:
  - Run CNN analysis
  - Combine image results with symptom analysis
  - Use multimodal fusion for final output
- If image NOT provided:
  - Proceed with symptom-only analysis
  - No impact on system functionality

### 6.5 Specialist Recommendation Logic
**If all suggested conditions are Low Risk + Mild severity:**
- Recommend ONLY General Physician
- Do NOT suggest organ-specific specialists

**If any condition is Medium/High Risk OR severity is Moderate/Severe:**
- Recommend appropriate organ-specific specialists
- Only suggest specialists when matching organ symptoms are present

### 6.6 Expected Output Behavior Examples

**Example 1: Mild Severity Input**
- Input:
  - Symptoms: headache, body pain, fever
  - Severity: mild
- Expected Output:
  - Narrow condition list (2-3 items)
  - Conditions: Viral Fever, Influenza, Tension Headache
  - Confidence scores: ≤60%
  - Specialist: General Physician only
  - No chronic or unrelated diseases
  - Mild guidance-focused output

**Example 2: Moderate Severity Input**
- Input:
  - Symptoms: cough, breathlessness, chest pain, fever
  - Severity: moderate
- Expected Output:
  - Broader condition list (3-5 items)
  - Conditions: Pneumonia, Bronchitis, Respiratory Infection
  - Confidence scores: Standard range
  - Specialist: Pulmonologist
  - Appropriate serious conditions included

**Example 3: Emergency Symptoms**
- Input:
  - Symptoms: severe chest pain, breathlessness
  - Severity: severe
- Expected Output:
  - Emergency alert displayed
  - High-risk conditions included
  - Immediate medical attention recommended
  - Emergency contact information provided

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
- Emergency conditions may still appear ONLY IF strong symptom indicators exist
- Do NOT remove emergency alert system

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

## 8. UI/UX Requirements

### 8.1 Top Navigation Bar

#### 8.1.1 Navigation Structure
- **Left side:** Application name MediGuide
- **Right side navigation items:**
  - Symptom Check
  - Hospital Finder
  - Disclaimer
  - Theme toggle (Dark / Light mode)

#### 8.1.2 Responsive Behavior
- Desktop: Full horizontal navigation bar with all items visible
- Mobile: Hamburger menu for navigation items
- Smooth transitions between mobile and desktop views

### 8.2 Theme System

#### 8.2.1 Theme Modes
- **Light Mode:** Default light color scheme
- **Dark Mode:** Dark color scheme for reduced eye strain
- **System Preference:** Default theme follows user's system preference

#### 8.2.2 Theme Toggle Functionality
- Manual theme toggle button in navigation bar
- Persist user's theme preference using localStorage
- Smooth transition animations between themes

#### 8.2.3 Theme Application Scope
Apply theme consistently across all UI components:
- Navigation bar
- Forms and input fields
- Cards and containers
- Result sections
- Hospital listings
- Buttons and interactive elements
- Text and typography
- Background colors

#### 8.2.4 Theme-Specific Color Guidelines
- Use CSS variables for color management
- Define separate color palettes for light and dark modes
- Ensure sufficient contrast ratios for accessibility
- **Emergency alerts must remain red in both themes** (critical safety requirement)

#### 8.2.5 Implementation Requirements
- Use CSS custom properties (variables) for theme colors
- Implement smooth transition animations (e.g., 0.3s ease)
- Store theme preference in localStorage with key theme
- Load saved theme preference on application startup
- Detect system preference using prefers-color-scheme media query

### 8.3 Responsive Design
- Mobile-first approach
- Breakpoints for mobile, tablet, and desktop
- Touch-friendly interface elements
- Optimized layouts for different screen sizes

### 8.4 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast in both themes
- Focus indicators for interactive elements

## 9. Deliverables

### 9.1 Code Components
- Complete backend code (Python)
- Complete frontend code (React/Next.js)
- ML model structure and implementation
- NLP symptom normalization module
- Severity-aware filtering logic implementation
- Symptom-condition matching threshold system
- Database schema with SQL scripts
- Sample data for testing
- Theme system implementation (CSS variables, localStorage integration)
- Responsive navigation bar component

### 9.2 Documentation
- API documentation
- Setup and installation instructions
- README file
- User guide
- Developer documentation
- Decision logic explanation document
- Theme system documentation

### 9.3 Project Suitability
This application is designed to be suitable for:
- Final-year academic project
- Hackathon demonstration
- Startup MVP (Minimum Viable Product)

## 10. Other Requirements

### 10.1 Medical Disclaimer Text
Display the following disclaimer prominently:

IMPORTANT MEDICAL DISCLAIMER: This application is a health information and care navigation tool only. It does NOT provide medical diagnosis, treatment, or prescriptions. The information provided represents possible conditions based on symptoms and should not be considered as medical advice. Always consult qualified healthcare professionals for proper diagnosis and treatment. In case of emergency, contact emergency services immediately.

### 10.2 Emergency Red-Flag Symptoms
Implement detection for critical symptoms including but not limited to:
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Severe head injury
- Stroke symptoms
- Severe allergic reactions

### 10.3 Image Analysis Scope
Image upload and analysis is strictly limited to:
- Skin conditions and rashes
- Visible wounds or injuries
- External abnormalities
- NOT for internal conditions or X-rays/scans
- OPTIONAL - system functions without image

### 10.4 India-Specific Requirements
- All hospital data must be India-specific (no US or foreign hospitals)
- Currency displayed in INR (₹) only
- Insurance options include Ayushman Bharat and State Government schemes
- Location filters limited to Indian cities and states
- Cost ranges realistic for Indian healthcare system

## 11. Changes Applied

### 11.1 Enhanced Decision Logic
- Added severity-aware condition filtering
- Implemented symptom-condition minimum match rule
- Added fever-specific logic
- Implemented confidence score adjustment based on severity
- Added specialist recommendation control logic
- Maintained safety override for emergency conditions

### 11.2 Database Schema Updates
- Added symptom_type field to symptoms table (PRIMARY/SECONDARY)
- Added symptom_priority field to disease_symptom_mapping table
- Added risk_level field to diseases table

### 11.3 AI Processing Improvements
- Severity explicitly incorporated into condition generation
- Minimum symptom match threshold enforced
- Fever presence affects condition likelihood
- Confidence scores capped for mild severity
- Specialist recommendations controlled by risk level and severity

### 11.4 Output Behavior
- Narrower condition list for mild severity (2-3 items)
- No chronic or unrelated diseases for mild cases
- General Physician only for low-risk mild cases
- Mild guidance-focused output for mild severity
- Emergency alerts maintained for critical symptoms

### 11.5 UI Enhancements (New)
- Added responsive top navigation bar with app name and navigation items
- Implemented Dark Mode and Light Mode with system preference detection
- Added theme toggle functionality with localStorage persistence
- Applied theme consistently across all UI components
- Maintained red color for emergency alerts in both themes
- Implemented CSS variables for color management
- Added smooth theme transition animations
- Created mobile-responsive navbar with hamburger menu

### 11.6 Before vs After Behavior

**Before:**
- Input: headache, body pain, fever (mild)
- Output: 5 conditions including Hypertension, Pneumonia, Cardiac issues
- Confidence: High scores for serious conditions
- Specialist: Multiple organ-specific specialists

**After:**
- Input: headache, body pain, fever (mild)
- Output: 2-3 conditions - Viral Fever, Influenza, Tension Headache
- Confidence: ≤60% for all conditions
- Specialist: General Physician only
- No chronic or unrelated diseases included