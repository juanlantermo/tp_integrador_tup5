from flask import Flask, jsonify, request
from flask_cors import CORS
import requests # peticiones a otras apis
import json

app = Flask(__name__)
CORS(app) # Habilita CORS en toda la aplicación

# Simulamos la base de datos en memoria
correos = []

class Dolar:
    def __init__(self, nombre, compra, venta, fechaActualizacion):
        self.nombre = nombre
        self.compra = compra
        self.venta = venta
        self.fechaActualizacion = fechaActualizacion

    def to_dict(self):
        return {
            "nombre": self.nombre,
            "compra": self.compra,
            "venta": self.venta,
            "fechaActualizacion": self.fechaActualizacion,
        }


@app.route('/')
def index():
    endpoints = [
        {"path": "/", "descripcion": "Pagina de inicio (GET)"},
        {"path": "/test", "descripcion": "Endpoint de prueba (GET)"},
        {"path": "/dolares", "descripcion": "Obtiene el tipo de cambio de diferentes dolares (GET)"},
        {"path": "/cotizaciones", "descripcion": "Obtiene las cotizaciones actuales (GET)"},
        {"path": "/historico", "descripcion": "Obtiene datos historicos de cotizaciones (GET)"},
        {"path": "/enviar-email", "descripcion": "Envia un correo electronico (POST)"},
        {"path": "/historial-emails", "descripcion": "Obtiene el historial de correos enviados (GET)"}
    ]
    return jsonify(endpoints), 200

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Flask is working!"})
# Metodo get para consumo formulario.js y envio de mail
@app.route('/dolares', methods=['GET'])
def get_dolares():
    try:
        response = requests.get('https://dolarapi.com/v1/dolares')
        response.raise_for_status()
        data = response.json()
        dolares = [Dolar(d["nombre"], d["compra"], d["venta"], d["fechaActualizacion"]) for d in data[:3]]
        return jsonify([dolar.to_dict() for dolar in dolares])
    except requests.RequestException:
        return jsonify({"error": "Error al obtener los datos de la API"}), 500
# Metodo get para inf en index monedas diferentes a dolar
@app.route('/cotizaciones', methods=['GET'])
def get_cotizaciones():
    try:
        response = requests.get('https://dolarapi.com/v1/cotizaciones')
        response.raise_for_status()
        data = response.json()
        dolares = [Dolar(d["nombre"], d["compra"], d["venta"], d["fechaActualizacion"]) for d in data]
        return jsonify([dolar.to_dict() for dolar in dolares])
    except requests.RequestException:
        return jsonify({"error": "Error al obtener los datos de la API"}), 500

@app.route('/historico', methods=['GET'])
def get_historico():
    try:
        response = requests.get('https://api.argentinadatos.com/v1/cotizaciones/dolares/')
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.RequestException:
        return jsonify({"error": "Error al obtener los datos de la API"}), 500

@app.route('/enviar-email', methods=['POST'])
def send_email():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    cotizaciones = data.get('cotizaciones')

    emailjs_data = {
        "service_id": "service_d9qjdcq",
        "template_id": "template_vcqc54e",
        "user_id": "CSPgr1k1ok22ThUHB",
        "accessToken": "SZ_k-5uJF8SqHcteH39nL",
        "template_params": {
            "from_name": name,
            "message": message,
            "cotizaciones": cotizaciones,
            "to_mail": email
        }
    }

    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://your-website.com',
        'Referer': 'https://your-website.com/'
    }

    try:
        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            data=json.dumps(emailjs_data),
            headers=headers
        )

        if response.status_code == 200:
            # Guardamos el correo en la lista en memoria
            correos.append({
                "nombre": name,
                "email": email,
                "mensaje": message,
                "cotizaciones": cotizaciones
            })
            return jsonify({"message": "Correo enviado exitosamente"}), 200
        else:
            return jsonify({"message": "Error al enviar el correo"}), response.status_code
    except requests.exceptions.RequestException as error:
        return jsonify({"message": "Error en la solicitud a EmailJS", "error": str(error)}), 500

@app.route('/historial-emails', methods=['GET'])
def historial_emails():
    return jsonify(correos), 200

if __name__ == "__main__":
    app.run(debug=True)
