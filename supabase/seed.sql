-- Add a test admin user (Password: password123)
-- The password_hash is for 'password123' using bcrypt
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@local.test',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"], "role": "admin"}',
    '{}',
    now(),
    now(),
    'authenticated',
    '',
    '',
    '',
    ''
);

-- Add an identity for the user
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    id,
    format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
    'email',
    now(),
    now(),
    now()
FROM auth.users
WHERE email = 'admin@local.test';
