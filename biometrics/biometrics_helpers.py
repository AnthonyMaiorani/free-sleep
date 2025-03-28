import argparse
import numpy as np
from datetime import datetime, timezone
import json


def validate_datetime_utc(date_str):
    """
    Validate and parse datetime input as UTC.
    Accepts ISO 8601 format (e.g., '2025-02-04T04:00:00Z' or '2025-02-04T04:00:00.000Z')
    """
    try:
        # Handle both cases with and without microseconds
        # return datetime.fromisoformat(date_str.replace('Z', '+00:00')).astimezone(timezone.utc)
        return datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=timezone.utc)
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"Invalid datetime format: '{date_str}'. Use ISO 8601 format like 'YYYY-MM-DDTHH:MM:SSZ'."
        )

