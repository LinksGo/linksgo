-- Function to completely delete a user account and all associated data
create or replace function delete_account(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Delete from appearance_settings
  delete from appearance_settings where user_id = $1;
  
  -- Delete from links
  delete from links where user_id = $1;
  
  -- Delete from profiles
  delete from profiles where id = $1;
  
  -- Delete the auth.users entry
  delete from auth.users where id = $1;
  
  -- Note: Storage files will be handled by the client
  -- as we need storage bucket access
end;
$$;
