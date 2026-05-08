# AMI-Teach — Developer Setup Guide

## Step 1: Get Your Supabase Keys
1. Go to https://supabase.com
2. Create a new project named "ami-teach"
3. Wait for it to provision (about 2 minutes)
4. Go to Settings → API
5. Copy your Project URL and anon/public key

## Step 2: Add Your Keys to the Project
Open js/env.js and replace:
- PASTE_YOUR_PROJECT_URL_HERE → your Project URL
- PASTE_YOUR_ANON_KEY_HERE → your anon key

## Step 3: Get Your Paystack Keys
1. Go to https://dashboard.paystack.com
2. Settings → API Keys & Webhooks
3. Copy your Public Key (test key during development)
4. Paste it into js/env.js as PAYSTACK_PUBLIC_KEY

## Step 4: Install Supabase CLI (Windows)
Run in PowerShell:
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

## Step 5: Link CLI to Your Project
supabase login
supabase link --project-ref your-project-ref

Your project ref is the string in your Supabase URL:
https://xxxxxxxxxxxx.supabase.co
         ^^^^^^^^^^^^
         this is your project ref

## Step 6: Push the Database Schema
supabase db push

## Environment Variables Reference
| Variable | Where to get it |
|---|---|
| SUPABASE_URL | supabase.com → Settings → API |
| SUPABASE_ANON_KEY | supabase.com → Settings → API |
| PAYSTACK_PUBLIC_KEY | dashboard.paystack.com → Settings |
