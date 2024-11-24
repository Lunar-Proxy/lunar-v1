const DBNAME = "SettingsDB";
const LunarSettings = "Lunar-Settings";
let db: IDBDatabase | undefined;
let dbReady: Promise<void>;

interface Setting {
  [key: string]: any;
}

const Settings = (function () {
  dbReady = new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = window.indexedDB.open(DBNAME, 1);

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(LunarSettings)) {
        dbInstance.createObjectStore(LunarSettings, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = function (event: Event) {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };

    request.onerror = function (event: Event) {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  async function ensureDefaultSettings(): Promise<void> {
    await dbReady;
    const defaultSettings: Setting[] = [
      { cloak: "on" },
      { backend: "/p/" }, //  /p/: UV,  /scram/:  Scramjet
      { "search-engine": "https://www.google.com/search?q=" },
    ];
    const transaction = db!.transaction([LunarSettings], "readwrite");
    const store = transaction.objectStore(LunarSettings);

    for (const setting of defaultSettings) {
      const settingKey = Object.keys(setting)[0];
      const cursorRequest: IDBRequest = store.openCursor();
      let found = false;

      cursorRequest.onsuccess = function (event: Event) {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value[settingKey] !== undefined) {
            found = true;
          }
          cursor.continue();
        } else if (!found) {
          store.add(setting);
        }
      };

      cursorRequest.onerror = function (event: Event) {};
    }
  }

  async function add(settingName: string, value: any): Promise<void> {
    await dbReady;
    const transaction = db!.transaction([LunarSettings], "readwrite");
    const store = transaction.objectStore(LunarSettings);
    const cursorRequest = store.openCursor();
    let updated = false;

    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        if (cursor.value[settingName] !== undefined) {
          const updatedEntry = { ...cursor.value, [settingName]: value };
          cursor.update(updatedEntry);
          updated = true;
        }
        cursor.continue();
      } else if (!updated) {
        const newEntry: Setting = { [settingName]: value };
        store.add(newEntry);
      }
    };

    cursorRequest.onerror = function (event: Event) {};
  }

  async function get(settingName: string): Promise<any> {
    await dbReady;
    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([LunarSettings], "readonly");
      const store = transaction.objectStore(LunarSettings);
      const cursorRequest: IDBRequest = store.openCursor();
      let found = false;

      cursorRequest.onsuccess = function (event: Event) {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value[settingName] !== undefined) {
            found = true;
            resolve(cursor.value[settingName]);
            return;
          }
          cursor.continue();
        } else if (!found) {
          resolve(undefined);
        }
      };

      cursorRequest.onerror = function (event: Event) {
        reject(new Error("Error retrieving setting by name."));
      };
    });
  }

  dbReady.then(() => ensureDefaultSettings());

  return { add, get };
})();

export { Settings };
