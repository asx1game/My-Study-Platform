import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  // Obtener el mensaje del backend
  useEffect(() => {
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error al conectar con el backend:', error));
  }, []);

  // Obtener las tareas
  useEffect(() => {
    fetch('http://localhost:3001/tareas')
      .then(response => response.json())
      .then(data => setTareas(data))
      .catch(error => console.error('Error al obtener las tareas:', error));
  }, []);

  // Añadir una nueva tarea
  const agregarTarea = (e) => {
    e.preventDefault();
    if (nuevaTarea.trim() === '') return; // Evitar añadir tareas vacías
    fetch('http://localhost:3001/tareas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tarea: nuevaTarea, completada: false }),
    })
      .then(response => response.json())
      .then(data => {
        setTareas([...tareas, data.tarea]);
        setNuevaTarea('');
      })
      .catch(error => console.error('Error al añadir tarea:', error));
  };

  // Marcar una tarea como completada
  const marcarCompletada = (id) => {
    fetch(`http://localhost:3001/tareas/${id}`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(data => {
        const nuevasTareas = tareas.map(tarea =>
          tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
        );
        setTareas(nuevasTareas);
      })
      .catch(error => console.error('Error al actualizar tarea:', error));
  };

  // Eliminar una tarea
  const eliminarTarea = (id) => {
    fetch(`http://localhost:3001/tareas/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        const nuevasTareas = tareas.filter(tarea => tarea.id !== id);
        setTareas(nuevasTareas);
      })
      .catch(error => console.error('Error al eliminar tarea:', error));
  };

  return (
    <div>
      <h1>¡Bienvenido a My Study Platform!</h1>
      <p>Mensaje del backend: {message}</p>

      <h2>Lista de Tareas:</h2>
      <ul>
        {tareas.length > 0 ? (
          tareas.map((tarea) => (
            <li key={tarea.id}>
              <span style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
                {tarea.tarea}
              </span>
              <button onClick={() => marcarCompletada(tarea.id)}>
                {tarea.completada ? 'Desmarcar' : 'Completada'}
              </button>
              <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay tareas disponibles</li>
        )}
      </ul>

      <h2>Añadir nueva tarea:</h2>
      <form onSubmit={agregarTarea}>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribe una nueva tarea"
        />
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
}

export default App;
