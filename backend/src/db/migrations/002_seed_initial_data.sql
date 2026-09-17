-- Seed Administrator User
INSERT INTO users (username, password_hash, name, role, email)
VALUES (
  'admin',
  'dayzero', -- Plaintext/hash for internal demo operator
  'Alex Vance',
  'SUPER ADMIN',
  'alex@dayzero.internal'
)
ON CONFLICT (username) DO UPDATE
SET name = EXCLUDED.name, role = EXCLUDED.role, email = EXCLUDED.email;

-- Seed Products
INSERT INTO products (title, slug, category, status, summary, description, specs, featured, order_index)
VALUES
(
  'Project Chimera',
  'project-chimera',
  'COMPUTE',
  'published',
  'Production release deployed to global edge runtime cluster.',
  'Project Chimera is Day Zero''s distributed low-latency compute substrate built for autonomic agent orchestration.',
  '{"version": "1.0.4", "arch": "distributed-edge", "throughput": "1.2M ops/s", "p99_latency": "14ms"}'::jsonb,
  true,
  1
),
(
  'Specter Audio Engine',
  'specter-audio-engine',
  'AUDIO',
  'published',
  'Spatial auditory processing runtime with sub-5ms DSP pipelines.',
  'Ultra-low latency audio processing architecture tailored for spatial acoustics and interactive simulation.',
  '{"latency": "3.8ms", "channels": "64-ch spatial", "dsp_sample_rate": "96kHz"}'::jsonb,
  true,
  2
),
(
  'Vanguard Telemetry Core',
  'vanguard-telemetry-core',
  'SYSTEMS',
  'draft',
  'Real-time streaming telemetry and orbital synchronization.',
  'Ground-to-orbit telemetry verification stack with Byzantine fault tolerant state machines.',
  '{"clock_drift": "<10ns", "redundancy": "3x Byzantine quorum"}'::jsonb,
  false,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Missions
INSERT INTO missions (title, slug, milestone, status, summary, telemetry, order_index)
VALUES
(
  'Orbital Relay Phase 2',
  'orbital-relay-phase-2',
  'Phase 2 Deployment',
  'deployed',
  'Telemetry verification confirmed by ground tracking stations across APAC and EMEA.',
  '{"downlink_speed": "40Gbps", "orbit_altitude_km": 540, "signal_margin_db": 14.2}'::jsonb,
  1
),
(
  'Deep Horizon Grid Survey',
  'deep-horizon-grid-survey',
  'Milestone Beta',
  'deployed',
  'Autonomous topological mapping of distributed high-density nodes.',
  '{"nodes_mapped": 4200, "coverage_pct": 98.4}'::jsonb,
  2
),
(
  'Sub-surface Mesh Relay',
  'sub-surface-mesh-relay',
  'Architecture Sign-off',
  'planning',
  'Hardened acoustic mesh routing for subterranean telemetry probes.',
  '{"carrier_freq_khz": 32, "effective_range_km": 18}'::jsonb,
  3
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Recent Activities
INSERT INTO system_activities (type, title, meta, badge_label, badge_variant, created_at)
VALUES
(
  'product_published',
  'Project Chimera v1.0 published',
  'Production release deployed to global edge',
  'PUBLISHED',
  'neutral',
  NOW() - INTERVAL '14 minutes'
),
(
  'contact_received',
  'Partnership dispatch from Quantum Labs',
  'Received via public inquiry endpoint',
  'INQUIRY',
  'warning',
  NOW() - INTERVAL '1 hour'
),
(
  'product_updated',
  'Specter Audio Engine spec revised',
  'Technical schematics & latency targets updated',
  'UPDATED',
  'neutral',
  NOW() - INTERVAL '3 hours'
),
(
  'mission_updated',
  'Orbital Relay Phase 2 milestone reached',
  'Telemetry verification confirmed by ground team',
  'MISSION',
  'neutral',
  NOW() - INTERVAL '6 hours'
);

-- Seed Contacts
INSERT INTO contacts (name, email, company, subject, message, status, created_at)
VALUES
(
  'Dr. Aris Thorne',
  'thorne@quantumlabs.tech',
  'Quantum Labs',
  'Partnership inquiry on Project Chimera',
  'We are evaluating Day Zero''s distributed compute substrate for quantum annealing workloads. Would love to schedule technical alignment.',
  'in_review',
  NOW() - INTERVAL '1 hour'
),
(
  'Elena Rostova',
  'elena@aether-dynamics.io',
  'Aether Dynamics',
  'Specter DSP Integration',
  'Requesting access to developer sandbox documentation for spatial audio integration.',
  'new',
  NOW() - INTERVAL '4 hours'
);

-- Seed System Settings
INSERT INTO system_settings (key, value)
VALUES
(
  'general',
  '{"siteName": "DAY ZERO", "operatorEmail": "admin@dayzero.internal", "maintenanceMode": false, "version": "1.0.0"}'::jsonb
),
(
  'telemetry',
  '{"heartbeatIntervalSeconds": 30, "edgeLatencyTargetMs": 25, "slaThreshold": 99.9}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
