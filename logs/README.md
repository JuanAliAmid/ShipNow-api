En esta carpeta se guardan los logs de la API:

- `error.log`: errores y fatales.
- `combined.log`: toda la actividad desde el nivel mínimo del entorno.

Cada archivo rota al superar los 5 MB y se conservan hasta 5. Los `.log` no se suben a GitHub porque están ignorados en el `.gitignore`.