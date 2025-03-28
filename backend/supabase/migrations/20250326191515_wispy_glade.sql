/*
  # Initial Schema Setup for Calendar and Energy Tracking

  1. New Tables
    - `calendars`
      - `id` (uuid, primary key)
      - `title` (text)
      - `color` (text)
      - `source` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `location` (text)
      - `calendar_id` (uuid, references calendars)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `energy_levels`
      - `id` (uuid, primary key)
      - `level` (text)
      - `description` (text)
      - `timestamp` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create calendars table
CREATE TABLE IF NOT EXISTS calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  color text NOT NULL,
  source text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_color CHECK (color ~* '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
);

ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own calendars"
  ON calendars
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  calendar_id uuid REFERENCES calendars ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own events"
  ON events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create energy_levels table
CREATE TABLE IF NOT EXISTS energy_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  description text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_level CHECK (level IN ('Low', 'Medium', 'High'))
);

ALTER TABLE energy_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own energy levels"
  ON energy_levels
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_energy_levels_user_id ON energy_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_levels_timestamp ON energy_levels(timestamp);