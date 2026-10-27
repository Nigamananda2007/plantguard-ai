"""
PlantGuard AI - Production Gunicorn Configuration for Render.
Designed conservatively for Render Free's 512 MB RAM limit.
Uses a single worker process with threads to handle concurrent I/O
without risking out-of-memory or worker timeout SIGKILLs.
"""

import os

# Port configuration from environment
port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Worker configuration:
# 1 worker process with 4 threads using 'gthread' worker class.
# Baseline memory per worker is ~44 MB, leaving comfortable headroom under 512 MB.
workers = 1
worker_class = "gthread"
threads = 4

# Timeout configuration:
# Default Gunicorn timeout is 30s. We increase to 60s so worker is never killed
# while waiting for an upstream API call (capped at 20s in our application code).
timeout = 60
graceful_timeout = 30
keepalive = 5

# Memory management:
# Periodically recycle worker to release any Python memory fragmentation
max_requests = 500
max_requests_jitter = 50

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
