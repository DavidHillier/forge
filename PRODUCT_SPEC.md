# Forge — Product Requirements Document
**Version:** 1.0  
**Date:** 24 April 2026  
**Author:** David Hillier  
**Status:** Draft

---

## 1. Product Vision

Forge is a structured, premium fitness app built around a single, compelling promise: **a 6-week fat-loss system that actually finishes**. It is not an infinite library of workouts. It is a guided programme — like having a personal trainer in your pocket who knows exactly what you did yesterday and what you need today.

The app takes direct inspiration from the Men's Fitness *6-Week Fat-Loss Plan* methodology: circuit-based, dumbbell-only, progressively harder each week, and structured around full-body sessions that elevate heart rate and build muscle simultaneously.

---

## 2. Design Language

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--forest` | `#1B3D2F` | Primary background, nav bar, headers |
| `--forest-deep` | `#112A20` | Elevated surfaces, cards on dark BG |
| `--forest-mid` | `#2A5240` | Borders, dividers, inactive elements |
| `--gold` | `#C9A84C` | Primary CTA, active states, progress ring, timers |
| `--gold-light` | `#E2C068` | Hover/pressed states on gold |
| `--cream` | `#F5EDD8` | Primary text on dark backgrounds |
| `--cream-muted` | `#B8AC96` | Secondary text, labels |
| `--white` | `#FFFFFF` | Text on gold buttons |
| `--system-green` | `#4CAF50` | Completed states, success ticks |
| `--system-red` | `#E05A4E` | Errors, warnings |

> The palette is identical to the St Aloysius College identity — deep forest green + gold — but the branding, tone, and visual language are entirely Forge's own. No crests, no academic references, no institutional feel.

### Typography
- **Display / Headers:** Serif (e.g. Playfair Display or similar editorial serif) — used for week names, workout titles, hero numbers (timers)
- **Body / UI:** Sans-serif (e.g. Inter or system-ui) — labels, metadata, form fields
- **Timers / Numbers:** Monospaced or tabular figures for countdown clocks

### Visual Style
- Dark-first: deep forest green backgrounds throughout, not white-on-green
- Gold is used sparingly and purposefully — CTAs, active progress, key numbers
- Photography/illustration: athletic male figures in workout context, desaturated to integrate with the dark palette
- Rounded cards (12–16px radius), subtle inner glow on active states
- Icons: stroke-based (Lucide React), consistent weight

---

## 3. Problem Statement

Most fitness apps overwhelm users with infinite content and no structure. Users start, lose the thread, and quit by week two — not because they lack motivation, but because the app never told them *what to do next* with confidence. Existing structured programmes (e.g. C25K, Stronglifts) succeed precisely because they remove decision fatigue. Forge applies this principle to fat-loss training for men aged 25–45 who want a defined start and end point, equipment-minimal workouts, and a sense of daily forward momentum.

**The cost of not solving this:** Users continue bouncing between gym apps, YouTube videos, and Reddit programmes, achieving inconsistent results and attributing failure to themselves rather than the product.

---

## 4. Target Users

### Primary Persona: "The Restarter"
- Male, 28–45
- Has trained before but is currently inconsistent
- Has dumbbells at home or access to a basic gym
- Motivated by aesthetics and energy, not athletic performance
- Wants to be *told what to do* rather than choose
- Time-poor: workouts must fit within 20–45 minutes

### Secondary Persona: "The Completer"
- Has used fitness apps before and found them shallow
- Values progression and structure
- Wants to finish something — the 6-week arc matters
- Likely to repeat the programme or upgrade to future programmes

---

## 5. The Programme Structure

### 6-Week Fat-Loss System

The programme is built on **four circuit workouts per week** using **dumbbells only**. Each week has a named theme. Every workout in the week advances a singular weekly objective.

| Week | Theme | Objective |
|---|---|---|
| 1 | **Foundation** | Establish movement patterns, baseline conditioning |
| 2 | **Build** | Increase training density, improve work capacity |
| 3 | **Push** | Raise intensity, introduce superset pairings |
| 4 | **Adapt** | Active recovery week, mobility focus, reset |
| 5 | **Peak** | Maximum intensity, compound circuits |
| 6 | **Finish** | Final push, consolidate gains, test limits |

### Weekly Workout Types (per week, 7 slots)
Each week contains 7 daily slots. Not all are hard sessions:

| Slot Type | Count per Week | Description |
|---|---|---|
| Full-Body HIIT | 2 | Primary fat-burning circuit, 4 rounds |
| Zone 2 Cardio | 1 | Low-intensity steady state, 20–40 min |
| Metabolic Strength | 1 | Heavier compound work, lower reps |
| Recovery / Mobility | 1 | Stretching, activation, light movement |
| Lower-Body HIIT | 1 | Leg-focused circuit, glutes/quads/hamstrings |
| Optional Walk | 1 | NEAT bonus — 30+ min walk |

> One additional slot is reserved as a **Recovery Check** — a weekly reflection and optional rest day.

### Workout Architecture

Each workout is divided into **four blocks**:

| Block | Duration | Description |
|---|---|---|
| Warm-Up | 4 min | Mobility and activation |
| Main Circuit | 15 min | 4 rounds × 40s work / 20s rest |
| Finisher | 3 min | Push your limits — max effort |
| Cool-Down | 3 min | Stretch and recover |

### Sample Main Circuit Exercises
- Dumbbell Thrusters
- Mountain Climbers
- Dumbbell Romanian Deadlifts
- Push-Up to Renegade Row
- Goblet Squat
- Dumbbell Lateral Raises
- Burpee to Dumbbell Clean

### Progression Model
Each week increases in difficulty via one of:
- More rounds (3 → 4 → 5)
- Shorter rest (30s → 20s → 15s)
- Heavier suggested weight guidance
- Additional exercises per circuit

---

## 6. Goals

### User Goals
1. **Complete the 6-week programme** — ≥70% of users who start Week 1 complete Week 6
2. **Show up daily** — Average streak of 4+ days per week across active users
3. **Feel capable during workouts** — ≥80% of active workouts rated effort 3/5 or higher
4. **See measurable progress** — Users who log body metrics see measurable change by Week 4

### Business Goals
5. **High activation rate** — ≥60% of signups complete their first workout within 48 hours
6. **Programme completion as north star** — Programme completion rate is the primary retention metric
7. **Word-of-mouth referrals** — The "I finished it" moment is the primary acquisition driver

---

## 7. Non-Goals (V1)

| Non-Goal | Rationale |
|---|---|
| Multiple programmes running simultaneously | One programme, one user focus. Complexity with no V1 payoff. |
| Social features (leaderboards, friends, sharing) | Premature; distract from the solo completion arc |
| Video exercise demonstrations | Cost and scope; form cues (text + illustration) cover V1 |
| Custom workout builder | Contradicts the "be told what to do" value prop |
| Nutrition / meal plans | Out of scope — focus is training excellence first |
| Apple Watch / wearable real-time sync | V2 — health data import via Apple Health is sufficient for V1 |
| Push notifications (beyond opt-in reminders) | Requires native app; V1 is web-first |
| Paid subscription / paywall | V1 is free to validate completion rates before monetisation |

---

## 8. User Stories

### Onboarding
- As a new user, I want to create an account quickly and set my programme start date so that I know exactly when Week 1 Day 1 begins.
- As a new user, I want to see the full 6-week programme structure before I begin so that I understand what I'm committing to.
- As a new user, I want to give consent to data collection clearly and simply so that I trust the app with my health data.

### Today Screen
- As a returning user, I want to see today's scheduled workout immediately on opening the app so that I don't have to navigate to find it.
- As a user who is ahead or behind schedule, I want to swap today's workout for another from the week so that I can work around life without breaking the programme.
- As a user who has completed today's session, I want to see my progress ring update and the next session previewed so that I feel momentum.

### Pre-Workout Readiness Check
- As a user about to train, I want to quickly log how I feel (sleep, soreness, energy, time available) so that the app can recommend whether to proceed as planned or modify the session.
- As a tired user, I want the app to suggest a lighter session rather than the scheduled hard workout so that I can still show up without risking injury.
- As a time-constrained user, I want the app to know I only have 20 minutes and adapt accordingly so that I do something rather than nothing.

### Active Workout
- As a user mid-workout, I want a large, clear countdown timer showing work and rest periods so that I don't need to think — just move.
- As a user on a work interval, I want to see the current exercise name and round number prominently so that I always know where I am in the session.
- As a user unsure of form, I want to tap a "Form Cue" button and see key coaching points so that I can self-correct without stopping the clock.
- As a user who needs to pause, I want to pause the workout and resume without losing my place so that interruptions don't ruin the session.
- As a user finishing a round, I want to see a rest timer with the upcoming exercise previewed so that I can mentally prepare.

### Workout Completion
- As a user who just finished a workout, I want to log my perceived effort (1–5) so that the app tracks my training load over time.
- As a user who just finished, I want to see a clear completion summary (time, rounds, calories est.) so that I feel accomplished.
- As a user who just finished, I want the next session in the programme to be surfaced immediately so that I stay engaged.

### Progress
- As a user 3+ weeks in, I want to see a visual overview of my completion rate and streak so that I can see how far I've come.
- As a user tracking body metrics, I want to log weight, waist measurement, and resting heart rate weekly so that I can see physical change alongside training data.
- As a user who wants to understand trends, I want to see an intensity trend chart (average effort over time) so that I can validate I'm progressing.

### Weekly Reflection
- As a user completing a week, I want to answer 4–5 quick questions about my energy, sleep, soreness, and motivation so that the app has a full picture of my recovery.
- As a user writing a reflection note, I want a free-text field to capture what felt different this week so that I can look back on my journey.

### Settings
- As a user who prefers metric units, I want to set kg/cm globally so that all measurements display in my preferred system.
- As a user who wants reminders, I want to enable daily workout reminders at a chosen time so that training becomes a habit.
- As a user who wants privacy, I want to request a full data export or account deletion so that I remain in control of my data.

---

## 9. Requirements

### P0 — Must Have (V1 cannot ship without these)

#### Programme & Content
- [ ] Full 6-week programme seeded with all 42 workout days
- [ ] Each workout contains all four blocks (warm-up, main circuit, finisher, cool-down)
- [ ] Each exercise has work duration, rest duration, rounds, and form cues
- [ ] Programme progression is locked — users cannot skip weeks
- [ ] Workout swap within the current week is allowed (≤2 swaps per week)

#### Today Screen
- [ ] Displays current week, day, and scheduled workout on load
- [ ] Shows programme progress ring (% complete) and days remaining
- [ ] Primary CTA: START WORKOUT → navigates to readiness check
- [ ] Secondary actions: Preview Session, Swap Workout, Log Recovery

#### Readiness Check
- [ ] Four fields: Sleep Quality (Poor/OK/Good), Soreness (Low/Med/High), Energy (Low/Med/High), Time Available (10/20/30+ min)
- [ ] Recommendation engine outputs one of: "Proceed as planned", "Scale back intensity", "Recovery session recommended"
- [ ] Recommendation is advisory — user can override and continue

#### Active Workout
- [ ] Full-screen countdown timer with work/rest state clearly distinguished (colour + label)
- [ ] Current exercise name, round number, and total rounds displayed
- [ ] Form Cue modal accessible during any work interval
- [ ] Pause/resume without losing state
- [ ] Rest screen previews next exercise with upcoming duration
- [ ] Auto-advances through all blocks end-to-end

#### Workout Completion
- [ ] Summary card: total time, rounds completed, estimated calories
- [ ] Effort rating (1–5 scale) — required before completion is saved
- [ ] WorkoutCompletion record written to database
- [ ] Training load calculated (LOW/MEDIUM/HIGH) from effort + intensity

#### Progress
- [ ] Overview: total sessions complete, days remaining, current streak, this-week sessions
- [ ] Intensity trend chart (average effort per week, line chart)
- [ ] Body metrics log: weight, waist, resting HR with date
- [ ] Progress Detail screen accessible from overview

#### Authentication & Data
- [ ] Email + password signup with consent capture (privacy policy + terms)
- [ ] Programme start date set at signup
- [ ] JWT session with secure cookie
- [ ] All user data deleted on account deletion (cascading)
- [ ] GDPR data export request flow

#### Settings
- [ ] Edit display name
- [ ] Toggle units (metric/imperial)
- [ ] Change programme start date (resets progress — with confirmation warning)
- [ ] Health Integration toggle (Apple Health — data import only)
- [ ] Log out

---

### P1 — Should Have (high priority post-launch)

- [ ] **Weekly Reflection flow** — 4 emoji-scale questions + free text note, presented at end of each week
- [ ] **Form Cue illustrations** — athlete silhouette images per exercise (currently text-only cues)
- [ ] **Readiness-adapted workouts** — when readiness check recommends scaling, the active workout automatically adjusts round count or rest periods
- [ ] **Programme restart** — allow user to restart from Week 1 after completing Week 6
- [ ] **Workout notes field** — free text on completion screen
- [ ] **Progress photos** — capture and store before/after images linked to body metrics entries
- [ ] **Completion certificate / share card** — shareable image on Week 6 completion ("I finished Forge")
- [ ] **Dark/light mode support** — currently dark-only; light mode for outdoor use

---

### P2 — Future Considerations (V2+)

- [ ] **Second programme** — different training goal (e.g. strength, mobility) using same architecture
- [ ] **Coach messaging** — async text-based coaching layer
- [ ] **Apple Watch companion** — real-time heart rate + haptic cues during work/rest
- [ ] **Wearable-driven readiness** — auto-populate readiness check from HRV / sleep data
- [ ] **Subscription paywall** — Forge Free (Week 1 only) → Forge Pro (full programme)
- [ ] **Team / challenge mode** — shared completion tracking for groups
- [ ] **AI programme adaptation** — dynamically adjust future weeks based on logged performance data

---

## 10. Screen Inventory

| Screen | Route | Description |
|---|---|---|
| Today | `/app/today` | Home screen — today's workout, progress summary, quick-start |
| Programme Overview | `/app/programme` | 6-week timeline, week themes, completion dots |
| Week Detail | `/app/programme/week/[n]` | All 7 workouts in the week, completion state |
| Readiness Check | `/app/workout/[id]/readiness` | Pre-workout assessment form |
| Workout Preview | `/app/workout/[id]/preview` | Workout summary before starting (blocks, equipment, duration) |
| Active Workout | `/app/workout/[id]/active` | Full-screen timer interface |
| Form Cue | Modal (within active) | Exercise technique tips, accessible mid-workout |
| Rest Screen | State (within active) | Rest countdown + next exercise preview |
| Workout Complete | `/app/workout/[id]/complete` | Post-workout summary and effort log |
| Progress Overview | `/app/progress` | High-level stats and trend charts |
| Progress Details | `/app/progress/details` | Body metrics log, intensity trends |
| Weekly Reflection | `/app/progress/reflection` | End-of-week check-in form |
| Settings | `/app/settings` | Profile, preferences, integrations, support |
| Login | `/login` | Email + password authentication |
| Signup | `/signup` | Registration, consent, programme start date |

---

## 11. Success Metrics

### Leading Indicators (Days 1–14 post-launch)
| Metric | Target |
|---|---|
| Signup → First Workout completion rate | ≥ 60% within 48 hours |
| Average sessions per active user per week | ≥ 3.5 |
| Readiness Check completion rate | ≥ 90% (should feel frictionless) |
| Workout abandonment rate (started but not completed) | ≤ 15% |
| Effort logged on completion | ≥ 95% (required field — this is a UX health signal) |

### Lagging Indicators (Weeks 4–8)
| Metric | Target |
|---|---|
| Week 3 retention (still active at Week 3) | ≥ 50% of Week 1 starters |
| Programme completion rate (all 6 weeks) | ≥ 35% of Week 1 starters |
| Body metrics entry rate | ≥ 40% of users log at least one metric |
| Weekly Reflection completion | ≥ 55% of users complete at least 3 of 6 reflections |
| NPS (in-app survey at Week 6) | ≥ 45 |

---

## 12. Open Questions

| Question | Owner | Blocking? |
|---|---|---|
| How do we handle users who fall behind schedule? (e.g. missed 3 days — do we adjust the programme end date or leave gaps?) | Product | Yes — must decide before active workout routing |
| Should the readiness recommendation actually *change* the loaded workout, or only advise? | Design + Engineering | Yes — architecture differs significantly between the two |
| What is the calorie estimation formula? (requires weight + exercise type — is estimated calories even surfaced if no weight is logged?) | Engineering | No — can ship with caveat copy |
| Do we need a cookie consent banner for EU users? (UserConsent model exists but banner not designed) | Legal / Design | No — can ship with consent at signup only |
| Should progress photos be stored in the database (as base64) or in object storage (S3/Supabase Storage)? | Engineering | Yes — architectural decision before photo feature |
| What happens to progress data if a user changes their programme start date? (currently: no clear policy) | Product | No — low frequency edge case, can handle post-launch |

---

## 13. Timeline Considerations

| Milestone | Target | Notes |
|---|---|---|
| V1 internal build complete | May 2026 | All P0 requirements implemented |
| Design QA + polish pass | Mid May 2026 | Colour tokens, typography, spacing consistency |
| Seed data verified (all 42 workouts) | May 2026 | Blockers: form cues, block durations per workout |
| Soft launch (friends + family) | Late May 2026 | 20–50 users, focus on completion rate signal |
| Public V1 | June 2026 | P1 items scheduled as fast-follows |
| P1 feature complete | July 2026 | Reflections, illustrations, share card |

---

## 14. Appendix — Workout Data Completeness Checklist

For each of the 42 workout days, the seed data must include:

- [ ] `Workout.type` (HIIT / Zone2 / Strength / Mobility / Walk / Recovery)
- [ ] `Workout.duration` (minutes)
- [ ] `Workout.intensity` (low / medium / high)
- [ ] `Workout.equipment` (array — e.g. ["Dumbbells", "Exercise Mat"])
- [ ] `Workout.description` (1–2 sentence objective)
- [ ] 4× `WorkoutBlock` records per workout (warmup, main, finisher, cooldown)
- [ ] `Exercise` records for every slot in every block with:
  - `workSeconds` (e.g. 40)
  - `restSeconds` (e.g. 20)
  - `rounds` (e.g. 4)
  - `formCues` (array, ≥3 bullet points)
  - `safetyNotes` (optional, for high-risk movements)

---

*Sources: Men's Fitness 6-Week Fat-Loss Plan methodology; Greatest Physiques Ultimate 6-Week Workout Plan; Forge codebase (April 2026)*
