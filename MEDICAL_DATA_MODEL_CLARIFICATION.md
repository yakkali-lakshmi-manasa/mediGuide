# MediGuide Medical Data Model Clarification

## Overview

This document clarifies MediGuide's medical data model, emphasizing that the system uses a **Common Conditions Knowledge Base** for guidance purposes only, NOT a diagnostic database.

---

## 1. Common Conditions Knowledge Base

### 1.1 Purpose

The "Common Conditions Knowledge Base" contains:
- **High-level, non-diagnostic health conditions** such as:
  - Common viral fever
  - Common cold
  - Dehydration
  - Fatigue-related headache
  - Contact dermatitis
  - Gastroenteritis
  - Migraine
  - And other common health conditions

### 1.2 What It Is NOT

❌ **NOT a disease database**
❌ **NOT a diagnostic tool**
❌ **NOT medical advice**
❌ **NOT a replacement for healthcare professionals**

### 1.3 What It IS

✅ **A knowledge base for symptom pattern matching**
✅ **Guidance-level condition suggestions**
✅ **Educational health information**
✅ **Care navigation assistance**

---

## 2. Database Structure

### 2.1 Core Tables

#### `diseases` Table (Common Conditions Knowledge Base)

**Purpose:** Contains common health conditions for pattern matching and guidance.

**Table Comment:**
```
Common Conditions Knowledge Base: Contains high-level, non-diagnostic health 
conditions for symptom pattern matching and guidance-level suggestions only. 
This is NOT a diagnosis database. All outputs should be labeled as 
"possible common conditions (not a diagnosis)".
```

**Columns:**
- `disease_id` - Unique identifier for each common condition entry
- `disease_name` - Name of the common condition (e.g., Common Cold, Viral Fever)
- `description` - High-level description (informational only, not diagnostic)
- `causes` - General information about common causes (educational purposes)
- `risk_factors` - General risk factor information (guidance only)
- `is_chronic` - Indicates if condition is typically chronic (informational flag)
- `is_infectious` - Indicates if condition is typically infectious (informational flag)
- `urgency_level` - Guidance-level urgency indicator (not a medical assessment)
- `requires_image_analysis` - Technical flag for system processing

#### `disease_symptom_mapping` Table

**Purpose:** Symptom pattern matching data for guidance purposes.

**Table Comment:**
```
Symptom pattern matching data: Maps symptoms to common conditions for 
guidance purposes. Used for pattern recognition only, not diagnosis.
```

#### `disease_specialist_mapping` Table

**Purpose:** Specialist guidance mapping.

**Table Comment:**
```
Specialist guidance mapping: Suggests types of healthcare providers for 
common conditions. For navigation guidance only.
```

#### `disease_test_mapping` Table

**Purpose:** Diagnostic test information.

**Table Comment:**
```
Diagnostic test information: General information about tests that healthcare 
providers may consider. Educational purposes only.
```

### 2.2 Separate Hospital Database

#### `hospitals` Table

**Purpose:** Contains factual hospital data (separate from conditions).

**Table Comment:**
```
Hospital information database: Contains factual hospital data including 
location, contact, specialties, and insurance information. This is separate 
from the Common Conditions Knowledge Base and contains verified facility information.
```

**Key Point:** Hospital information is kept in a **separate SQL database** from the Common Conditions Knowledge Base, containing only factual facility data.

---

## 3. Data Usage Guidelines

### 3.1 How Data Is Used

The Common Conditions Knowledge Base is used ONLY for:

1. **Symptom Pattern Matching**
   - Matching user-reported symptoms to known symptom patterns
   - Calculating confidence scores based on pattern similarity
   - Filtering conditions based on symptom categories

2. **Guidance-Level Condition Suggestions**
   - Providing possible common conditions (not diagnoses)
   - Suggesting urgency levels for seeking medical care
   - Recommending types of specialists to consult

3. **Educational Information**
   - General descriptions of common conditions
   - Information about typical causes and risk factors
   - Guidance on when to seek medical attention

4. **Care Navigation**
   - Directing users to appropriate types of healthcare providers
   - Suggesting relevant diagnostic tests (for healthcare providers)
   - Helping users find suitable hospitals

### 3.2 How Data Is NOT Used

❌ **NOT for medical diagnosis**
❌ **NOT for treatment recommendations**
❌ **NOT for medication prescriptions**
❌ **NOT as a substitute for professional medical evaluation**

---

## 4. Output Labeling

### 4.1 Required Labels

All condition outputs MUST be labeled as:

**Primary Label:**
```
"Possible Common Conditions (Not a Diagnosis)"
```

**Alternative Labels:**
- "Guidance-level suggestions based on symptom patterns"
- "Pattern match from Common Conditions Knowledge Base"
- "Possible common conditions for informational purposes only"

### 4.2 Terminology Guidelines

**Use These Terms:**
✅ "Possible common condition"
✅ "Symptom pattern match"
✅ "Guidance-level suggestion"
✅ "Typically chronic/infectious"
✅ "Pattern matching reasoning"
✅ "Guidance urgency level"

**Avoid These Terms:**
❌ "Diagnosis"
❌ "You have [condition]"
❌ "Confirmed condition"
❌ "Medical assessment"
❌ "Treatment plan"

---

## 5. Disclaimers

### 5.1 Primary Disclaimer

**Location:** Displayed on all pages with condition information

**Text:**
```
⚠️ IMPORTANT: This is NOT a diagnostic tool. MediGuide is a health 
information and care navigation tool that uses a Common Conditions 
Knowledge Base for guidance purposes only.

The information provided represents possible common conditions based 
on symptom patterns and should not be considered as medical diagnosis, 
treatment recommendations, or prescriptions.

Always consult qualified healthcare professionals for proper medical 
diagnosis, evaluation, and treatment. The suggestions provided are 
for informational and navigation guidance only.

In case of emergency or severe symptoms, contact emergency services 
immediately (dial 108).
```

### 5.2 Condition-Specific Disclaimers

**Location:** On each condition card

**Text:**
```
Guidance Only: This is a possible common condition based on symptom 
patterns, not a medical diagnosis. Consult a healthcare professional 
for proper evaluation.
```

### 5.3 Detail Page Disclaimers

**Location:** On condition detail pages

**Text:**
```
⚠️ Not a Medical Diagnosis: This information is from our Common 
Conditions Knowledge Base and is provided for educational and 
guidance purposes only.

This does NOT constitute medical advice, diagnosis, or treatment 
recommendations. Always consult qualified healthcare professionals 
for proper medical evaluation, diagnosis, and treatment.
```

---

## 6. Implementation Details

### 6.1 Frontend Components

#### Updated Components:

1. **MedicalDisclaimer.tsx**
   - Enhanced disclaimer text
   - Emphasizes "Common Conditions Knowledge Base"
   - Clarifies guidance-only purpose

2. **DiseaseCard.tsx**
   - Added inline disclaimer alert
   - Changed "Analysis Reasoning" to "Pattern Matching Reasoning"
   - Changed "Chronic Condition" to "Typically Chronic"
   - Changed "View Detailed Information" to "View General Information"

3. **ResultsPage.tsx**
   - Changed title to "Symptom Assessment Results"
   - Changed subtitle to "Guidance-level suggestions based on symptom patterns"
   - Changed section title to "Possible Common Conditions (Not a Diagnosis)"
   - Added prominent disclaimer card above conditions

4. **DiseaseDetailsPage.tsx**
   - Changed subtitle to "General information from Common Conditions Knowledge Base"
   - Enhanced disclaimer with multiple paragraphs
   - Changed "Overview" to "General Overview"
   - Changed "Common Causes" to "General Information About Causes"
   - Changed "Risk Factors" to "General Risk Factor Information"
   - Changed badges to "Typically Chronic/Infectious"

5. **AssessmentPage.tsx**
   - Changed title to "Symptom Assessment for Guidance"
   - Updated description to mention Common Conditions Knowledge Base

6. **HomePage.tsx**
   - Changed subtitle to mention Common Conditions Knowledge Base
   - Added "Guidance-level suggestions • Not a diagnostic tool"
   - Updated card descriptions to use "guidance" terminology

### 6.2 Backend (Edge Function)

#### Updated: `analyze-symptoms/index.ts`

**Changes:**
- Changed reasoning text from "Based on" to "Pattern match based on"
- Changed "This is a chronic condition" to "Typically a chronic condition"
- Changed "This condition is infectious" to "Typically infectious"
- Changed "Fever supports this diagnosis" to "Fever pattern supports this match"
- Changed "Typical urgency level" to "Guidance urgency level"

### 6.3 Database

#### Added Comments:

All database tables now have comprehensive comments clarifying:
- Purpose of the Common Conditions Knowledge Base
- Non-diagnostic nature of the data
- Guidance-only usage
- Separation of hospital data

---

## 7. Example Conditions in Knowledge Base

### 7.1 Common Conditions (Low Urgency)

- **Common Cold**
  - Description: Viral infection of upper respiratory tract
  - Urgency: Low
  - Typically: Infectious

- **Contact Dermatitis**
  - Description: Skin inflammation from contact with allergen
  - Urgency: Low
  - Typically: Non-infectious

- **Dehydration** (if added)
  - Description: Insufficient fluid intake or excessive fluid loss
  - Urgency: Low to Medium
  - Typically: Non-infectious

### 7.2 Moderate Conditions (Medium Urgency)

- **Influenza**
  - Description: Viral infection affecting respiratory system
  - Urgency: Medium
  - Typically: Infectious

- **Gastroenteritis**
  - Description: Inflammation of stomach and intestines
  - Urgency: Medium
  - Typically: Infectious

- **Migraine**
  - Description: Severe recurring headache
  - Urgency: Medium
  - Typically: Chronic, Non-infectious

### 7.3 Serious Conditions (High/Emergency Urgency)

- **Pneumonia**
  - Description: Lung infection causing inflammation
  - Urgency: High
  - Typically: Infectious

- **Acute Myocardial Infarction**
  - Description: Heart attack due to blocked blood flow
  - Urgency: Emergency
  - Typically: Non-infectious

**Note:** Even serious conditions are presented as "possible common conditions" with strong urgency warnings and emergency alerts.

---

## 8. User Journey with Updated Terminology

### 8.1 Assessment Flow

1. **User arrives at homepage**
   - Sees: "Healthcare information and care navigation system using Common Conditions Knowledge Base"
   - Sees: "Guidance-level suggestions • Not a diagnostic tool"
   - Reads: Full medical disclaimer

2. **User starts assessment**
   - Page title: "Symptom Assessment for Guidance"
   - Description: "Provide information about your symptoms to receive guidance-level suggestions from our Common Conditions Knowledge Base. This is not a diagnostic tool."
   - Sees: Medical disclaimer at top

3. **User submits symptoms**
   - System performs symptom pattern matching
   - Calculates confidence scores
   - Generates reasoning based on pattern matches

4. **User views results**
   - Page title: "Symptom Assessment Results"
   - Subtitle: "Guidance-level suggestions based on symptom patterns"
   - Section: "Possible Common Conditions (Not a Diagnosis)"
   - Prominent disclaimer card above all conditions
   - Each condition card has inline disclaimer

5. **User views condition details**
   - Page subtitle: "General information from Common Conditions Knowledge Base"
   - Prominent disclaimer at top
   - All information labeled as "general" or "typical"
   - Button: "View General Information" (not "View Diagnosis")

### 8.2 Key Messaging Throughout

**Consistent Messages:**
- "This is NOT a diagnostic tool"
- "Guidance purposes only"
- "Common Conditions Knowledge Base"
- "Pattern matching"
- "Consult healthcare professionals"
- "For informational purposes"

---

## 9. Compliance and Safety

### 9.1 Medical Compliance

✅ **Clear disclaimers on all pages**
✅ **Non-diagnostic terminology throughout**
✅ **Emphasis on professional consultation**
✅ **Emergency warnings for critical symptoms**
✅ **Separation of guidance from diagnosis**

### 9.2 Ethical Guidelines

✅ **Transparent about limitations**
✅ **Honest about system capabilities**
✅ **User safety prioritized**
✅ **No false medical claims**
✅ **Appropriate urgency detection**

### 9.3 Legal Protection

✅ **Prominent disclaimers**
✅ **Clear non-diagnostic language**
✅ **Educational purpose stated**
✅ **Professional consultation recommended**
✅ **Emergency guidance provided**

---

## 10. Future Considerations

### 10.1 Potential Additions to Knowledge Base

**Appropriate Conditions:**
- Common viral fever
- Seasonal allergies
- Minor injuries (sprains, bruises)
- Common digestive issues
- Sleep-related conditions
- Stress-related symptoms
- Nutritional deficiencies

**Conditions to Avoid:**
- Rare diseases
- Complex chronic diseases requiring specialist diagnosis
- Conditions requiring laboratory confirmation
- Psychiatric conditions requiring professional assessment

### 10.2 Continuous Improvement

- Regular review of condition descriptions
- Update disclaimers based on user feedback
- Enhance pattern matching algorithms
- Improve urgency detection
- Add more educational content

---

## 11. Summary

### 11.1 Key Points

1. **Common Conditions Knowledge Base** - NOT a disease/diagnosis database
2. **Guidance-level suggestions** - NOT medical diagnoses
3. **Symptom pattern matching** - NOT diagnostic analysis
4. **Educational information** - NOT medical advice
5. **Care navigation** - NOT treatment planning

### 11.2 Core Principle

> MediGuide uses a Common Conditions Knowledge Base to provide guidance-level 
> suggestions based on symptom patterns. It is a health information and care 
> navigation tool, NOT a diagnostic system. All users must consult qualified 
> healthcare professionals for proper medical evaluation, diagnosis, and treatment.

---

## 12. Implementation Checklist

### Database ✅
- [x] Added table comments clarifying purpose
- [x] Added column comments for clarity
- [x] Separated hospital data conceptually
- [x] Documented non-diagnostic nature

### Frontend ✅
- [x] Updated all page titles and descriptions
- [x] Enhanced medical disclaimers
- [x] Added inline disclaimers to condition cards
- [x] Changed terminology throughout
- [x] Updated button labels
- [x] Modified badge text

### Backend ✅
- [x] Updated Edge Function reasoning text
- [x] Changed terminology in responses
- [x] Maintained pattern matching logic
- [x] Deployed updated function

### Documentation ✅
- [x] Created comprehensive data model document
- [x] Documented terminology guidelines
- [x] Listed all disclaimers
- [x] Provided implementation details
- [x] Included example conditions

---

**Status:** ✅ Medical Data Model Clarification Complete

**Date:** 2026-02-07

**Version:** 1.0
