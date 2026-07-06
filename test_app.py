import unittest
from app import app

class AnemiaSenseTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_home_page(self):
        """Test that home page loads and contains form inputs."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        # Check for form controls
        self.assertIn(b'Clinical Metrics Form', response.data)
        self.assertIn(b'name="Gender"', response.data)
        self.assertIn(b'name="Hemoglobin"', response.data)
        self.assertIn(b'name="MCH"', response.data)

    def test_prediction_healthy(self):
        """Test healthy prediction path."""
        response = self.client.post('/predict', data={
            'Gender': '0',       # Male
            'Hemoglobin': '15.5', # Healthy level
            'MCH': '30.0',
            'MCHC': '34.0',
            'MCV': '90.0'
        })
        self.assertEqual(response.status_code, 200)
        # Should contain success markers
        self.assertIn(b'Normal Assessment Profile', response.data)
        self.assertIn(b'Parameter Range Gauges', response.data)

    def test_prediction_anemic(self):
        """Test anemic prediction path."""
        response = self.client.post('/predict', data={
            'Gender': '1',       # Female
            'Hemoglobin': '8.5',  # Low level
            'MCH': '20.0',
            'MCHC': '28.0',
            'MCV': '70.0'
        })
        self.assertEqual(response.status_code, 200)
        # Should contain warning markers
        self.assertIn(b'Anemia Risk Detected', response.data)
        self.assertIn(b'Heme Iron Sources', response.data)

    def test_prediction_invalid_inputs(self):
        """Test that invalid inputs fail gracefully."""
        response = self.client.post('/predict', data={
            'Gender': 'invalid',
            'Hemoglobin': 'abc',
            'MCH': '30.0',
            'MCHC': '34.0',
            'MCV': '90.0'
        })
        # Should render home screen with warning message
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Please fill out all fields with valid numbers', response.data)

if __name__ == '__main__':
    unittest.main()
