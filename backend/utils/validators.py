"""
Validation Utilities
Provides request validation and data sanitization
"""

import re
from typing import Dict, Any, List, Optional

def validate_search_request(data: Dict[str, Any]) -> bool:
    """
    Validate a product search request
    
    Args:
        data: Request data dictionary
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(data, dict):
        return False
    
    # Check for required query field
    if 'query' not in data:
        return False
    
    query = data.get('query')
    if not isinstance(query, str) or len(query.strip()) == 0:
        return False
    
    # Validate filters if present
    if 'filters' in data:
        filters = data['filters']
        if not isinstance(filters, dict):
            return False
        
        # Validate price range
        if 'price_range' in filters:
            price_range = filters['price_range']
            if not isinstance(price_range, dict):
                return False
            
            if 'min' in price_range and not _is_valid_price(price_range['min']):
                return False
            if 'max' in price_range and not _is_valid_price(price_range['max']):
                return False
        
        # Validate brands list
        if 'brands' in filters:
            brands = filters['brands']
            if not isinstance(brands, list):
                return False
            
            for brand in brands:
                if not isinstance(brand, str) or len(brand.strip()) == 0:
                    return False
        
        # Validate categories list
        if 'categories' in filters:
            categories = filters['categories']
            if not isinstance(categories, list):
                return False
            
            for category in categories:
                if not isinstance(category, str) or len(category.strip()) == 0:
                    return False
    
    return True

def validate_chat_request(data: Dict[str, Any]) -> bool:
    """
    Validate a chat request
    
    Args:
        data: Request data dictionary
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(data, dict):
        return False
    
    # Check for required message field
    if 'message' not in data:
        return False
    
    message = data.get('message')
    if not isinstance(message, str) or len(message.strip()) == 0:
        return False
    
    # Validate context if present
    if 'context' in data:
        context = data['context']
        if not isinstance(context, dict):
            return False
        
        # Validate original_query
        if 'original_query' in context:
            original_query = context['original_query']
            if not isinstance(original_query, str):
                return False
        
        # Validate chat_history
        if 'chat_history' in context:
            chat_history = context['chat_history']
            if not isinstance(chat_history, list):
                return False
            
            for message_obj in chat_history:
                if not isinstance(message_obj, dict):
                    return False
                
                if 'role' not in message_obj or 'content' not in message_obj:
                    return False
                
                if not isinstance(message_obj['role'], str) or not isinstance(message_obj['content'], str):
                    return False
        
        # Validate current_products
        if 'current_products' in context:
            current_products = context['current_products']
            if not isinstance(current_products, list):
                return False
            
            for product in current_products:
                if not isinstance(product, dict):
                    return False
    
    return True

def validate_recommendations_request(data: Dict[str, Any]) -> bool:
    """
    Validate a recommendations request
    
    Args:
        data: Request data dictionary
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(data, dict):
        return False
    
    # Validate user_preferences
    if 'user_preferences' in data:
        preferences = data['user_preferences']
        if not isinstance(preferences, dict):
            return False
        
        # Validate budget
        if 'budget' in preferences:
            budget = preferences['budget']
            if not _is_valid_price(budget):
                return False
        
        # Validate categories
        if 'categories' in preferences:
            categories = preferences['categories']
            if not isinstance(categories, list):
                return False
            
            for category in categories:
                if not isinstance(category, str) or len(category.strip()) == 0:
                    return False
        
        # Validate brands
        if 'brands' in preferences:
            brands = preferences['brands']
            if not isinstance(brands, list):
                return False
            
            for brand in brands:
                if not isinstance(brand, str) or len(brand.strip()) == 0:
                    return False
        
        # Validate features
        if 'features' in preferences:
            features = preferences['features']
            if not isinstance(features, list):
                return False
            
            for feature in features:
                if not isinstance(feature, str) or len(feature.strip()) == 0:
                    return False
    
    # Validate search_history
    if 'search_history' in data:
        search_history = data['search_history']
        if not isinstance(search_history, list):
            return False
        
        for query in search_history:
            if not isinstance(query, str):
                return False
    
    return True

def sanitize_query(query: str) -> str:
    """
    Sanitize a search query to prevent injection attacks
    
    Args:
        query: Raw search query
        
    Returns:
        Sanitized query
    """
    if not isinstance(query, str):
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', query)
    
    # Limit length
    if len(sanitized) > 500:
        sanitized = sanitized[:500]
    
    return sanitized.strip()

def validate_product_data(product: Dict[str, Any]) -> bool:
    """
    Validate product data structure
    
    Args:
        product: Product data dictionary
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(product, dict):
        return False
    
    # Check required fields
    required_fields = ['name', 'brand', 'price']
    for field in required_fields:
        if field not in product:
            return False
    
    # Validate name
    name = product.get('name')
    if not isinstance(name, str) or len(name.strip()) == 0:
        return False
    
    # Validate brand
    brand = product.get('brand')
    if not isinstance(brand, str) or len(brand.strip()) == 0:
        return False
    
    # Validate price
    price = product.get('price')
    if not _is_valid_price(price):
        return False
    
    # Validate optional fields if present
    if 'currency' in product:
        currency = product['currency']
        if not isinstance(currency, str) or len(currency.strip()) == 0:
            return False
    
    if 'description' in product:
        description = product['description']
        if not isinstance(description, str):
            return False
    
    if 'features' in product:
        features = product['features']
        if not isinstance(features, list):
            return False
        
        for feature in features:
            if not isinstance(feature, str):
                return False
    
    if 'rating' in product:
        rating = product['rating']
        if not isinstance(rating, (int, float)) or rating < 0 or rating > 5:
            return False
    
    if 'image_url' in product:
        image_url = product['image_url']
        if not isinstance(image_url, str) or not _is_valid_url(image_url):
            return False
    
    if 'product_url' in product:
        product_url = product['product_url']
        if not isinstance(product_url, str) or not _is_valid_url(product_url):
            return False
    
    return True

def _is_valid_price(price: Any) -> bool:
    """
    Check if a price value is valid
    
    Args:
        price: Price value to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(price, (int, float)):
        return False
    
    if price < 0:
        return False
    
    return True

def _is_valid_url(url: str) -> bool:
    """
    Check if a URL is valid
    
    Args:
        url: URL to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(url, str):
        return False
    
    # Simple URL validation
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return bool(url_pattern.match(url)) 