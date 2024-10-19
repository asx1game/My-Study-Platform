const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Lista de tareas simulada
let tareas = [
  { id: 1, tarea: 'Estudiar matemáticas', completada: false },
  { id: 2, tarea: 'Leer sobre historia', completada: true },
  { id: 3, tarea: 'Hacer ejercicios de programación', completada: false }
];

app.use(cors());
app.use(bodyParser.json()); // Habilitar body-parser para manejar JSON

// Ruta principal para verificar conexión
app.get('/', (req, res) => {
  res.json({ message: 'Conexión exitosa con el backend' });
});

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

// Añadir una nueva tarea
app.post('/tareas', (req, res) => {
  const nuevaTarea = req.body;
  nuevaTarea.id = tareas.length + 1; // Asignar un nuevo ID
  tareas.push(nuevaTarea);
  res.json({ message: 'Tarea añadida', tarea: nuevaTarea });
});

// Actualizar el estado de una tarea (completar o desmarcar)
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    res.json({ message: 'Tarea actualizada', tarea });
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tareas = tareas.filter(t => t.id !== id);
  res.json({ message: 'Tarea eliminada' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
