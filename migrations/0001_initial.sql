PRAGMA foreign_keys = ON;

CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 100),
  max_guests INTEGER NOT NULL CHECK(max_guests BETWEEN 1 AND 20),
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE rsvps (
  invitation_id TEXT PRIMARY KEY REFERENCES invitations(id) ON DELETE CASCADE,
  attendance TEXT NOT NULL CHECK(attendance IN ('attending', 'declined')),
  guest_count INTEGER NOT NULL CHECK(guest_count BETWEEN 0 AND 20),
  message TEXT NOT NULL DEFAULT '' CHECK(length(message) <= 1000),
  updated_at TEXT NOT NULL,
  CHECK((attendance = 'declined' AND guest_count = 0) OR (attendance = 'attending' AND guest_count >= 1))
);

CREATE TABLE wishes (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 100),
  message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 1000),
  visible INTEGER NOT NULL DEFAULT 1 CHECK(visible IN (0, 1)),
  created_at TEXT NOT NULL,
  UNIQUE(invitation_id, submission_id)
);
CREATE INDEX wishes_visible_order ON wishes(visible, created_at DESC, id DESC);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX rate_limits_expiry ON rate_limits(expires_at);
