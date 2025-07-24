#!/usr/bin/env python3
"""
Redmerce Backend Runner
Simple script to start the Flask backend server
"""

import os
import sys
from app import create_app

def main():
    """Main function to start the Flask application"""
    try:
        # Create the Flask app
        app = create_app()
        
        # Get configuration
        port = int(os.getenv('PORT', 5001))
        debug = os.getenv('FLASK_ENV') == 'development'
        
        print(f"🚀 Starting Redmerce Backend on port {port}")
        print(f"📝 Debug mode: {debug}")
        print(f"🌐 Frontend proxy: http://localhost:3000")
        print(f"🔗 Backend API: http://localhost:{port}")
        print("=" * 50)
        
        # Start the server
        app.run(
            host='0.0.0.0',
            port=port,
            debug=debug
        )
        
    except KeyboardInterrupt:
        print("\n👋 Shutting down Redmerce Backend...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 