import logging
from gunicorn.app.base import BaseApplication
from app_init import create_initialized_flask_app

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app creation should be done by create_initialized_flask_app to avoid circular dependency problems.
app = create_initialized_flask_app()

class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.application = app
        self.options = options or {}
        super().__init__()

    def load_config(self):
        # Apply configuration to Gunicorn
        for key, value in self.options.items():
            if key in self.cfg.settings and value is not None:
                self.cfg.set(key.lower(), value)

    def load(self):
        return self.application

if __name__ == "__main__":
    options = {
        "bind": "0.0.0.0:8080",
        "loglevel": "info",
        "accesslog": "-",
        "timeout": 120,
        "preload": True,
        "workers": 2,
        "worker_class": "gthread",
        "threads": 10,
        "max_requests": 300,
        "max_requests_jitter": 50
    }
    StandaloneApplication(app, options).run()