const DBNAME = "SettingsDB";
const LunarSettings = "Lunar-Settings";
let db: IDBDatabase;

interface Setting {
  id?: number;
  [key: string]: any;
}

function Settings(): void {
  const request: IDBOpenDBRequest = window.indexedDB.open(DBNAME, 1);

  request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
    db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
    if (!db.objectStoreNames.contains(LunarSettings)) {
      db.createObjectStore(LunarSettings, { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event: Event) {
    db = (event.target as IDBRequest).result as IDBDatabase;
    ensureDefaultSettings();
  };

  request.onerror = function (event: Event) {
    console.error("Database error: " + (event.target as IDBRequest).error?.message);
  };
}

function ensureDefaultSettings(): void {
  const defaultSettings: Setting[] = [
    { cloak: "on" },
    { "search-engine": "https://www.google.com/search?q=" },
  ];

  const transaction = db.transaction([LunarSettings], "readwrite");
  const store = transaction.objectStore(LunarSettings);

  defaultSettings.forEach((setting) => {
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
        console.log(`Default setting '${settingKey}' added.`);
      }
    };

    cursorRequest.onerror = function (event: Event) {
      console.error(`Error ensuring default for '${settingKey}':`, (event.target as IDBRequest).error);
    };
  });
} 

Settings.add = function (setting: Setting): void {
  const transaction = db.transaction([LunarSettings], "readwrite");
  const store = transaction.objectStore(LunarSettings);

  const getRequest: IDBRequest = store.get(setting.id!);

  getRequest.onsuccess = function (event: Event) {
    const existingSetting = (event.target as IDBRequest).result as Setting | undefined;

    if (existingSetting) {
      const updateRequest = store.put(setting);
      updateRequest.onsuccess = function () {
        console.log("Setting updated successfully!");
      };
      updateRequest.onerror = function (event: Event) {
        console.error("Error updating setting:", (event.target as IDBRequest).error);
      };
    } else {
      const addRequest = store.add(setting);
      addRequest.onsuccess = function () {
        console.log("Setting added successfully!");
      };
      addRequest.onerror = function (event: Event) {
        console.error("Error adding setting:", (event.target as IDBRequest).error);
      };
    }
  };

  getRequest.onerror = function (event: Event) {
    console.error("Error checking setting:", (event.target as IDBRequest).error);
  };
};

Settings.get = function (settingName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LunarSettings], "readonly");
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
      } else {
        if (!found) {
          resolve(undefined);
        }
      }
    };

    cursorRequest.onerror = function (event: Event) {
      reject(new Error("Error retrieving setting by name: " + (event.target as IDBRequest).error));
    };
  });
};

export { Settings };
