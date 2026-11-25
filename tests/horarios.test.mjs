import { test } from "node:test";
import assert from "node:assert/strict";
import { estadoDelPuesto, parseDia, rutaLimpia } from "../src/lib/puestos.js";

const semana = (hora) => Array.from({ length: 7 }, () => ({ hora }));

test("turno partido: abierto por la tarde y cerrado entre turnos", () => {
  const h = semana("11:00 - 16:00 / 19:00 - 23:00");
  assert.deepEqual(estadoDelPuesto(h, { dia: 2, minutos: 20 * 60 }), { abierto: true, hasta: "23:00" });
  assert.deepEqual(estadoDelPuesto(h, { dia: 2, minutos: 17 * 60 }), { abierto: false, abre: "19:00" });
});

test("cierre pasada la medianoche cuenta para el día siguiente", () => {
  const h = semana("12:00 - 02:00");
  assert.equal(estadoDelPuesto(h, { dia: 3, minutos: 119 }).abierto, true);
  assert.equal(estadoDelPuesto(h, { dia: 3, minutos: 120 }).abierto, false);
});

test("horarios ambiguos o raros quedan por confirmar, no se inventa el estado", () => {
  assert.equal(estadoDelPuesto(semana("11:00 - 11:00"), { dia: 1, minutos: 720 }).porConfirmar, true);
  assert.equal(estadoDelPuesto(semana("según temporada"), { dia: 1, minutos: 720 }).porConfirmar, true);
  assert.equal(estadoDelPuesto([], { dia: 1, minutos: 720 }).porConfirmar, true);
});

test("«Cerrado» y 24:00", () => {
  assert.deepEqual(parseDia("Cerrado"), { cerrado: true, tramos: [] });
  assert.equal(estadoDelPuesto(semana("Cerrado"), { dia: 1, minutos: 720 }).abierto, false);
  assert.deepEqual(estadoDelPuesto(semana("11:00 - 24:00"), { dia: 1, minutos: 1439 }), { abierto: true, hasta: "24:00" });
});

test("las rutas con barra final encuentran su puesto", () => {
  assert.equal(rutaLimpia("/carta-galdar/"), "/carta-galdar");
  assert.equal(rutaLimpia("/"), "/");
});

test("se rechazan horas imposibles, textos mezclados y tramos solapados", () => {
  assert.equal(parseDia("11:99 - 16:00"), null);
  assert.equal(parseDia("11:00 - 16:00 / por confirmar"), null);
  assert.equal(parseDia("09:00 - 11:00 / 10:00 - 16:00"), null);
  assert.equal(parseDia("25:00 - 02:00"), null);
  assert.equal(parseDia("11:00 - 16:00 /"), null);
  assert.deepEqual(parseDia("11:00 - 16:00 y 19:00 - 23:30").tramos.length, 2);
});
