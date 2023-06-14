# Diagrama de colecciones para firestore

Este diagrama representa las relaciones entre tus colecciones. Por ejemplo, la flecha de "Autobuses" a "Rutas" indica que cada documento de "Autobuses" tiene una referencia a un documento de "Rutas" en su campo "ruta". Del mismo modo, la flecha de "Estudiantes" a "Viajes" indica que cada documento de "Viajes" tiene un array de referencias a documentos de "Estudiantes" en su campo "estudiantes".

```mermaid
classDiagram
    Escuela -- Autobús: tiene
    Autobús -- Ruta: sigue
    Autobús -- Conductor: conducido por
    Autobús -- Auxiliar: asistido por
    Ruta -- Viaje: tiene
    Viaje -- Estudiante: transporta
    Estudiante -- Padre: hijo de
    Estudiante -- Tutor: tutelado por
    class Escuela {
        +nombre: string
        +direccion: string
        +telefono: string
    }
    class Autobús {
        +nombre: string
        +placa: string
    }
    class Conductor {
        +nombre: string
    }
    class Auxiliar {
        +nombre: string
    }
    class Ruta {
        +nombre: string
    }
    class Viaje {
        +dia: string
        +momento: string
    }
    class Estudiante {
        +nombre: string
        +grado: string
        +grupo: string
        +paradas: object
    }
    class Padre {
        +nombre: string
    }
    class Tutor {
        +nombre: string
    }

```
