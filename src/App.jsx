import React, { useEffect, useState } from 'react'
import db from './firebase'
import {
  deleteDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore'
import GraficoGastos from './components/GraficoGastos'

const formatearMes = (mes) => {
  const [año, mesNum] = mes.split("-")
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  return `${nombresMeses[parseInt(mesNum, 10) - 1]} ${año}`
}

const App = () => {
  const [gastos, setGastos] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('Comida')
  const [fecha, setFecha] = useState('')
  const [gastoEditando, setGastoEditando] = useState(null)
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMes, setFiltroMes] = useState('')


  useEffect(() => {
    const q = query(collection(db, 'gastos'), orderBy('fecha', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setGastos(datos)
    })
    return () => unsubscribe()
  }, [])

  const agregarGasto = async (e) => {
    e.preventDefault()
    if (!descripcion || !monto || !fecha) return

    if (gastoEditando) {
      const ref = doc(db, 'gastos', gastoEditando.id)
      await updateDoc(ref, {
        descripcion,
        monto: parseFloat(monto),
        categoria,
        fecha,
      })
      setGastoEditando(null)
    } else {
      await addDoc(collection(db, 'gastos'), {
        descripcion,
        monto: parseFloat(monto),
        categoria,
        fecha,
      })
    }

    setDescripcion('')
    setMonto('')
    setCategoria('Comida')
    setFecha('')
  }

  const editarGasto = (gasto) => {
    setDescripcion(gasto.descripcion)
    setMonto(gasto.monto)
    setCategoria(gasto.categoria)
    setFecha(gasto.fecha)
    setGastoEditando(gasto)
  }

  const eliminarGasto = async (id) => {
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      await deleteDoc(doc(db, 'gastos', id))
    }
  }


  const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0)

  const gastosPorCategoria = gastos.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto
    return acc
  }, {})

  const gastosFiltrados = gastos.filter(gasto => {

    const coincideCategoria = filtroCategoria ? gasto.categoria === filtroCategoria : true
    const coincideFecha = filtroFecha ? gasto.fecha === filtroFecha : true
    const coincideMes = filtroMes
      ? gasto.fecha.startsWith(filtroMes)
      : true

    return coincideCategoria && coincideFecha && coincideMes
  })

  const totalDelMes = gastosFiltrados.reduce((acc, gasto) => acc + gasto.monto, 0)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🧾 Registro de Gastos Mensuales</h1>

        <form
          onSubmit={agregarGasto}
          className="bg-white p-6 rounded-xl shadow-md grid gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="Descripción"
            className="p-3 border border-gray-300 rounded-lg"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Monto"
            className="p-3 border border-gray-300 rounded-lg"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-lg"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option>Comida</option>
            <option>Transporte</option>
            <option>Alquiler</option>
            <option>Entretenimiento</option>
            <option>Otros</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {gastoEditando ? 'Guardar Cambios' : 'Agregar Gasto'}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto"
              placeholder="Filtrar por fecha"
            />
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto"
            >
              <option value="">Todas las categorías</option>
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Servicios">Servicios</option>
              <option value="Impuestos">Impuestos</option>
              <option value="Otros">Otros</option>
            </select>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto"
            >
              <option value="">Todos los meses</option>
              <option value="2025-01">Enero 2025</option>
              <option value="2025-02">Febrero 2025</option>
              <option value="2025-03">Marzo 2025</option>
              <option value="2025-04">Abril 2025</option>
              <option value="2025-05">Mayo 2025</option>
              <option value="2025-06">Junio 2025</option>
              <option value="2025-07">Julio 2025</option>
              <option value="2025-08">Agosto 2025</option>
              <option value="2025-09">Septiembre 2025</option>
              <option value="2025-10">Octubre 2025</option>
              <option value="2025-11">Noviembre 2025</option>
              <option value="2025-12">Diciembre 2025</option>
            </select>

          </div>



          <h2 className="text-2xl font-semibold mb-4">📋 Lista de Gastos</h2>

          <ul className="space-y-3">
            {gastosFiltrados.map((gasto) => (

              <li
                key={gasto.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-lg">{gasto.descripcion}</div>
                  <div className="text-sm text-gray-600">
                    {gasto.fecha} — {gasto.categoria} — <span className="text-green-700 font-medium">${gasto.monto.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => editarGasto(gasto)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarGasto(gasto.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>

            ))}
          </ul>
          {filtroMes && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mt-4 text-lg font-medium">
              💸 Total gastado en {formatearMes(filtroMes)}: ${totalDelMes.toFixed(2)}
            </div>
          )}
        </div>
        {gastos.length > 0 && (
          <div className="mt-10">
            <GraficoGastos gastos={gastosFiltrados} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">📊 Resumen</h2>
          <p className="text-lg font-medium mb-2">Total: <span className="text-blue-700">${totalGastos.toFixed(2)}</span></p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(gastosPorCategoria).map(([cat, monto]) => (
              <li
                key={cat}
                className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-sm font-medium"
              >
                {cat}: ${monto.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App