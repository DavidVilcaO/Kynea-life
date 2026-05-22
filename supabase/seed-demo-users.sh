#!/usr/bin/env bash
# Crea los 3 usuarios demo en Supabase Auth.
# Uso: SERVICE_KEY=tu_service_role ./seed-demo-users.sh
#
# El trigger handle_new_user() creará automáticamente sus profiles
# con el role correcto leído de user_metadata.

set -euo pipefail

URL="https://cuysiqikeduaxexqrzql.supabase.co"
KEY="${SERVICE_KEY:?Set SERVICE_KEY env var}"

create_user() {
  local email="$1"
  local role="$2"
  local name="$3"

  echo "→ Creando $email ($role)…"
  curl -sS -X POST "$URL/auth/v1/admin/users" \
    -H "Authorization: Bearer $KEY" \
    -H "apikey: $KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"demo1234\",
      \"email_confirm\": true,
      \"user_metadata\": { \"name\": \"$name\", \"role\": \"$role\" }
    }" | python3 -c "import sys,json; d=json.load(sys.stdin); print('  OK id=' + d.get('id','?')) if 'id' in d else print('  ERR ' + str(d))"
}

create_user "alumno@kynea.pe"   "alumno"   "Laura García"
create_user "profesor@kynea.pe" "profesor" "Sofía Vega"
create_user "academia@kynea.pe" "academia" "Academia Ritmo Latino"

echo ""
echo "✔ Listo. Login con cualquiera + password: demo1234"
