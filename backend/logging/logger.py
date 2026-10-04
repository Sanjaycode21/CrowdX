import logging
import datetime
from typing import List, Dict, Any

# In-memory structured log store for API display
LOG_HISTORY: List[Dict[str, Any]] = []
MAX_LOG_HISTORY = 500

class SystemLogger:
    def __init__(self, name: str = "CrowdGuard"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log(self, module: str, event: str, severity: str = "INFO", details: str = ""):
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        iso_timestamp = datetime.datetime.now().isoformat()
        
        entry = {
            "id": len(LOG_HISTORY) + 1,
            "timestamp": timestamp,
            "iso_timestamp": iso_timestamp,
            "module": module,
            "event": event,
            "severity": severity.upper(),
            "details": details
        }
        
        LOG_HISTORY.append(entry)
        if len(LOG_HISTORY) > MAX_LOG_HISTORY:
            LOG_HISTORY.pop(0)

        log_msg = f"[{module}] {event} {f'- {details}' if details else ''}"
        if severity.upper() == "WARNING":
            self.logger.warning(log_msg)
        elif severity.upper() == "ERROR":
            self.logger.error(log_msg)
        else:
            self.logger.info(log_msg)

    def get_logs(self, limit: int = 100, severity: str = None) -> List[Dict[str, Any]]:
        logs = LOG_HISTORY
        if severity and severity != "ALL":
            logs = [l for l in logs if l["severity"] == severity.upper()]
        return list(reversed(logs[-limit:]))

sys_logger = SystemLogger()
