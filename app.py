from flask import Flask, request, jsonify, render_template
import requests
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'

def connect_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  
    return conn

def init_db():
    with connect_db() as conn:
        conn.execute('''
        CREATE TABLE IF NOT EXISTS cotizaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            moneda TEXT NOT NULL,
            compra REAL NOT NULL,
            venta REAL NOT NULL
        )
    ''')
    conn.commit()

@app.errorhandler(Exception)
def handle_exception(e):
    code = 500
    if isinstance(e, sqlite3.IntegrityError):
        code = 400
        message = str(e)
    elif isinstance(e, sqlite3.OperationalError):
        code = 500
        message = "Database operation failed"
    elif isinstance(e, sqlite3.DatabaseError):
        code = 500
        message = "Database error ocurred"
    else:
        code = getattr(e, 'code', 500)
        message = str(e)
    return jsonify({"error": message}), code

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/cotizaciones', methods=['GET'])
def obtener_cotizaciones():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cotizaciones;')
    cotizaciones = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify([dict(row) for row in cotizaciones])


@app.route('/api/cotizaciones/<int:id>', methods=['GET'])
def obtener_cotizacion(id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cotizaciones WHERE id = ?;', (id,))
    cotizacion = cursor.fetchone()
    cursor.close()
    conn.close()

    if cotizacion:
        return jsonify(dict(cotizacion))
    else:
        return jsonify({'error': 'Cotización no encontrada'}), 404


@app.route('/api/cotizaciones', methods=['POST'])
def crear_cotizacion():
    nueva_cotizacion = request.json
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO cotizaciones (moneda, compra, venta) VALUES (?, ?, ?);',
        (nueva_cotizacion['moneda'], nueva_cotizacion['compra'], nueva_cotizacion['venta'])
    )
    conn.commit()
    nueva_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({'id': nueva_id}), 201


@app.route('/api/cotizaciones/<int:id>', methods=['PUT'])
def actualizar_cotizacion(id):
    datos_actualizados = request.json
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE cotizaciones SET moneda = ?, compra = ?, venta = ? WHERE id = ?;',
        (datos_actualizados['moneda'], datos_actualizados['compra'], datos_actualizados['venta'], id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Cotización actualizada'})


@app.route('/api/cotizaciones/<int:id>', methods=['DELETE'])
def eliminar_cotizacion(id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM cotizaciones WHERE id = ?;', (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Cotización eliminada'})


@app.route('/api/cotizaciones')
def cotizaciones():
    # Obtén los datos desde una API externa de cotizaciones
    try:
        response = requests.get("https://dolarapi.com/v1/cotizaciones")
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({"error": "No se pudo obtener los datos"}), 500

if __name__ == '__main__':
    app.run(debug=True)
