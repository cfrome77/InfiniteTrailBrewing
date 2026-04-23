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

-- Add sample beer data
INSERT INTO public.currently_brewing (
    beer_name,
    style,
    abv,
    status,
    started_at,
    notes,
    is_flagship,
    color
)
VALUES
    ('Summit Trail IPA', 'West Coast IPA', '6.8%', 'finished', '2024-01-15', 'Classic pine and citrus notes with a firm bitterness.', true, 'from-orange-400 to-orange-500'),
    ('Midnight Creek Stout', 'Oatmeal Stout', '5.5%', 'conditioning', '2024-02-01', 'Smooth and velvety with notes of roasted coffee and dark chocolate.', false, 'from-stone-700 to-stone-800'),
    ('Clear Water Lager', 'German Helles', '4.8%', 'fermenting', '2024-02-10', 'Crisp, clean, and refreshing with a subtle malt sweetness.', true, 'from-amber-400 to-amber-500');
