# Medical Data Model - Quick Reference

## What Changed?

MediGuide's medical data has been clarified to emphasize it's a **Common Conditions Knowledge Base** for guidance purposes, NOT a diagnostic database.

---

## Key Terminology Changes

### ❌ OLD (Avoid)
- "Disease database"
- "Diagnosis"
- "Medical analysis"
- "You have [condition]"
- "This is a chronic condition"
- "Detailed information"

### ✅ NEW (Use)
- "Common Conditions Knowledge Base"
- "Possible common condition"
- "Symptom pattern matching"
- "Guidance-level suggestion"
- "Typically chronic/infectious"
- "General information"

---

## Database Structure

### Common Conditions Knowledge Base
**Table:** `diseases`
**Purpose:** Symptom pattern matching and guidance
**NOT:** A diagnostic database

**Contains:**
- Common viral fever
- Common cold
- Dehydration
- Fatigue-related headache
- Contact dermatitis
- Gastroenteritis
- Migraine
- Other common conditions

### Hospital Information (Separate)
**Table:** `hospitals`
**Purpose:** Factual facility data
**Contains:** Location, contact, specialties, insurance

---

## Required Labels

### Primary Label
```
"Possible Common Conditions (Not a Diagnosis)"
```

### Section Headers
- "Symptom Assessment for Guidance"
- "Guidance-level suggestions based on symptom patterns"
- "General information from Common Conditions Knowledge Base"
- "Pattern Matching Reasoning"

---

## Disclaimers

### Main Disclaimer (All Pages)
```
⚠️ This is NOT a diagnostic tool. MediGuide uses a Common 
Conditions Knowledge Base for guidance purposes only.

The information represents possible common conditions based 
on symptom patterns, not medical diagnoses.

Always consult qualified healthcare professionals for proper 
medical evaluation, diagnosis, and treatment.

In case of emergency, contact emergency services (dial 108).
```

### Condition Card Disclaimer
```
Guidance Only: This is a possible common condition based on 
symptom patterns, not a medical diagnosis. Consult a healthcare 
professional for proper evaluation.
```

---

## Updated Components

### Frontend
1. **MedicalDisclaimer.tsx** - Enhanced disclaimer
2. **DiseaseCard.tsx** - Added inline disclaimer, updated terminology
3. **ResultsPage.tsx** - Updated titles, added prominent disclaimer
4. **DiseaseDetailsPage.tsx** - Updated all labels and descriptions
5. **AssessmentPage.tsx** - Updated title and description
6. **HomePage.tsx** - Updated messaging throughout

### Backend
1. **analyze-symptoms/index.ts** - Updated reasoning text terminology

### Database
1. **Migration** - Added comprehensive table and column comments

---

## Usage Guidelines

### ✅ DO Use For:
- Symptom pattern matching
- Guidance-level condition suggestions
- Educational health information
- Care navigation assistance

### ❌ DO NOT Use For:
- Medical diagnosis
- Treatment recommendations
- Medication prescriptions
- Replacing healthcare professionals

---

## Example Conditions

### Low Urgency
- Common Cold (infectious)
- Contact Dermatitis (non-infectious)
- Dehydration (non-infectious)

### Medium Urgency
- Influenza (infectious)
- Gastroenteritis (infectious)
- Migraine (chronic, non-infectious)

### High/Emergency Urgency
- Pneumonia (infectious)
- Acute Myocardial Infarction (emergency)

**Note:** All presented as "possible common conditions" with appropriate urgency warnings.

---

## Implementation Status

| Component | Status | Changes |
|-----------|--------|---------|
| Database Comments | ✅ Complete | Added clarifying comments to all tables |
| MedicalDisclaimer | ✅ Complete | Enhanced with Common Conditions KB language |
| DiseaseCard | ✅ Complete | Added disclaimer, updated terminology |
| ResultsPage | ✅ Complete | Updated titles, added disclaimer card |
| DiseaseDetailsPage | ✅ Complete | Updated all labels and descriptions |
| AssessmentPage | ✅ Complete | Updated title and description |
| HomePage | ✅ Complete | Updated messaging throughout |
| Edge Function | ✅ Complete | Updated reasoning text |
| Documentation | ✅ Complete | Created comprehensive guides |

---

## Key Principles

1. **Transparency:** Always clear about system limitations
2. **Safety:** Emphasize professional consultation
3. **Accuracy:** Use appropriate non-diagnostic terminology
4. **Guidance:** Provide helpful navigation, not diagnosis
5. **Disclaimers:** Present on all relevant pages

---

## Quick Checklist

When adding new content, ensure:

- [ ] Uses "Common Conditions Knowledge Base" terminology
- [ ] Labels outputs as "possible common conditions"
- [ ] Includes appropriate disclaimers
- [ ] Avoids diagnostic language
- [ ] Recommends professional consultation
- [ ] Provides emergency guidance when needed
- [ ] Uses "guidance" not "diagnosis"
- [ ] Uses "typically" not "is"
- [ ] Uses "pattern match" not "analysis"
- [ ] Uses "general information" not "detailed diagnosis"

---

**For Full Details:** See `MEDICAL_DATA_MODEL_CLARIFICATION.md`

**Status:** ✅ Complete and Deployed

**Date:** 2026-02-07
