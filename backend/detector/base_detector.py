from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple

class BaseDetector(ABC):
    """Abstract Base Class for Crowd Detectors."""

    @abstractmethod
    def detect(self, scenario: str = "Normal Crowd") -> Tuple[int, List[Dict[str, float]], float, float]:
        """
        Returns (people_count, bounding_boxes, detection_confidence, processing_fps)
        """
        pass
