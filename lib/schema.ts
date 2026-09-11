import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

export const schemaSql = `
  -- Users table for preferences and settings
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT 'Leroy Adonis',
    theme TEXT DEFAULT 'dark',
    adhd_time_estimate INTEGER DEFAULT 3,
    anxiety_alert BOOLEAN DEFAULT false,
    last_checkin_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Daily routines
  CREATE TABLE IF NOT EXISTS daily_routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Steps within routines
  CREATE TABLE IF NOT EXISTS routine_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL,
    step_text TEXT NOT NULL,
    estimated_minutes INTEGER DEFAULT 2,
    sort_order INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (routine_id) REFERENCES daily_routines(id)
  );

  -- Tasks
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER DEFAULT 2,
    state TEXT CHECK(state IN ('now', 'later', 'done')) DEFAULT 'now',
    project_tag TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Reminders
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    action TEXT,
    remind_at TEXT NOT NULL,
    state TEXT CHECK(state IN ('pending', 'due', 'snoozed', 'done')) DEFAULT 'pending',
    snooze_until TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Anxiety logs
  CREATE TABLE IF NOT EXISTS anxiety_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    severity INTEGER CHECK(severity >= 1 AND severity <= 10) NOT NULL,
    trigger TEXT,
    action_taken TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Voice memos
  CREATE TABLE IF NOT EXISTS voice_memos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transcription TEXT,
    parsed_items TEXT,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'error')) DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Seed initial data
  INSERT OR IGNORE INTO users (id, name, theme) VALUES (1, 'Leroy Adonis', 'dark');

  INSERT OR IGNORE INTO daily_routines (id, user_id, name, sort_order) VALUES
    (1, 1, 'Morning Routine', 0),
    (2, 1, 'Evening Routine', 1);

  INSERT OR IGNORE INTO routine_steps (id, routine_id, step_text, estimated_minutes, sort_order) VALUES
    (1, 1, 'Brush teeth: 3 min', 3, 0),
    (2, 1, 'Drink water: 1 min', 1, 1),
    (3, 1, 'Morning meditation: 2 min', 2, 2),
    (4, 2, 'Tonight wind-down: 2 min', 2, 0),
    (5, 2, 'Log today wins: 3 min', 3, 1);

  INSERT OR IGNORE INTO tasks (id, user_id, title, estimated_minutes, state, sort_order) VALUES
    (1, 1, 'Email George about ILALI', 5, 'now', 0),
    (2, 1, 'Fix voice transcription bug', 15, 'now', 1),
    (3, 1, 'Call Zahra-Rose to say hi', 3, 'later', 0);

  INSERT OR IGNORE INTO reminders (id, user_id, message, action, remind_at, state) VALUES
    (1, 1, 'Fetch Zayden''s meds at 2pm', 'Open medicine cabinet', '2026-09-11T14:00:00', 'pending'),
    (2, 1, 'Email George by 4pm', 'Compose and send email', '2026-09-11T16:00:00', 'due');
`;