---
title: "Telegram-Controlled AI Coding Agent"
order: 2
category: "Minor project"
status: "In Development"
tags: ["TypeScript", "Telegram Bot", "OpenRouter"]
summary: "Remote task submission for an AI coding agent on my own computer, using Telegram as the interface."
cover: "/media/telegram-agent.webp"
# PLACEHOLDER: add `link:` once the repository URL is public.
---
## Overview

An early-stage tool for sending coding tasks to an AI agent running on my own machine, with Telegram as the remote interface.

## Motivation

I'm often away from my desk. I wanted to hand coding tasks to an agent on my PC from my phone, without needing a remote desktop.

## What works today

Implemented and tested:

- Connects to Telegram through a bot.
- Receives coding tasks sent from Telegram.
- Passes each task to a free OpenRouter model, which acts as the agent and performs it.

## Stack

- TypeScript
- Telegram bot integration
- OpenRouter SDK / API

## Status

Early stage. Features such as approving or rejecting actions remotely, live progress, interrupting or changing a running task, and robust error recovery are **not** implemented.
