clearWatch();
clearInterval();

const EMPRESA_ID = 10;
const BOARD_UID = typeof getSerial === "function" ? "esp32-" + getSerial() : "esp32-prodsync-001";
const FIRMWARE_VERSION = "serial-1.1.0";

const PIN_PRODUZINDO = D25;
const PIN_SETUP = D26;
const PIN_PARADA = D27;

let isLocked = false;
let alarmeSeguranca;
let setupHoldTimer;
let setupLongPressTriggered = false;

function enviarPareamento() {
    const payload = {
        id_empresa: EMPRESA_ID,
        board_uid: BOARD_UID,
        firmware_version: FIRMWARE_VERSION
    };

    print("PAIRING:" + JSON.stringify(payload));
}

function dispararEvento(status) {
    if (isLocked) return;

    isLocked = true;
    alarmeSeguranca = setTimeout(() => {
        if (isLocked) {
            isLocked = false;
            print("LOG: TIMEOUT! O PC nao respondeu. Mutex liberado por seguranca.");
        }
    }, 5000);

    const payload = {
        board_uid: BOARD_UID,
        status
    };

    print("DATA:" + JSON.stringify(payload));
}

pinMode(PIN_PRODUZINDO, "input_pullup");
pinMode(PIN_SETUP, "input_pullup");
pinMode(PIN_PARADA, "input_pullup");

setWatch(() => {
    dispararEvento("Produzindo");
}, PIN_PRODUZINDO, { repeat: true, edge: "falling", debounce: 50 });

setWatch(() => {
    setupLongPressTriggered = false;
    setupHoldTimer = setTimeout(() => {
        setupLongPressTriggered = true;
        enviarPareamento();
    }, 3000);
}, PIN_SETUP, { repeat: true, edge: "falling", debounce: 50 });

setWatch(() => {
    if (setupHoldTimer) clearTimeout(setupHoldTimer);
    if (!setupLongPressTriggered) {
        dispararEvento("Setup");
    }
}, PIN_SETUP, { repeat: true, edge: "rising", debounce: 50 });

setWatch(() => {
    dispararEvento("Parada");
}, PIN_PARADA, { repeat: true, edge: "falling", debounce: 50 });

function liberarMutex() {
    isLocked = false;

    if (alarmeSeguranca) {
        clearTimeout(alarmeSeguranca);
    }

    print("LOG: Mutex liberado pelo PC.");
}

print("LOG: ESP32 iniciado. Board UID: " + BOARD_UID);
