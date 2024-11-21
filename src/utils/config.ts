const settings = {
    prefences: localStorage.getItem('@lunar/settings') ? JSON.parse(localStorage.getItem('@lunar/settings') as string) :  {},
    menuOpened: localStorage.getItem("@lunar/menu") || "false",
   };

export default settings