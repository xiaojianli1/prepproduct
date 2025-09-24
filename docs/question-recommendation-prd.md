# Product Requirements Document: Question Recommendation System

## Overview
Build an intelligent question recommendation system that analyzes job descriptions and suggests relevant PM interview questions based on keyword matching, helping users practice the most applicable questions for their target roles.

## Problem Statement
Users currently browse through 100+ interview questions manually to find relevant ones for their specific job applications. This is time-consuming and users may miss important question categories that align with their target role.

## Success Metrics
- **User Engagement**: 80% of users who upload job descriptions proceed to practice recommended questions
- **Recommendation Quality**: Users rate recommendations as relevant 70% of the time
- **Coverage**: System provides balanced recommendations (mix of behavioral and technical questions)

## User Experience

### Happy Path
1. User pastes job description into text input field
2. System processes and extracts keywords
3. System displays 3-5 recommended questions
4. User can start practicing with recommended questions

### Input Requirements
- **Format**: Plain text input via existing text box interface
- **Length**: No specific limits, but optimized for typical job descriptions (200-1000 words)
- **Validation**: Basic text cleaning (remove special characters, normalize whitespace)

## Technical Requirements

### Core Algorithm

**Step 1: Keyword Extraction**
- Convert job description to lowercase
- Remove common stop words ("the", "and", "or", etc.)
- Extract keywords by matching against predefined keyword sets in database

**Step 2: Question Scoring**
- Score each question based on keyword matches:
  - **Exact match**: 3 points per keyword
  - **Related terms**: 1 point per keyword
- Apply difficulty level bonus:
  - Match job seniority (intern/associate/mid/senior) with question difficulty
  - +1 point bonus for difficulty level alignment

**Step 3: Smart Selection**
- Sort all questions by score (highest first)
- Apply distribution rules:
  - **Flexible total**: 3-5 questions based on match quality
  - **Minimum**: At least 1 technical question (Product Design, Metrics & Goals, or Root Cause Analysis)
  - **Preferred**: Mix of behavioral and technical questions
  - **Diversity**: Avoid duplicate question types when possible

### Database Schema Updates

**New Column**: `keywords` (text)
- Replace current `skills` column
- Store comma-separated keyword list for each question
- Format: "stakeholder management, prioritization, cross-functional collaboration, roadmap planning"

**Existing Columns Used**:
- `question_type`: For ensuring balanced recommendations
- `difficulty_level`: For difficulty matching

### Keyword Categories by Question Type

**Product Design Keywords**:
- Core: feature design, product design, user experience, app development, prototyping
- Related: mobile apps, user interface, design thinking, user research

**Metrics & Goals Keywords**:
- Core: analytics, KPIs, metrics, A/B testing, data analysis, performance measurement
- Related: growth metrics, user engagement, experimentation, ROI

**Behavioral Keywords**:
- Core: leadership, stakeholder management, prioritization, cross-functional collaboration
- Related: team management, conflict resolution, influence, decision making

**Root Cause Analysis Keywords**:
- Core: root cause analysis, problem solving, troubleshooting, data analysis
- Related: investigation, analytical thinking, performance optimization

## Implementation Phases

### Phase 1: MVP (Core Functionality)
- Basic keyword extraction and matching
- Simple scoring algorithm (exact match = 3pts, related = 1pt)
- Flexible question output (3-5 questions based on matches, minimum 1 technical)
- Integration with existing text input interface

### Phase 2: Enhancements
- Difficulty level matching
- Improved keyword coverage
- Algorithm refinement based on usage patterns

### Phase 3: Optimization
- User feedback collection ("Was this helpful?")
- Algorithm refinement based on usage data
- Advanced text processing for better keyword extraction

## Success Criteria for MVP

**Functional Requirements**:
- ✅ System processes job description text input
- ✅ Returns 4 relevant questions (2 behavioral + 2 technical)
- ✅ Questions ranked by keyword match relevance
- ✅ Response time under 2 seconds

**Quality Requirements**:
- ✅ Recommendations include mix of question types
- ✅ Keywords accurately reflect job requirements
- ✅ No duplicate questions in single recommendation set
- ✅ System handles edge cases (very short descriptions, no matches)

## Technical Considerations

**Performance**:
- Keyword matching should be efficient for 100+ question database
- Consider caching for common job description patterns

**Edge Cases**:
- **No matches**: Return default set of fundamental PM questions
- **Low matches**: Supplement with highest-rated general questions
- **Very generic descriptions**: Bias toward behavioral questions

**Data Quality**:
- Initial keyword population requires manual review
- Plan for iterative keyword refinement based on user feedback

## Future Enhancements (Post-MVP)
- Semantic similarity matching (beyond exact keywords)
- Industry-specific question weighting
- User customization (preferred question types)
- Integration with user practice history
- Machine learning-based recommendation improvements

## Dependencies
- Updated database schema with keywords column
- Keyword population for existing questions
- Basic text processing capabilities
- UI updates for job description input interface

## Timeline
- **Week 1**: Database schema updates, keyword population
- **Week 2**: Core algorithm implementation
- **Week 3**: UI integration, testing
- **Week 4**: Bug fixes, edge case handling, launch

---

*This PRD focuses on delivering a high-quality MVP that solves the core user problem while maintaining simplicity for rapid development and iteration.*