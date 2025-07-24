"""
Error Handler Utilities
Provides consistent error handling and response formatting
"""

import logging
from typing import Dict, Any
from flask import jsonify

logger = logging.getLogger(__name__)

def handle_error(error: Exception, context: str = "Unknown error") -> tuple:
    """
    Handle errors and return a consistent error response
    
    Args:
        error: The exception that occurred
        context: Context about where the error occurred
        
    Returns:
        Tuple of (json_response, status_code)
    """
    error_message = str(error)
    error_type = type(error).__name__
    
    # Log the error with context
    logger.error(f"{context}: {error_type} - {error_message}")
    
    # Determine appropriate status code based on error type
    status_code = 500  # Default to internal server error
    
    if "validation" in error_message.lower() or "invalid" in error_message.lower():
        status_code = 400
    elif "not found" in error_message.lower():
        status_code = 404
    elif "unauthorized" in error_message.lower() or "permission" in error_message.lower():
        status_code = 401
    elif "timeout" in error_message.lower():
        status_code = 408
    
    # Create standardized error response
    error_response = {
        "error": {
            "message": error_message,
            "type": error_type,
            "context": context
        },
        "success": False,
        "timestamp": None  # Will be set by the calling function if needed
    }
    
    return jsonify(error_response), status_code

def create_success_response(data: Dict[str, Any], message: str = "Success") -> Dict[str, Any]:
    """
    Create a standardized success response
    
    Args:
        data: The response data
        message: Success message
        
    Returns:
        Standardized success response dictionary
    """
    return {
        "data": data,
        "message": message,
        "success": True
    }

def validate_api_key(api_key: str, required_key: str) -> bool:
    """
    Validate that a required API key is present
    
    Args:
        api_key: The API key to validate
        required_key: The name of the required key for error messages
        
    Returns:
        True if valid, False otherwise
    """
    if not api_key:
        logger.warning(f"{required_key} not provided")
        return False
    
    if not isinstance(api_key, str) or len(api_key.strip()) == 0:
        logger.warning(f"{required_key} is empty or invalid")
        return False
    
    return True

def sanitize_error_message(message: str) -> str:
    """
    Sanitize error messages to prevent information leakage
    
    Args:
        message: Raw error message
        
    Returns:
        Sanitized error message
    """
    # Remove sensitive information patterns
    sensitive_patterns = [
        r'api[_-]?key[=:]\s*\S+',
        r'password[=:]\s*\S+',
        r'token[=:]\s*\S+',
        r'secret[=:]\s*\S+'
    ]
    
    import re
    sanitized = message
    
    for pattern in sensitive_patterns:
        sanitized = re.sub(pattern, '[REDACTED]', sanitized, flags=re.IGNORECASE)
    
    return sanitized 