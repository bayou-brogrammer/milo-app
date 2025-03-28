/*
  # Fix Calendar RLS Policies

  1. Changes
    - Update RLS policies for calendars table to handle sync operations
    - Add policy for inserting calendars with specific user_id
    - Add policy for selecting calendars by user_id
    - Add policy for updating calendars by user_id
    - Add policy for deleting calendars by user_id

  2. Security
    - Maintain strict user isolation
    - Ensure users can only access their own data
    - Prevent unauthorized modifications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own calendars" ON calendars;

-- Create separate policies for each operation
CREATE POLICY "Users can insert their own calendars"
  ON calendars
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can view their own calendars"
  ON calendars
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own calendars"
  ON calendars
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete their own calendars"
  ON calendars
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
  );