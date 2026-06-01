from main import app

def test_app_exists():
    assert app is not None

def test_health_route_exists():
    routes = [r.path for r in app.routes]
    assert "/health" in routes
