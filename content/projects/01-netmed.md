---
title: "NetMed"
order: 1
category: "Major project"
status: "In Development"
tags: ["TypeScript", "React", "Supabase", "PostgreSQL", "Python", "NumPy", "scikit-learn"]
summary: "Collaborative Hospital Intelligence: exploring how hospitals could improve a shared disease-detection model without pooling raw patient data."
cover: "/media/netmed.webp"
# Private repository: no source link. No public demo yet.
---
## Overview

NetMed (technical name `mednet-shield`) is a prototype that explores collaborative model improvement between hospitals. The basic website is under development. **None of the hospital-to-hospital collaboration components work end to end yet.**

## The problem

Hospitals often have too little patient data to train a good disease-detection model alone. Privacy, governance and practical constraints usually stop them from sharing raw patient records.

## The intended approach

- Each hospital keeps its patient dataset locally.
- A hospital-side process trains or adjusts a model on that local data.
- Model updates or parameters, not raw patient data, go to a central coordination service.
- The service aggregates the updates and distributes new model versions.

This resembles federated learning in concept. The aggregation method is not final: a planned function is named `aggregate-round` (FedAvg), but the algorithm is not confirmed.

## What has been built so far

Reported as built in the project's phase plan:

- **Browser ML in plain TypeScript, no ML library:** logistic regression, gradient descent, stochastic gradient descent, metrics and a seeded `mulberry32` RNG.
- **Web Workers** so training runs in the background without freezing the page.
- **Web Crypto (`crypto.subtle`)** SHA-256 checks for model and scaler files.
- **Streams API (`TextDecoderStream`)** for reading large hospital CSV files incrementally.
- **Supabase Auth:** hospital ID/password login, admin-created accounts, roles in `app_metadata`.
- **PostgreSQL schema:** `hospitals`, `config`, `model_versions`, `rounds`, `updates`, `audit_log`, with `close_round()`, a closed-round trigger and audit triggers.
- **Row Level Security** so each hospital is meant to see only its own data, covered by 22 access-control tests.
- **Offline ML pipeline (Python):** HOG feature extraction (1,764 features per image) on the Kaggle *Chest X-Ray Images (Pneumonia)* dataset, patient-grouped splits with `StratifiedGroupKFold`, and lambda cross-validation.
- **Parity testing:** shared JSON fixtures check that the TypeScript and Python implementations agree to `1e-9`. A dev-only harness checks this in real Chrome and Firefox.

The React frontend currently has a smoke-test page. The full Login, Home, Train, Predict, History and Admin screens are later work.

## Architecture

- **Frontend (`frontend/`):** React, TypeScript, Vite, `@supabase/supabase-js`, hosted on Vercel.
- **Backend (`backend/`):** Supabase (Mumbai region) with Auth, PostgreSQL, RLS, private Storage buckets (`models`, `updates`) and SQL/PL/pgSQL functions.
- **Offline ML (`ml/`):** Python 3.11/3.12 with NumPy, pandas, scikit-learn, scikit-image, Pillow and tqdm, pinned in `requirements.lock.txt`.
- **Testing:** pytest, Vitest, Vitest with `supabase-js` for access control, and the Supabase Security Advisor.

## Planned next

- Supabase Edge Functions (Deno + TypeScript): `submit-update`, `aggregate-round` and a shared `validate-update.ts`.
- Nightly aggregation with `pg_cron`.
- The full UI screens.
- Learning-curve and noise-versus-accuracy plots.

## Future work, outside the current timeline

- A pretrained CNN as a frozen feature extractor.
- Deep learning in the browser with TensorFlow.js or ONNX Runtime Web and WebGPU.
- An optional hospital-side Python training agent on a GPU.
- Grad-CAM heatmaps.
- Secure aggregation and formal differential-privacy accounting.

## A note on privacy

Privacy-preserving collaboration is the **goal**, not a proven property. RLS and the access-control tests are in place, but they do not make the whole system secure, and raw-data privacy has not been formally proven.
