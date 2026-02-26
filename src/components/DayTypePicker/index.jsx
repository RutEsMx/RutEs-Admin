"use client";
import { DAYS } from "@/utils/options";

const TRAVEL_TYPES = [
    { value: "toHome", label: "A Casa" },
    { value: "toSchool", label: "A Escuela" },
];

/**
 * DayTypePicker — Navegación visual por día y tipo de viaje.
 * Muestra pills de días con badge del número de alumnos asignados.
 *
 * @param {object} students   - values.students del formulario (estructura { monday: { toHome: [], toSchool: [], workshop: [] } })
 * @param {string} selectedDay - día activo ("monday", "tuesday", ...)
 * @param {string} typeTravel  - tipo de viaje activo ("toHome" | "toSchool" | "workshop")
 * @param {function} onDayChange   - callback cuando cambia el día
 * @param {function} onTypeChange  - callback cuando cambia el tipo de viaje
 * @param {boolean} isWorkshop     - si la ruta es de taller (oculta tabs de tipo)
 */
const DayTypePicker = ({
    students = {},
    selectedDay,
    typeTravel,
    onDayChange,
    onTypeChange,
    isWorkshop = false,
}) => {
    const getCount = (day, type) => {
        return students?.[day]?.[type]?.length || 0;
    };

    const getDayTotal = (day) => {
        if (isWorkshop) return getCount(day, "workshop");
        return getCount(day, "toHome") + getCount(day, "toSchool");
    };

    return (
        <div className="flex flex-col gap-2 my-3">
            {/* Pills de días */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(DAYS).map(([key, label]) => {
                    const count = getDayTotal(key);
                    const isActive = selectedDay === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onDayChange(key)}
                            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-150 border
                ${isActive
                                    ? "bg-yellow border-yellow text-black shadow-sm"
                                    : "bg-white border-gray-300 text-gray-600 hover:border-yellow hover:text-black"
                                }
              `}
                        >
                            {label}
                            <span
                                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                  ${isActive ? "bg-black text-yellow" : count > 0 ? "bg-yellow text-black" : "bg-gray-200 text-gray-500"}
                `}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Tabs de tipo de viaje (solo si no es taller) */}
            {!isWorkshop && (
                <div className="flex gap-1 border-b border-gray-200">
                    {TRAVEL_TYPES.map(({ value, label }) => {
                        const count = getCount(selectedDay, value);
                        const isActive = typeTravel === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onTypeChange(value)}
                                className={`
                  flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors
                  ${isActive
                                        ? "border-yellow text-black"
                                        : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                                    }
                `}
                            >
                                {label}
                                {count > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs bg-yellow text-black font-bold">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DayTypePicker;
