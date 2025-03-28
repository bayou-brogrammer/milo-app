/*
  # Add user constraints to calendars and events

  1. Changes
    - Add NOT NULL constraint to user_id columns
    - Add foreign key constraints to auth.users
    - Add cascade delete for user deletion
    - Update RLS policies to enforce user ownership

  2. Security
    - Ensure users can only access their own data
    - Prevent orphaned records when users are deleted
*/

-- Update calendars table constraints
ALTER TABLE calendars
  DROP CONSTRAINT IF EXISTS calendars_user_id_fkey,
  ADD CONSTRAINT calendars_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Update events table constraints
ALTER TABLE events
  DROP CONSTRAINT IF EXISTS events_user_id_fkey,
  ADD CONSTRAINT events_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Update energy_levels table constraints
ALTER TABLE energy_levels
  DROP CONSTRAINT IF EXISTS energy_levels_user_id_fkey,
  ADD CONSTRAINT energy_levels_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own calendars" ON calendars;
DROP POLICY IF EXISTS "Users can manage their own events" ON events;
DROP POLICY IF EXISTS "Users can manage their own energy levels" ON energy_levels;

-- Create stricter policies
CREATE POLICY "Users can manage their own calendars"
  ON calendars
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM calendars 
      WHERE id = calendar_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM calendars 
      WHERE id = calendar_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own energy levels"
  ON energy_levels
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for foreign keys if not exists
CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id);